-- ============================================================
--  Login System Database Setup
--  Run this script BEFORE starting the Spring Boot backend
-- ============================================================

CREATE DATABASE IF NOT EXISTS login_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE login_db;

-- users table (Hibernate will auto-create/update via ddl-auto=update)
-- This seed script adds default Admin and Customer accounts.
-- Passwords are BCrypt-encoded.
--   admin      -> password: admin123
--   customer1  -> password: customer123

INSERT IGNORE INTO users (username, email, password, role) VALUES
(
  'admin',
  'admin@example.com',
  '$2a$10$7EqJtq98hPqEX7fNZaFWoO0uz6sa/wBmtA5bfVGwHN3MdaxFaBajS',  -- admin123
  'ADMIN'
),
(
  'customer1',
  'customer1@example.com',
  '$2a$10$ByIUiNaRfBKSV4URgRGSI.LR7TnGBQPGJdUnL8BwxMRYHXKw.3mLO',  -- customer123
  'CUSTOMER'
);

-- seed products with clothing data
-- Hibernate will create columns based on the model, but we can seed some data here
-- Note: Hibernate might drop/create tables, so we use INSERT IGNORE and assume 
-- columns exist or will be created.

INSERT IGNORE INTO products (name, price, rental_price, category, description, image_url, tag, rating, reviews, size, color, material, is_rentable, is_purchasable) VALUES
(
  'Midnight Navy Evening Gown',
  499.00,
  85.00,
  'Evening Wear',
  'Stunning midnight navy silk gown, perfect for galas and formal events.',
  'https://images.unsplash.com/photo-1539109132332-629ee879a528?auto=format&fit=crop&w=600&q=80',
  'Premium',
  4.9,
  24,
  'M',
  'Navy',
  'Silk',
  1,
  1
),
(
  'Classic Charcoal Tailored Suit',
  750.00,
  120.00,
  'Formal Wear',
  'Italian wool slim fit suit in classic charcoal grey.',
  'https://images.unsplash.com/photo-1594932224010-74f43c39370a?auto=format&fit=crop&w=600&q=80',
  'Best Seller',
  4.8,
  15,
  '42R',
  'Charcoal',
  'Wool',
  1,
  1
),
(
  'Floral Summer Sundress',
  89.00,
  25.00,
  'Casual',
  'Lightweight cotton sundress with vintage floral print.',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
  'New',
  4.7,
  42,
  'S',
  'Floral',
  'Cotton',
  1,
  1
);
