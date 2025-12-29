import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import Catalog from '../models/catalog.model.js';
import Collection from '../models/collection.model.js';
import Category from '../models/category.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample jewelry data for SNM Jewelry
const jewelryBrands = [
  'Tanishq',
  'Kalyan Jewellers',
  'PC Jeweller',
  'Malabar Gold',
  'Joyalukkas',
  'Senco Gold',
  'Reliance Jewels',
  'Tribhovandas Bhimji Zaveri',
];

const productNames = [
  'Gold Diamond Necklace',
  'Platinum Ring Set',
  'Emerald Pendant',
  'Ruby Earrings',
  'Pearl Bracelet',
  'Sapphire Engagement Ring',
  'Gold Chain 22K',
  'Diamond Stud Earrings',
  'Gold Bangles Set',
  'Silver Anklet',
  'Gold Mangalsutra',
  'Diamond Nose Pin',
  'Gold Kada Bracelet',
  'Kundan Maang Tikka',
  'Diamond Tennis Bracelet',
  'Gold Jhumka Earrings',
  'Pearl Choker Necklace',
  'Gold Temple Jewelry Set',
  'Diamond Solitaire Ring',
  'Gold Coin Pendant',
  'Polki Necklace Set',
  'Gold Hoop Earrings',
  'Diamond Bangle Bracelet',
  'Navratna Ring',
  'Gold Waist Belt',
  'Diamond Finger Ring',
  'Gold Payal Anklet',
  'Antique Jewelry Set',
  'Gold Nose Ring',
  'Diamond Pendant Set',
];

const catalogNames = [
  'Bridal Gold Necklace',
  'Wedding Diamond Set',
  'Festive Gold Bangles',
  'Daily Wear Chain',
  'Party Wear Earrings',
  'Traditional Jewelry Set',
  'Modern Diamond Ring',
  'Lightweight Gold Chain',
  'Designer Bracelet',
  'Ethnic Necklace Set',
  'Contemporary Earrings',
  'Classic Gold Ring',
  'Trendy Pendant',
  'Elegant Choker',
  'Stylish Anklet',
  'Premium Diamond Jewelry',
  'Heritage Collection Set',
  'Minimalist Gold Jewelry',
  'Statement Necklace',
  'Delicate Chain Bracelet',
];

const descriptions = [
  'Exquisite handcrafted jewelry piece with intricate details',
  'Premium quality gold jewelry for special occasions',
  'Traditional design with modern touch',
  'Certified diamonds with excellent cut and clarity',
  'Perfect for daily wear and gifting',
  'Elegant design suitable for all occasions',
  'Handpicked gemstones set in pure gold',
  'Contemporary styling with classic appeal',
  'Timeless piece for your collection',
  'Crafted with precision and care',
];

const imageUrls = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
  'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500',
  'https://images.unsplash.com/photo-1588444837495-c6c01fc44a05?w=500',
  'https://images.unsplash.com/photo-1624356976536-4b132f827700?w=500',
];

// Helper functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomPrice = () => randomInt(5000, 500000);
const randomStock = () => randomInt(5, 100);

