import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'petites_annonces',
  charset: 'utf8mb4'
};

let db;

async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MariaDB database');
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

async function createTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      role ENUM('user', 'admin') DEFAULT 'user',
      email_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      icon VARCHAR(10),
      order_index INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS subcategories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL,
      order_index INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
      UNIQUE KEY unique_category_slug (category_id, slug)
    )`,
    
    `CREATE TABLE IF NOT EXISTS ads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      category_id INT NOT NULL,
      subcategory_id INT,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      condition_state ENUM('neuf', 'excellent', 'bon', 'correct', 'pour-pieces') DEFAULT 'bon',
      location VARCHAR(200) NOT NULL,
      status ENUM('active', 'sold', 'expired', 'pending', 'rejected') DEFAULT 'pending',
      featured BOOLEAN DEFAULT FALSE,
      views INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
    )`,
    
    `CREATE TABLE IF NOT EXISTS ad_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ad_id INT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      order_index INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS form_fields (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      field_type ENUM('text', 'textarea', 'select', 'checkbox', 'radio', 'number', 'email', 'tel') NOT NULL,
      field_name VARCHAR(100) NOT NULL,
      field_label VARCHAR(200) NOT NULL,
      field_options JSON,
      required BOOLEAN DEFAULT FALSE,
      order_index INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS email_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      smtp_host VARCHAR(255) NOT NULL,
      smtp_port INT NOT NULL,
      smtp_secure BOOLEAN DEFAULT TRUE,
      smtp_user VARCHAR(255) NOT NULL,
      smtp_password VARCHAR(255) NOT NULL,
      from_email VARCHAR(255) NOT NULL,
      from_name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  ];

  for (const table of tables) {
    await db.execute(table);
  }

  // Insert default categories if none exist
  const [categories] = await db.execute('SELECT COUNT(*) as count FROM categories');
  if (categories[0].count === 0) {
    await insertDefaultCategories();
  }

  // Create admin user if none exists
  const [admins] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "admin"');
  if (admins[0].count === 0) {
    await createDefaultAdmin();
  }
}

async function insertDefaultCategories() {
  const defaultCategories = [
    { name: 'Véhicules', slug: 'vehicules', icon: '🚗', subcategories: ['Voitures', 'Motos', 'Vélos', 'Utilitaires'] },
    { name: 'Immobilier', slug: 'immobilier', icon: '🏠', subcategories: ['Vente', 'Location', 'Colocation', 'Bureaux'] },
    { name: 'Emploi', slug: 'emploi', icon: '💼', subcategories: ['CDI', 'CDD', 'Freelance', 'Stage'] },
    { name: 'Multimédia', slug: 'multimedia', icon: '📱', subcategories: ['Téléphones', 'Ordinateurs', 'TV/Audio', 'Jeux vidéo'] },
    { name: 'Mode', slug: 'mode', icon: '👕', subcategories: ['Vêtements femme', 'Vêtements homme', 'Chaussures', 'Accessoires'] },
    { name: 'Maison & Jardin', slug: 'maison-jardin', icon: '🏡', subcategories: ['Mobilier', 'Électroménager', 'Décoration', 'Jardinage'] }
  ];

  for (let i = 0; i < defaultCategories.length; i++) {
    const category = defaultCategories[i];
    const [result] = await db.execute(
      'INSERT INTO categories (name, slug, icon, order_index) VALUES (?, ?, ?, ?)',
      [category.name, category.slug, category.icon, i + 1]
    );

    const categoryId = result.insertId;

    for (let j = 0; j < category.subcategories.length; j++) {
      const subcategoryName = category.subcategories[j];
      const subcategorySlug = subcategoryName.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      await db.execute(
        'INSERT INTO subcategories (category_id, name, slug, order_index) VALUES (?, ?, ?, ?)',
        [categoryId, subcategoryName, subcategorySlug, j + 1]
      );
    }
  }
}

async function createDefaultAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await db.execute(
    'INSERT INTO users (email, password, first_name, last_name, role, email_verified) VALUES (?, ?, ?, ?, ?, ?)',
    ['admin@petitesannonces.fr', hashedPassword, 'Admin', 'System', 'admin', true]
  );
  console.log('Default admin user created: admin@petitesannonces.fr / admin123');
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 8
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Email configuration
let transporter;

async function initEmailTransporter() {
  try {
    const [settings] = await db.execute('SELECT * FROM email_settings ORDER BY id DESC LIMIT 1');
    
    if (settings.length > 0) {
      const config = settings[0];
      transporter = nodemailer.createTransporter({
        host: config.smtp_host,
        port: config.smtp_port,
        secure: config.smtp_secure,
        auth: {
          user: config.smtp_user,
          pass: config.smtp_password
        }
      });
    }
  } catch (error) {
    console.log('Email transporter not configured');
  }
}

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware to verify admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [result] = await db.execute(
      'INSERT INTO users (email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, phone]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        email,
        firstName,
        lastName,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/validate', authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    firstName: req.user.first_name,
    lastName: req.user.last_name,
    role: req.user.role
  });
});

