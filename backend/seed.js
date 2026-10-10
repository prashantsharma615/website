/**
 * Sukoon by Pallavi — Seed Script
 * Populates the database with sample products for development.
 * Run: npm run seed
 */

require('dotenv').config();
const db = require('./database');
const { v4: uuidv4 } = require('uuid');

const sampleProducts = [
  // Kurtas & Kurtis
  {
    name: 'Ivory Chikankari Kurta',
    category: 'kurtas',
    price: 2499,
    discount_price: 1999,
    description: 'Elegant hand-embroidered Chikankari kurta in pure cotton. Features intricate floral patterns with a relaxed A-line silhouette. Perfect for everyday elegance.',
    sizes: ['S', 'M', 'L', 'XL'],
    colours: ['Ivory', 'Peach'],
    stock: 15,
    is_featured: 1,
    is_new_arrival: 1,
    images: ['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=800&fit=crop']
  },
  {
    name: 'Dusty Rose Embroidered Kurti',
    category: 'kurtas',
    price: 1899,
    discount_price: null,
    description: 'A beautiful dusty rose kurti with delicate thread embroidery on the yoke. Made from premium rayon for all-day comfort.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colours: ['Dusty Rose', 'Sage Green'],
    stock: 22,
    is_featured: 0,
    is_new_arrival: 1,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop']
  },
  {
    name: 'Midnight Blue Silk Kurta',
    category: 'kurtas',
    price: 3499,
    discount_price: 2999,
    description: 'Luxurious silk kurta in midnight blue with gold zari work on the sleeves and neckline. Ideal for festive occasions.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: ['Midnight Blue', 'Maroon'],
    stock: 8,
    is_featured: 1,
    is_new_arrival: 0,
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop']
  },
  {
    name: 'Cotton Pintuck Kurti',
    category: 'kurtas',
    price: 1299,
    discount_price: null,
    description: 'Classic cotton kurti with elegant pintuck detailing. Lightweight and breathable, perfect for daily wear.',
    sizes: ['S', 'M', 'L', 'XL'],
    colours: ['White', 'Beige', 'Sky Blue'],
    stock: 30,
    is_featured: 0,
    is_new_arrival: 0,
    images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=800&fit=crop']
  },

  // Suits
  {
    name: 'Blush Pink Anarkali Suit',
    category: 'suits',
    price: 4999,
    discount_price: 3999,
    description: 'Stunning blush pink Anarkali suit with heavy sequin work on the dupatta. Comes with matching churidar and net dupatta.',
    sizes: ['S', 'M', 'L', 'XL'],
    colours: ['Blush Pink', 'Powder Blue'],
    stock: 10,
    is_featured: 1,
    is_new_arrival: 1,
    images: ['https://images.unsplash.com/photo-1583391733975-555d3b6e2a5e?w=600&h=800&fit=crop']
  },
  {
    name: 'Olive Green Palazzo Suit',
    category: 'suits',
    price: 3299,
    discount_price: null,
    description: 'Contemporary olive green palazzo suit with mirror work on the kurta. Includes wide-leg palazzos and a matching dupatta.',
    sizes: ['S', 'M', 'L', 'XL'],
    colours: ['Olive Green', 'Mustard'],
    stock: 14,
    is_featured: 0,
    is_new_arrival: 1,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop']
  },
  {
    name: 'Royal Velvet Suit Set',
    category: 'suits',
    price: 5999,
    discount_price: 4999,
    description: 'Premium velvet suit set in deep wine. Features gold tilla embroidery, perfect for weddings and grand celebrations.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colours: ['Wine', 'Emerald Green'],
    stock: 5,
    is_featured: 1,
    is_new_arrival: 0,
    images: ['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=800&fit=crop']
  },

  // Sarees
  {
    name: 'Banarasi Silk Saree',
    category: 'sarees',
    price: 7999,
    discount_price: 6499,
    description: 'Authentic Banarasi silk saree with intricate gold and silver zari weaving. A timeless piece for weddings and festivities.',
    sizes: ['Free Size'],
    colours: ['Red & Gold', 'Navy & Gold'],
    stock: 6,
    is_featured: 1,
    is_new_arrival: 1,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop']
  },
  {
    name: 'Linen Handloom Saree',
    category: 'sarees',
    price: 3999,
    discount_price: null,
    description: 'Pure linen handloom saree with natural dyes. Lightweight, breathable, and perfect for summer occasions.',
    sizes: ['Free Size'],
    colours: ['Natural Beige', 'Indigo', 'Terracotta'],
    stock: 18,
    is_featured: 0,
    is_new_arrival: 1,
    images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=800&fit=crop']
  },
  {
    name: 'Georgette Party Wear Saree',
    category: 'sarees',
    price: 4599,
    discount_price: 3799,
    description: 'Flowing georgette saree with subtle shimmer and sequin border. Comes with a pre-stitched blouse for easy draping.',
    sizes: ['Free Size'],
    colours: ['Champagne', 'Black', 'Teal'],
    stock: 12,
    is_featured: 1,
    is_new_arrival: 0,
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop']
  },

  // Western Dresses
  {
    name: 'Black A-Line Midi Dress',
    category: 'western',
    price: 2999,
    discount_price: 2499,
    description: 'Classic black A-line midi dress with a flattering fit. Features a subtle boat neckline and three-quarter sleeves.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colours: ['Black', 'Navy'],
    stock: 20,
    is_featured: 1,
    is_new_arrival: 1,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop']
  },
  {
    name: 'Floral Wrap Dress',
    category: 'western',
    price: 2299,
    discount_price: null,
    description: 'Charming floral wrap dress with adjustable tie waist. Perfect for brunches, casual outings, and summer days.',
    sizes: ['S', 'M', 'L', 'XL'],
    colours: ['Floral Print', 'Blue Floral'],
    stock: 16,
    is_featured: 0,
    is_new_arrival: 1,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop']
  },
];

// Clear existing data
db.prepare('DELETE FROM product_images').run();
db.prepare('DELETE FROM products').run();

console.log('🌱 Seeding database with sample products...\n');

const insertProduct = db.prepare(`
  INSERT INTO products (id, name, category, price, discount_price, description, sizes, colours, stock, is_featured, is_new_arrival, is_available)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

const insertImage = db.prepare(`
  INSERT INTO product_images (product_id, image_path, sort_order)
  VALUES (?, ?, ?)
`);

sampleProducts.forEach((p, index) => {
  const id = `SKP${String(index + 1).padStart(4, '0')}`;

  insertProduct.run(
    id, p.name, p.category, p.price, p.discount_price,
    p.description,
    JSON.stringify(p.sizes),
    JSON.stringify(p.colours),
    p.stock, p.is_featured, p.is_new_arrival
  );

  p.images.forEach((img, imgIndex) => {
    insertImage.run(id, img, imgIndex);
  });

  console.log(`  ✅ ${p.name} (${id})`);
});

console.log(`\n🎉 Seeded ${sampleProducts.length} products successfully!`);
process.exit(0);