async function seedEcommerceData() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/catalog_db';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get existing collections and categories
    const collections = await Collection.find();
    const categories = await Category.find({ level: 'C3' });

    if (collections.length === 0) {
      console.log('⚠️  No collections found. Creating sample collections...');

      // Create sample collections
      const sampleCollections = [
        { name: 'Bridal Collection', description: 'Stunning jewelry for your special day', imageUrl: randomElement(imageUrls) },
        { name: 'Traditional Collection', description: 'Classic designs for all occasions', imageUrl: randomElement(imageUrls) },
        { name: 'Contemporary Collection', description: 'Modern and trendy jewelry', imageUrl: randomElement(imageUrls) },
        { name: 'Diamond Collection', description: 'Premium diamond jewelry', imageUrl: randomElement(imageUrls) },
        { name: 'Gold Collection', description: 'Pure gold ornaments', imageUrl: randomElement(imageUrls) },
      ];

      for (const col of sampleCollections) {
        await Collection.create(col);
      }

      console.log('✅ Created sample collections');
    }

    // Refresh collections list
    const updatedCollections = await Collection.find();

    console.log('\n🔄 Starting to seed e-commerce data...\n');

    // ========================================
    // 1. SEED PRODUCTS (For Collections)
    // ========================================
    console.log('📦 Seeding Products...');

    const productsToCreate = [];

    for (let i = 0; i < 30; i++) {
      const isBestseller = i < 10; // First 10 are bestsellers
      const isTopRated = i >= 5 && i < 15; // Products 5-14 are top rated
      const isFeatured = i >= 10 && i < 20; // Products 10-19 are featured

      productsToCreate.push({
        collectionId: randomElement(updatedCollections)._id,
        title: randomElement(productNames),
        price: randomPrice(),
        URL: randomElement(imageUrls),
        description: randomElement(descriptions),
        stock: randomStock(),
        SKU: `PRD-${1000 + i}`,
        // E-commerce fields
        salesCount: isBestseller ? randomInt(50, 500) : randomInt(0, 30),
        rating: isTopRated ? parseFloat(randomFloat(4.0, 5.0)) : parseFloat(randomFloat(3.0, 4.5)),
        reviewCount: isTopRated ? randomInt(20, 200) : randomInt(0, 15),
        brand: randomElement(jewelryBrands),
        isFeatured: isFeatured,
      });
    }

    await Product.deleteMany({}); // Clear existing products
    await Product.insertMany(productsToCreate);
    console.log(`✅ Created ${productsToCreate.length} products`);

    // ========================================
    // 2. SEED CATALOGS (For Categories)
    // ========================================
    console.log('\n📦 Seeding Catalogs...');

    if (categories.length === 0) {
      console.log('⚠️  No C3 categories found. Skipping catalog seeding.');
      console.log('   Please create categories first using the admin panel.');
    } else {
      const catalogsToCreate = [];

      for (let i = 0; i < 20; i++) {
        const category = randomElement(categories);
        const isBestseller = i < 8; // First 8 are bestsellers
        const isTopRated = i >= 4 && i < 12; // Catalogs 4-11 are top rated
        const isFeatured = i >= 8 && i < 16; // Catalogs 8-15 are featured

        catalogsToCreate.push({
          title: randomElement(catalogNames),
          price: randomPrice(),
          stock: randomStock(),
          SKU: `CAT-${2000 + i}`,
          URL: randomElement(imageUrls),
          category: category._id,
          c3: category._id,
          c2: category.parents && category.parents[0] ? category.parents[0] : null,
          c1: category.parents && category.parents[1] ? category.parents[1] : null,
          // E-commerce fields
          salesCount: isBestseller ? randomInt(60, 600) : randomInt(0, 40),
          rating: isTopRated ? parseFloat(randomFloat(4.0, 5.0)) : parseFloat(randomFloat(3.0, 4.5)),
          reviewCount: isTopRated ? randomInt(25, 250) : randomInt(0, 20),
          brand: randomElement(jewelryBrands),
          isFeatured: isFeatured,
        });
      }

      await Catalog.deleteMany({}); // Clear existing catalogs
      await Catalog.insertMany(catalogsToCreate);
      console.log(`✅ Created ${catalogsToCreate.length} catalogs`);
    }

    // ========================================
    // 3. PRINT STATISTICS
    // ========================================
    console.log('\n📊 Data Statistics:');
    console.log('==================');

    // Products stats
    const totalProducts = await Product.countDocuments();
    const bestsellerProducts = await Product.countDocuments({ salesCount: { $gt: 30 } });
    const topRatedProducts = await Product.countDocuments({ rating: { $gte: 4.0 } });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });

    console.log('\n📦 Products:');
    console.log(`   Total: ${totalProducts}`);
    console.log(`   Best Sellers (sales > 30): ${bestsellerProducts}`);
    console.log(`   Top Rated (rating >= 4.0): ${topRatedProducts}`);
    console.log(`   Featured: ${featuredProducts}`);

    // Catalogs stats
    const totalCatalogs = await Catalog.countDocuments();
    const bestsellerCatalogs = await Catalog.countDocuments({ salesCount: { $gt: 30 } });
    const topRatedCatalogs = await Catalog.countDocuments({ rating: { $gte: 4.0 } });
    const featuredCatalogs = await Catalog.countDocuments({ isFeatured: true });

    console.log('\n📦 Catalogs:');
    console.log(`   Total: ${totalCatalogs}`);
    console.log(`   Best Sellers (sales > 30): ${bestsellerCatalogs}`);
    console.log(`   Top Rated (rating >= 4.0): ${topRatedCatalogs}`);
    console.log(`   Featured: ${featuredCatalogs}`);

    // Brands
    const productBrands = await Product.distinct('brand');
    const catalogBrands = await Catalog.distinct('brand');
    const allBrands = [...new Set([...productBrands, ...catalogBrands])];

    console.log('\n🏷️  Brands:');
    console.log(`   Total unique brands: ${allBrands.length}`);
    console.log(`   Brands: ${allBrands.join(', ')}`);

    // ========================================
    // 4. SAMPLE DATA PREVIEW
    // ========================================
    console.log('\n📋 Sample Data Preview:');
    console.log('=======================');

    console.log('\n🏆 Top 3 Best Selling Products:');
    const topSelling = await Product.find().sort({ salesCount: -1 }).limit(3);
    topSelling.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title} - ${p.salesCount} sales - ₹${p.price}`);
    });

    console.log('\n⭐ Top 3 Rated Products:');
    const topRated = await Product.find({ reviewCount: { $gt: 0 } })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(3);
    topRated.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title} - ${p.rating}★ (${p.reviewCount} reviews) - ₹${p.price}`);
    });

    console.log('\n✨ Featured Brands Preview:');
    const featured = await Product.find({ isFeatured: true }).limit(3);
    featured.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title} - ${p.brand} - ₹${p.price}`);
    });

    console.log('\n✅ Seeding completed successfully!\n');

    // Print API endpoints to test
    console.log('🔗 Test these API endpoints:');
    console.log('============================');
    console.log('   GET http://localhost:8000/api/best-sellers');
    console.log('   GET http://localhost:8000/api/top-rated');
    console.log('   GET http://localhost:8000/api/brands');
    console.log('   GET http://localhost:8000/api/new-arrivals');
    console.log('   GET http://localhost:8000/api/products');
    console.log('   GET http://localhost:8000/api/catalogs');
    console.log('\n🌐 Frontend pages:');
    console.log('   http://localhost:3000/best');
    console.log('   http://localhost:3000/top');
    console.log('   http://localhost:3000/brands');
    console.log('   http://localhost:3000/products/new-arrivals');
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeder
seedEcommerceData()
  .then(() => {
    console.log('✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
