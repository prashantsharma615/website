/**
 * Sukoon by Pallavi — Configuration
 * All business details, contact information, categories, and initial catalog.
 */

const CONFIG = {
  businessName: 'Sukoon by Pallavi',
  ownerName: 'Pallavi Gupta',
  phone: '7006181540',
  whatsappNumber: '917006181540', // country code + number
  currency: '₹',
  apiBase: '/api',

  // Social media links (can be updated anytime)
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    pinterest: 'https://pinterest.com',
  },

  // Categories
  categories: [
    { id: 'kurtas', name: 'Kurtas & Kurtis', slug: 'kurtas' },
    { id: 'suits', name: 'Suits', slug: 'suits' },
    { id: 'sarees', name: 'Sarees', slug: 'sarees' },
    { id: 'western', name: 'Western Dresses', slug: 'western' },
  ],

  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

  // Default fallback products (used for initial state and static viewing)
  defaultProducts: [
    {
      id: 'SKP0001',
      name: 'Ivory Chikankari Kurta',
      category: 'kurtas',
      price: 2499,
      discount_price: 1999,
      description: 'Elegant hand-embroidered Chikankari kurta in pure breathable cotton. Features intricate floral thread patterns with a relaxed A-line silhouette. Perfect for everyday grace and comfort.',
      sizes: ['S', 'M', 'L', 'XL'],
      colours: ['Ivory', 'Peach'],
      stock: 15,
      is_featured: 1,
      is_new_arrival: 1,
      is_available: 1,
      created_at: '2026-03-01T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'
      ]
    },
    {
      id: 'SKP0002',
      name: 'Dusty Rose Embroidered Kurti',
      category: 'kurtas',
      price: 1899,
      discount_price: null,
      description: 'A beautiful dusty rose kurti with delicate thread embroidery on the yoke. Tailored from premium rayon for an effortlessly soft and graceful drape.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colours: ['Dusty Rose', 'Sage Green'],
      stock: 22,
      is_featured: 0,
      is_new_arrival: 1,
      is_available: 1,
      created_at: '2026-03-05T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'
      ]
    },
    {
      id: 'SKP0003',
      name: 'Midnight Blue Silk Kurta',
      category: 'kurtas',
      price: 3499,
      discount_price: 2999,
      description: 'Luxurious raw silk kurta in deep midnight blue with antique gold zari accents on sleeves and neckline. Designed for festive soirees and family celebrations.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colours: ['Midnight Blue', 'Maroon'],
      stock: 8,
      is_featured: 1,
      is_new_arrival: 0,
      is_available: 1,
      created_at: '2026-02-20T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop'
      ]
    },
    {
      id: 'SKP0004',
      name: 'Cotton Pintuck Daily Kurti',
      category: 'kurtas',
      price: 1299,
      discount_price: null,
      description: 'Classic pure cotton kurti with delicate pintuck detailing across the chest. Featherlight, breathable, and designed for day-long work and leisure comfort.',
      sizes: ['S', 'M', 'L', 'XL'],
      colours: ['White', 'Beige', 'Sky Blue'],
      stock: 30,
      is_featured: 0,
      is_new_arrival: 0,
      is_available: 1,
      created_at: '2026-02-15T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=800&fit=crop'
      ]
    },
    {
      id: 'SKP0005',
      name: 'Blush Pink Anarkali Suit',
      category: 'suits',
      price: 4999,
      discount_price: 3999,
      description: 'Flowing blush pink Anarkali suit set with subtle sequin embellishments on the net dupatta. Includes tailored churidar and flared kurta with sweetheart neck.',
      sizes: ['S', 'M', 'L', 'XL'],
      colours: ['Blush Pink', 'Powder Blue'],
      stock: 10,
      is_featured: 1,
      is_new_arrival: 1,
      is_available: 1,
      created_at: '2026-03-08T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1583391733975-555d3b6e2a5e?w=600&h=800&fit=crop'
      ]
    },
    {
      id: 'SKP0006',
      name: 'Olive Green Palazzo Suit',
      category: 'suits',
      price: 3299,
      discount_price: null,
      description: 'Modern straight-cut kurta paired with wide-leg breezy palazzos and floral organza dupatta. Embellished with delicate foil mirror-work embroidery.',
      sizes: ['S', 'M', 'L', 'XL'],
      colours: ['Olive Green', 'Mustard'],
      stock: 14,
      is_featured: 0,
      is_new_arrival: 1,
      is_available: 1,
      created_at: '2026-03-04T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'
      ]
    },
    {
      id: 'SKP0007',
      name: 'Royal Velvet Festive Suit Set',
      category: 'suits',
      price: 5999,
      discount_price: 4999,
      description: 'Opulent micro-velvet suit set in rich wine tones. Styled with Kashmiri tilla needlework borders, accompanied by embroidered pants and silk dupatta.',
      sizes: ['M', 'L', 'XL', 'XXL'],
      colours: ['Wine', 'Emerald Green'],
      stock: 5,
      is_featured: 1,
      is_new_arrival: 0,
      is_available: 1,
      created_at: '2026-02-18T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=800&fit=crop'
      ]
    },
    {
      id: 'SKP0008',
      name: 'Banarasi Silk Heritage Saree',
      category: 'sarees',
      price: 7999,
      discount_price: 6499,
      description: 'Pure Katan Banarasi silk saree woven with intricate kadwa gold and silver zari floral motifs. An heirloom piece for weddings and special occasions.',
      sizes: ['Free Size'],
      colours: ['Red & Gold', 'Navy & Gold'],
      stock: 6,
      is_featured: 1,
      is_new_arrival: 1,
      is_available: 1,
      created_at: '2026-03-07T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop'
      ]
    },
    {
      id: 'SKP0009',
      name: 'Linen Handloom Organic Saree',
      category: 'sarees',
      price: 3999,
      discount_price: null,
      description: 'Pure 100-count handloom linen saree naturally dyed in earthy tones. Subtle metallic silver selvedge with a tasseled pallu for effortless modern grace.',
      sizes: ['Free Size'],
      colours: ['Natural Beige', 'Indigo', 'Terracotta'],
      stock: 18,
      is_featured: 0,
      is_new_arrival: 1,
      is_available: 1,
      created_at: '2026-03-02T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=800&fit=crop'
      ]
    },
    {
      id: 'SKP0010',
      name: 'Georgette Party Wear Saree',
      category: 'sarees',
      price: 4599,
      discount_price: 3799,
      description: 'Feather-light flowing faux georgette saree featuring an all-over micro-shimmer weave and delicate cut-work border. Comes with unstitched blouse fabric.',
      sizes: ['Free Size'],
      colours: ['Champagne', 'Black', 'Teal'],
      stock: 12,
      is_featured: 1,
      is_new_arrival: 0,
      is_available: 1,
      created_at: '2026-02-22T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop'
      ]
    },
    {
      id: 'SKP0011',
      name: 'Black A-Line Midi Dress',
      category: 'western',
      price: 2999,
      discount_price: 2499,
      description: 'A timeless little black dress crafted from premium crepe. Tailored with an elegant boat neckline, three-quarter sleeves, and hidden side seam pockets.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colours: ['Black', 'Navy'],
      stock: 20,
      is_featured: 1,
      is_new_arrival: 1,
      is_available: 1,
      created_at: '2026-03-06T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop'
      ]
    },
    {
      id: 'SKP0012',
      name: 'Floral Chiffon Wrap Dress',
      category: 'western',
      price: 2299,
      discount_price: null,
      description: 'Romantic floral wrap dress in airy chiffon with full viscose lining. Flattering V-neck with adjustable tie waist, ruffled hem, and gathered cuffs.',
      sizes: ['S', 'M', 'L', 'XL'],
      colours: ['Floral Print', 'Blue Floral'],
      stock: 16,
      is_featured: 0,
      is_new_arrival: 1,
      is_available: 1,
      created_at: '2026-03-03T10:00:00Z',
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop'
      ]
    }
  ]
};

// Make config available globally
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