// Categories routes
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await db.execute(`
      SELECT c.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', s.id,
                 'name', s.name,
                 'slug', s.slug,
                 'order_index', s.order_index
               )
             ) as subcategories
      FROM categories c
      LEFT JOIN subcategories s ON c.id = s.category_id
      GROUP BY c.id
      ORDER BY c.order_index
    `);

    res.json(categories.map(cat => ({
      ...cat,
      subcategories: cat.subcategories[0].id ? cat.subcategories : []
    })));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Ads routes
app.post('/api/ads', authenticateToken, upload.array('images', 8), async (req, res) => {
  try {
    const { title, description, price, category, subcategory, condition, location } = req.body;
    const userId = req.user.id;

    // Get category and subcategory IDs
    const [categories] = await db.execute('SELECT id FROM categories WHERE slug = ?', [category]);
    if (categories.length === 0) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const categoryId = categories[0].id;
    let subcategoryId = null;

    if (subcategory) {
      const [subcategories] = await db.execute(
        'SELECT id FROM subcategories WHERE slug = ? AND category_id = ?',
        [subcategory, categoryId]
      );
      if (subcategories.length > 0) {
        subcategoryId = subcategories[0].id;
      }
    }

    // Create ad
    const [result] = await db.execute(`
      INSERT INTO ads (user_id, category_id, subcategory_id, title, description, price, condition_state, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, categoryId, subcategoryId, title, description, price, condition, location]);

    const adId = result.insertId;

    // Save images
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        await db.execute(
          'INSERT INTO ad_images (ad_id, filename, original_name, order_index) VALUES (?, ?, ?, ?)',
          [adId, file.filename, file.originalname, i]
        );
      }
    }

    res.status(201).json({ id: adId, message: 'Ad created successfully' });
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ error: 'Failed to create ad' });
  }
});

app.get('/api/ads', async (req, res) => {
  try {
    const { category, subcategory, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, u.first_name, u.last_name, c.name as category_name, s.name as subcategory_name,
             GROUP_CONCAT(ai.filename ORDER BY ai.order_index) as images
      FROM ads a
      JOIN users u ON a.user_id = u.id
      JOIN categories c ON a.category_id = c.id
      LEFT JOIN subcategories s ON a.subcategory_id = s.id
      LEFT JOIN ad_images ai ON a.id = ai.ad_id
      WHERE a.status = 'active'
    `;

    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (subcategory) {
      query += ' AND s.slug = ?';
      params.push(subcategory);
    }

    if (search) {
      query += ' AND (a.title LIKE ? OR a.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY a.id ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [ads] = await db.execute(query, params);

    res.json(ads.map(ad => ({
      ...ad,
      images: ad.images ? ad.images.split(',') : []
    })));
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

// Admin routes
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [adCount] = await db.execute('SELECT COUNT(*) as count FROM ads');
    const [activeAdCount] = await db.execute('SELECT COUNT(*) as count FROM ads WHERE status = "active"');
    const [pendingAdCount] = await db.execute('SELECT COUNT(*) as count FROM ads WHERE status = "pending"');

    res.json({
      totalUsers: userCount[0].count,
      totalAds: adCount[0].count,
      activeAds: activeAdCount[0].count,
      pendingAds: pendingAdCount[0].count,
      monthlyViews: 45678, // This would come from analytics
      monthlyRevenue: 2340 // This would come from payment system
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, email, first_name, last_name, phone, role, email_verified, created_at FROM users';
    const params = [];

    if (search) {
      query += ' WHERE email LIKE ? OR first_name LIKE ? OR last_name LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await db.execute(query, params);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Email settings routes
app.get('/api/admin/email-settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [settings] = await db.execute('SELECT * FROM email_settings ORDER BY id DESC LIMIT 1');
    res.json(settings[0] || {});
  } catch (error) {
    console.error('Error fetching email settings:', error);
    res.status(500).json({ error: 'Failed to fetch email settings' });
  }
});

app.post('/api/admin/email-settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { smtp_host, smtp_port, smtp_secure, smtp_user, smtp_password, from_email, from_name } = req.body;

    // Delete existing settings
    await db.execute('DELETE FROM email_settings');

    // Insert new settings
    await db.execute(`
      INSERT INTO email_settings (smtp_host, smtp_port, smtp_secure, smtp_user, smtp_password, from_email, from_name)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [smtp_host, smtp_port, smtp_secure, smtp_user, smtp_password, from_email, from_name]);

    // Reinitialize email transporter
    await initEmailTransporter();

    res.json({ message: 'Email settings updated successfully' });
  } catch (error) {
    console.error('Error updating email settings:', error);
    res.status(500).json({ error: 'Failed to update email settings' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
initDatabase().then(() => {
  initEmailTransporter();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
});

export default app;