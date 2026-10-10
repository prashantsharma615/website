/**
 * Sukoon by Pallavi — Express Server
 * Main backend server with API routes, authentication, and static file serving.
 */

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true behind HTTPS in production
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Serve static files from project root
app.use(express.static(path.join(__dirname, '..'), {
  index: 'index.html',
}));

// Serve uploaded images
const uploadsDir = path.join(__dirname, '..', 'images', 'products', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// --------------- Image Upload Config ---------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, and .webp files are allowed.'));
  }
};

const maxSize = (parseInt(process.env.MAX_UPLOAD_SIZE) || 5) * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize },
});

// --------------- Auth Middleware ---------------
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized. Please log in.' });
}

// --------------- Ensure Admin Exists ---------------
function ensureAdminExists() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.warn('⚠️  ADMIN_USERNAME and ADMIN_PASSWORD not set in .env — admin login disabled.');
    return;
  }

  const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get(username);
  if (!existing) {
    const hash = bcrypt.hashSync(password, 12);
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(username, hash);
    console.log(`✅ Admin user "${username}" created.`);
  }
}

ensureAdminExists();

// =============== AUTH API ===============

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  req.session.isAdmin = true;
  req.session.adminUser = username;
  return res.json({ success: true, message: 'Logged in successfully.' });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out.' });
});

// Check auth status
app.get('/api/auth/status', (req, res) => {
  res.json({ isAuthenticated: !!(req.session && req.session.isAdmin) });
});

// =============== PUBLIC PRODUCT API ===============

// Get all products (public)
app.get('/api/products', (req, res) => {
  const { category, search, sort, featured, new_arrivals } = req.query;

  let query = 'SELECT * FROM products WHERE is_available = 1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (featured === '1') {
    query += ' AND is_featured = 1';
  }

  if (new_arrivals === '1') {
    query += ' AND is_new_arrival = 1';
  }

  switch (sort) {
    case 'price_asc':
      query += ' ORDER BY COALESCE(discount_price, price) ASC';
      break;
    case 'price_desc':
      query += ' ORDER BY COALESCE(discount_price, price) DESC';
      break;
    case 'newest':
      query += ' ORDER BY created_at DESC';
      break;
    default:
      query += ' ORDER BY created_at DESC';
  }

  const products = db.prepare(query).all(...params);

  // Attach images
  const imgStmt = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order');
  const result = products.map(p => ({
    ...p,
    sizes: JSON.parse(p.sizes || '[]'),
    colours: JSON.parse(p.colours || '[]'),
    images: imgStmt.all(p.id).map(img => img.image_path),
  }));

  res.json(result);
});

// Get single product (public)
app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const images = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order')
    .all(product.id)
    .map(img => img.image_path);

  res.json({
    ...product,
    sizes: JSON.parse(product.sizes || '[]'),
    colours: JSON.parse(product.colours || '[]'),
    images,
  });
});

// =============== ADMIN PRODUCT API ===============

// Get all products (admin — includes unavailable)
app.get('/api/admin/products', requireAuth, (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  const imgStmt = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order');

  const result = products.map(p => ({
    ...p,
    sizes: JSON.parse(p.sizes || '[]'),
    colours: JSON.parse(p.colours || '[]'),
    images: imgStmt.all(p.id).map(img => img.image_path),
  }));

  res.json(result);
});

// Get dashboard stats
app.get('/api/admin/stats', requireAuth, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  const inStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock > 0').get().count;
  const outOfStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock = 0').get().count;
  const featured = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_featured = 1').get().count;

  res.json({ total, inStock, outOfStock, featured });
});

