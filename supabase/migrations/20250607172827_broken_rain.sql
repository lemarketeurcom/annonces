-- PetitesAnnonces Database Schema
-- Compatible with MariaDB/MySQL

CREATE DATABASE IF NOT EXISTS petites_annonces CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE petites_annonces;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    avatar VARCHAR(255),
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(10),
    description TEXT,
    order_index INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_order (order_index)
);

-- Subcategories table
CREATE TABLE subcategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_slug (category_id, slug),
    INDEX idx_category_slug (category_id, slug)
);

-- Ads table
CREATE TABLE ads (
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
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id),
    INDEX idx_status (status),
    INDEX idx_category (category_id),
    INDEX idx_location (location),
    INDEX idx_price (price),
    INDEX idx_created (created_at),
    FULLTEXT idx_search (title, description)
);

-- Ad images table
CREATE TABLE ad_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
    INDEX idx_ad_order (ad_id, order_index)
);

-- Form fields for dynamic forms
CREATE TABLE form_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    field_type ENUM('text', 'textarea', 'select', 'checkbox', 'radio', 'number', 'email', 'tel', 'url', 'date') NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(200) NOT NULL,
    field_placeholder VARCHAR(200),
    field_options JSON,
    validation_rules JSON,
    required BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category_order (category_id, order_index)
);

-- Ad custom field values
CREATE TABLE ad_custom_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT NOT NULL,
    field_id INT NOT NULL,
    field_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES form_fields(id) ON DELETE CASCADE,
    UNIQUE KEY unique_ad_field (ad_id, field_id)
);

-- Email settings
CREATE TABLE email_settings (
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
);

-- Email templates
CREATE TABLE email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    variables JSON,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User favorites
CREATE TABLE user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ad_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_ad (user_id, ad_id)
);

-- Messages between users
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT NOT NULL,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_recipient (recipient_id),
    INDEX idx_ad (ad_id)
);

-- Reports/flags
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT NOT NULL,
    reporter_id INT,
    reason ENUM('spam', 'inappropriate', 'fake', 'sold', 'other') NOT NULL,
    description TEXT,
    status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status)
);

-- System settings
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, slug, icon, order_index) VALUES
('Véhicules', 'vehicules', '🚗', 1),
('Immobilier', 'immobilier', '🏠', 2),
('Emploi', 'emploi', '💼', 3),
('Multimédia', 'multimedia', '📱', 4),
('Mode', 'mode', '👕', 5),
('Maison & Jardin', 'maison-jardin', '🏡', 6),
('Loisirs', 'loisirs', '🎯', 7),
('Services', 'services', '🔧', 8);

-- Insert default subcategories
INSERT INTO subcategories (category_id, name, slug, order_index) VALUES
-- Véhicules
(1, 'Voitures', 'voitures', 1),
(1, 'Motos', 'motos', 2),
(1, 'Vélos', 'velos', 3),
(1, 'Utilitaires', 'utilitaires', 4),
(1, 'Pièces détachées', 'pieces-detachees', 5),

-- Immobilier
(2, 'Vente', 'vente', 1),
(2, 'Location', 'location', 2),
(2, 'Colocation', 'colocation', 3),
(2, 'Bureaux', 'bureaux', 4),
(2, 'Terrains', 'terrains', 5),

-- Emploi
(3, 'CDI', 'cdi', 1),
(3, 'CDD', 'cdd', 2),
(3, 'Freelance', 'freelance', 3),
(3, 'Stage', 'stage', 4),
(3, 'Temps partiel', 'temps-partiel', 5),

-- Multimédia
(4, 'Téléphones', 'telephones', 1),
(4, 'Ordinateurs', 'ordinateurs', 2),
(4, 'TV/Audio', 'tv-audio', 3),
(4, 'Jeux vidéo', 'jeux-video', 4),
(4, 'Photo/Vidéo', 'photo-video', 5),

-- Mode
(5, 'Vêtements femme', 'vetements-femme', 1),
(5, 'Vêtements homme', 'vetements-homme', 2),
(5, 'Chaussures', 'chaussures', 3),
(5, 'Accessoires', 'accessoires', 4),
(5, 'Bijoux', 'bijoux', 5),

-- Maison & Jardin
(6, 'Mobilier', 'mobilier', 1),
(6, 'Électroménager', 'electromenager', 2),
(6, 'Décoration', 'decoration', 3),
(6, 'Jardinage', 'jardinage', 4),
(6, 'Bricolage', 'bricolage', 5),

-- Loisirs
(7, 'Sports', 'sports', 1),
(7, 'Livres', 'livres', 2),
(7, 'Musique', 'musique', 3),
(7, 'Jeux/Jouets', 'jeux-jouets', 4),
(7, 'Collection', 'collection', 5),

-- Services
(8, 'Cours particuliers', 'cours-particuliers', 1),
(8, 'Garde d\'enfants', 'garde-enfants', 2),
(8, 'Ménage', 'menage', 3),
(8, 'Jardinage', 'jardinage-service', 4),
(8, 'Informatique', 'informatique', 5);

-- Insert default email templates
INSERT INTO email_templates (name, subject, body, variables) VALUES
('welcome', 'Bienvenue sur PetitesAnnonces', 
'Bonjour {{firstName}},\n\nBienvenue sur PetitesAnnonces ! Votre compte a été créé avec succès.\n\nVous pouvez maintenant :\n- Publier vos annonces\n- Rechercher des articles\n- Contacter les vendeurs\n\nCordialement,\nL\'équipe PetitesAnnonces', 
'["firstName", "email"]'),

('ad_published', 'Votre annonce a été publiée', 
'Bonjour {{firstName}},\n\nVotre annonce "{{adTitle}}" a été publiée avec succès et est maintenant visible par tous les utilisateurs.\n\nVous pouvez la consulter à l\'adresse suivante :\n{{adUrl}}\n\nCordialement,\nL\'équipe PetitesAnnonces', 
'["firstName", "adTitle", "adUrl"]'),

('ad_contact', 'Nouveau message pour votre annonce', 
'Bonjour {{firstName}},\n\nVous avez reçu un nouveau message concernant votre annonce "{{adTitle}}" :\n\n{{message}}\n\nDe la part de : {{senderName}} ({{senderEmail}})\n\nCordialement,\nL\'équipe PetitesAnnonces', 
'["firstName", "adTitle", "message", "senderName", "senderEmail"]');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'PetitesAnnonces', 'string', 'Nom du site'),
('site_description', 'La plateforme de référence pour vos petites annonces', 'string', 'Description du site'),
('max_images_per_ad', '8', 'number', 'Nombre maximum d\'images par annonce'),
('ad_expiry_days', '30', 'number', 'Durée de vie d\'une annonce en jours'),
('require_email_verification', 'false', 'boolean', 'Vérification email obligatoire'),
('moderate_ads', 'true', 'boolean', 'Modération des annonces avant publication'),
('allow_guest_contact', 'false', 'boolean', 'Autoriser les invités à contacter les vendeurs');