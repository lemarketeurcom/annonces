# Installation Guide - PetitesAnnonces

This guide will help you install and configure the PetitesAnnonces classified ads website on a VPS with Nginx and Plesk.

## Prerequisites

- VPS with Ubuntu 20.04+ or CentOS 8+
- Plesk Panel (optional but recommended)
- Node.js 18+ and npm
- MariaDB 10.5+ or MySQL 8.0+
- Nginx
- SSL certificate (Let's Encrypt recommended)

## Step 1: Server Preparation

### Update your system
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install MariaDB
```bash
sudo apt install mariadb-server mariadb-client -y
sudo mysql_secure_installation
```

### Install Nginx (if not using Plesk)
```bash
sudo apt install nginx -y
```

## Step 2: Database Setup

### Create database and user
```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE petites_annonces CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pa_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON petites_annonces.* TO 'pa_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Import database schema
```bash
mysql -u pa_user -p petites_annonces < database/schema.sql
```

## Step 3: Application Setup

### Clone or upload the application
```bash
cd /var/www
sudo mkdir petitesannonces
sudo chown $USER:$USER petitesannonces
cd petitesannonces
# Upload your application files here
```

### Install dependencies
```bash
npm install
```

### Configure environment variables
```bash
cp .env.example .env
nano .env
```

Update the `.env` file with your configuration:
```env
DB_HOST=localhost
DB_USER=pa_user
DB_PASSWORD=your_secure_password
DB_NAME=petites_annonces

JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

PORT=3001
FRONTEND_URL=https://your-domain.com

# Email configuration (optional - can be set via admin panel)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@domain.com
SMTP_PASSWORD=your_email_password
FROM_EMAIL=noreply@your-domain.com
FROM_NAME=PetitesAnnonces
```

### Build the frontend
```bash
npm run build
```

### Create uploads directory
```bash
mkdir -p server/uploads
chmod 755 server/uploads
```

## Step 4: Process Management with PM2

### Install PM2
```bash
sudo npm install -g pm2
```

### Create PM2 ecosystem file
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'petitesannonces',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/pm2/petitesannonces-error.log',
    out_file: '/var/log/pm2/petitesannonces-out.log',
    log_file: '/var/log/pm2/petitesannonces.log',
    time: true
  }]
};
```

### Start the application
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 5: Nginx Configuration

### Copy the Nginx configuration
```bash
sudo cp nginx/petitesannonces.conf /etc/nginx/sites-available/
```

### Edit the configuration
```bash
sudo nano /etc/nginx/sites-available/petitesannonces.conf
```

Update the following:
- Replace `your-domain.com` with your actual domain
- Update SSL certificate paths
- Adjust file paths if needed

### Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/petitesannonces.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: SSL Certificate (Let's Encrypt)

### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Obtain SSL certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Step 7: Plesk Configuration (if using Plesk)

### Create a new domain in Plesk
1. Go to Plesk Panel
2. Add a new domain
3. Set document root to `/var/www/petitesannonces/dist`

### Configure Node.js in Plesk
1. Go to your domain settings
2. Enable Node.js
3. Set application root to `/var/www/petitesannonces`
4. Set application startup file to `server/index.js`
5. Set environment variables from your `.env` file

### Configure Nginx in Plesk
1. Go to Apache & Nginx Settings
2. Add the proxy configuration for `/api/` routes
3. Enable serving static files

## Step 8: Email Configuration

### Configure SMTP (if using external provider)
The application supports various SMTP providers:

#### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Plesk Mail Server
```env
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@your-domain.com
SMTP_PASSWORD=your-email-password
```

### Test email functionality
You can configure email settings through the admin panel at `/admin/email`.

## Step 9: Security Hardening

### Firewall configuration
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### File permissions
```bash
sudo chown -R www-data:www-data /var/www/petitesannonces
sudo chmod -R 755 /var/www/petitesannonces
sudo chmod -R 775 /var/www/petitesannonces/server/uploads
```

### Database security
- Use strong passwords
- Limit database user privileges
- Enable MariaDB firewall if needed

## Step 10: Monitoring and Maintenance

### Log monitoring
```bash
# Application logs
pm2 logs petitesannonces

# Nginx logs
sudo tail -f /var/log/nginx/petitesannonces_access.log
sudo tail -f /var/log/nginx/petitesannonces_error.log

# System logs
sudo journalctl -u nginx -f
```

### Backup strategy
Create regular backups of:
- Database: `mysqldump -u pa_user -p petites_annonces > backup.sql`
- Uploaded files: `/var/www/petitesannonces/server/uploads`
- Configuration files

### Updates
```bash
# Update application
git pull origin main  # if using git
npm install
npm run build
pm2 restart petitesannonces

# Update system
sudo apt update && sudo apt upgrade -y
```

## Default Admin Account

After installation, you can log in with:
- Email: `admin@petitesannonces.fr`
- Password: `admin123`

**Important:** Change this password immediately after first login!

## Troubleshooting

### Common issues:

1. **Database connection errors**
   - Check database credentials in `.env`
   - Verify MariaDB is running: `sudo systemctl status mariadb`

2. **File upload issues**
   - Check uploads directory permissions
   - Verify Nginx client_max_body_size setting

3. **Email not working**
   - Test SMTP settings in admin panel
   - Check firewall rules for SMTP ports

4. **Application not starting**
   - Check PM2 logs: `pm2 logs petitesannonces`
   - Verify Node.js version: `node --version`

### Support
For additional support, check the application logs and ensure all prerequisites are properly installed and configured.