// Create product
app.post('/api/admin/products', requireAuth, upload.array('images', 10), (req, res) => {
  try {
    const { name, category, price, discount_price, description, sizes, colours, stock, is_featured, is_new_arrival } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Name, category, and price are required.' });
    }

    const id = uuidv4().split('-')[0];
    const parsedPrice = parseFloat(price);
    const parsedDiscount = discount_price ? parseFloat(discount_price) : null;
    const parsedStock = parseInt(stock) || 0;

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Invalid price.' });
    }

    if (parsedDiscount !== null && (isNaN(parsedDiscount) || parsedDiscount <= 0 || parsedDiscount >= parsedPrice)) {
      return res.status(400).json({ error: 'Discount price must be less than regular price.' });
    }

    db.prepare(`
      INSERT INTO products (id, name, category, price, discount_price, description, sizes, colours, stock, is_featured, is_new_arrival, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      id, name, category, parsedPrice, parsedDiscount,
      description || '',
      sizes || '[]',
      colours || '[]',
      parsedStock,
      is_featured === '1' || is_featured === 'true' ? 1 : 0,
      is_new_arrival === '1' || is_new_arrival === 'true' ? 1 : 0
    );

    // Save images
    if (req.files && req.files.length > 0) {
      const imgStmt = db.prepare('INSERT INTO product_images (product_id, image_path, sort_order) VALUES (?, ?, ?)');
      req.files.forEach((file, index) => {
        const imgPath = `/images/products/uploads/${file.filename}`;
        imgStmt.run(id, imgPath, index);
      });
    }

    res.json({ success: true, id, message: 'Product created successfully.' });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// Update product
app.put('/api/admin/products/:id', requireAuth, upload.array('images', 10), (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const { name, category, price, discount_price, description, sizes, colours, stock, is_featured, is_new_arrival, is_available, remove_images } = req.body;

    const parsedPrice = parseFloat(price);
    const parsedDiscount = discount_price ? parseFloat(discount_price) : null;

    if (!name || !category || isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Name, category, and valid price are required.' });
    }

    db.prepare(`
      UPDATE products SET
        name = ?, category = ?, price = ?, discount_price = ?,
        description = ?, sizes = ?, colours = ?,
        stock = ?, is_featured = ?, is_new_arrival = ?, is_available = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name, category, parsedPrice, parsedDiscount,
      description || '',
      sizes || '[]',
      colours || '[]',
      parseInt(stock) || 0,
      is_featured === '1' || is_featured === 'true' ? 1 : 0,
      is_new_arrival === '1' || is_new_arrival === 'true' ? 1 : 0,
      is_available === '0' || is_available === 'false' ? 0 : 1,
      req.params.id
    );

    // Remove selected images
    if (remove_images) {
      const toRemove = JSON.parse(remove_images);
      toRemove.forEach(imgPath => {
        db.prepare('DELETE FROM product_images WHERE product_id = ? AND image_path = ?').run(req.params.id, imgPath);
        // Delete file
        const fullPath = path.join(__dirname, '..', imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const maxOrder = db.prepare('SELECT MAX(sort_order) as max_order FROM product_images WHERE product_id = ?')
        .get(req.params.id);
      let order = (maxOrder?.max_order || 0) + 1;

      const imgStmt = db.prepare('INSERT INTO product_images (product_id, image_path, sort_order) VALUES (?, ?, ?)');
      req.files.forEach((file) => {
        const imgPath = `/images/products/uploads/${file.filename}`;
        imgStmt.run(req.params.id, imgPath, order++);
      });
    }

    res.json({ success: true, message: 'Product updated successfully.' });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// Delete product
app.delete('/api/admin/products/:id', requireAuth, (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Delete associated images from disk
    const images = db.prepare('SELECT image_path FROM product_images WHERE product_id = ?').all(req.params.id);
    images.forEach(img => {
      const fullPath = path.join(__dirname, '..', img.image_path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    db.prepare('DELETE FROM product_images WHERE product_id = ?').run(req.params.id);
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// --------------- Error Handling ---------------
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: `File too large. Maximum size is ${process.env.MAX_UPLOAD_SIZE || 5}MB.` });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// --------------- Start Server ---------------
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     Sukoon by Pallavi — Server          ║
  ║     Running at http://localhost:${PORT}     ║
  ╚══════════════════════════════════════════╝
  `);
});
