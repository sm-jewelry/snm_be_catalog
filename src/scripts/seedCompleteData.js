import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import Catalog from '../models/catalog.model.js';
import Collection from '../models/collection.model.js';
import Category from '../models/category.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Enhanced jewelry data
const jewelryBrands = [
  'Tanishq', 'Kalyan Jewellers', 'PC Jeweller', 'Malabar Gold',
  'Joyalukkas', 'Senco Gold', 'Reliance Jewels', 'Tribhovandas Bhimji Zaveri',
];

const collectionData = [
  {
    name: 'Bridal Collection',
    description: 'Stunning jewelry for your special day',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    products: ['Bridal Necklace Set', 'Wedding Diamond Ring', 'Bridal Gold Bangles', 'Wedding Maang Tikka', 'Bridal Earrings Set']
  },
  {
    name: 'Traditional Collection',
    description: 'Classic designs for all occasions',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    products: ['Temple Jewelry Set', 'Traditional Gold Necklace', 'Kundan Choker', 'Polki Earrings', 'Traditional Bangles']
  },
  {
    name: 'Contemporary Collection',
    description: 'Modern and trendy jewelry',
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    products: ['Modern Diamond Ring', 'Sleek Gold Chain', 'Contemporary Bracelet', 'Minimalist Earrings', 'Designer Pendant']
  },
  {
    name: 'Diamond Collection',
    description: 'Premium diamond jewelry',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
    products: ['Diamond Solitaire Ring', 'Diamond Tennis Bracelet', 'Diamond Stud Earrings', 'Diamond Pendant', 'Diamond Bangles']
  },
  {
    name: 'Gold Collection',
    description: 'Pure gold ornaments',
    imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
    products: ['22K Gold Chain', 'Gold Coin Pendant', 'Gold Kada Bracelet', 'Gold Hoop Earrings', 'Gold Mangalsutra']
  },
  {
    name: 'Gemstone Collection',
    description: 'Colorful gemstone jewelry',
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
    products: ['Ruby Necklace', 'Emerald Ring', 'Sapphire Earrings', 'Pearl Pendant', 'Navratna Ring']
  },
  {
    name: 'Festive Collection',
    description: 'Jewelry for celebrations',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    products: ['Festive Gold Set', 'Celebration Bangles', 'Party Wear Necklace', 'Festive Earrings', 'Traditional Choker']
  },
  {
    name: 'Daily Wear Collection',
    description: 'Elegant everyday jewelry',
    imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800',
    products: ['Simple Gold Chain', 'Daily Wear Earrings', 'Lightweight Bangles', 'Small Pendant', 'Delicate Ring']
  }
];

const catalogData = [
  {
    categoryType: 'Necklaces',
    items: ['Diamond Necklace', 'Gold Necklace', 'Pearl Necklace', 'Temple Necklace', 'Choker Necklace']
  },
  {
    categoryType: 'Rings',
    items: ['Engagement Ring', 'Wedding Ring', 'Solitaire Ring', 'Cocktail Ring', 'Band Ring']
  },
  {
    categoryType: 'Earrings',
    items: ['Stud Earrings', 'Jhumka Earrings', 'Hoop Earrings', 'Drop Earrings', 'Chandbali Earrings']
  },
  {
    categoryType: 'Bangles',
    items: ['Gold Bangles', 'Diamond Bangles', 'Designer Bangles', 'Traditional Bangles', 'Kada Bangles']
  },
  {
    categoryType: 'Bracelets',
    items: ['Tennis Bracelet', 'Chain Bracelet', 'Bangle Bracelet', 'Charm Bracelet', 'Cuff Bracelet']
  }
];

const descriptions = [
  'Exquisite handcrafted jewelry with intricate details',
  'Premium quality for special occasions',
  'Traditional design with modern touch',
  'Certified stones with excellent cut',
  'Perfect for daily wear and gifting',
  'Elegant design suitable for all occasions',
  'Handpicked gemstones set in pure gold',
  'Contemporary styling with classic appeal',
  'Timeless piece for your collection',
  'Crafted with precision and care',
];

// Helper functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(1));
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomPrice = () => randomInt(5000, 500000);
const randomStock = () => randomInt(5, 100);

async function seedCompleteData() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/catalog_db';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔄 Starting comprehensive data seeding...\n');

    // ========================================
    // 1. CREATE/UPDATE COLLECTIONS
    // ========================================
    console.log('📚 Creating Collections...');

    await Collection.deleteMany({});
    const createdCollections = [];

    for (const collectionInfo of collectionData) {
      const collection = await Collection.create({
        name: collectionInfo.name,
        description: collectionInfo.description,
        imageUrl: collectionInfo.imageUrl,
      });
      createdCollections.push({ ...collection.toObject(), productNames: collectionInfo.products });
      console.log(`   ✓ ${collection.name}`);
    }

    console.log(`✅ Created ${createdCollections.length} collections\n`);

    // ========================================
    // 2. CREATE PRODUCTS FOR EACH COLLECTION
    // ========================================
    console.log('📦 Creating Products for Collections...');

    await Product.deleteMany({});
    let totalProducts = 0;

    for (const collectionData of createdCollections) {
      console.log(`\n   Collection: ${collectionData.name}`);

      for (let i = 0; i < collectionData.productNames.length; i++) {
        const productName = collectionData.productNames[i];
        const isBestseller = Math.random() > 0.6; // 40% are bestsellers
        const isTopRated = Math.random() > 0.5; // 50% are top rated
        const isFeatured = Math.random() > 0.7; // 30% are featured
        const isTrending = i < 2; // First 2 products per collection are trending

        await Product.create({
          collectionId: collectionData._id,
          title: productName,
          price: randomPrice(),
          URL: collectionData.imageUrl,
          description: randomElement(descriptions),
          stock: randomStock(),
          SKU: `PRD-${collectionData.name.substring(0, 3).toUpperCase()}-${1000 + totalProducts}`,
          salesCount: isBestseller ? randomInt(50, 500) : randomInt(0, 40),
          rating: isTopRated ? randomFloat(4.0, 5.0) : randomFloat(3.0, 4.5),
          reviewCount: isTopRated ? randomInt(20, 200) : randomInt(0, 15),
          brand: randomElement(jewelryBrands),
          isFeatured: isFeatured,
          isTrending: isTrending,
        });

        console.log(`      ✓ ${productName}`);
        totalProducts++;
      }
    }

    console.log(`\n✅ Created ${totalProducts} products across all collections\n`);

    // ========================================
    // 3. CREATE CATEGORIES AND CATALOGS
    // ========================================
    console.log('📂 Creating Catalogs with Categories...');

    const categories = await Category.find({ level: 'C3' });

    if (categories.length > 0) {
      await Catalog.deleteMany({});
      let totalCatalogs = 0;

      for (const catalogInfo of catalogData) {
        console.log(`\n   Category: ${catalogInfo.categoryType}`);

        for (const itemName of catalogInfo.items) {
          const category = randomElement(categories);
          const isBestseller = Math.random() > 0.6;
          const isTopRated = Math.random() > 0.5;
          const isFeatured = Math.random() > 0.7;

          await Catalog.create({
            title: itemName,
            price: randomPrice(),
            stock: randomStock(),
            SKU: `CAT-${catalogInfo.categoryType.substring(0, 3).toUpperCase()}-${2000 + totalCatalogs}`,
            URL: randomElement(collectionData).imageUrl,
            category: category._id,
            c3: category._id,
            c2: category.parents && category.parents[0] ? category.parents[0] : null,
            c1: category.parents && category.parents[1] ? category.parents[1] : null,
            salesCount: isBestseller ? randomInt(60, 600) : randomInt(0, 40),
            rating: isTopRated ? randomFloat(4.0, 5.0) : randomFloat(3.0, 4.5),
            reviewCount: isTopRated ? randomInt(25, 250) : randomInt(0, 20),
            brand: randomElement(jewelryBrands),
            isFeatured: isFeatured,
          });

          console.log(`      ✓ ${itemName}`);
          totalCatalogs++;
        }
      }

      console.log(`\n✅ Created ${totalCatalogs} catalogs\n`);
    } else {
      console.log('⚠️  No C3 categories found. Skipping catalog creation.\n');
    }

    // ========================================
    // 4. STATISTICS
    // ========================================
    console.log('📊 Final Statistics:');
    console.log('===================\n');

    // Collections
    const collectionsCount = await Collection.countDocuments();
    console.log(`📚 Collections: ${collectionsCount}`);
    const collections = await Collection.find();
    for (const col of collections) {
      const productCount = await Product.countDocuments({ collectionId: col._id });
      console.log(`   ✓ ${col.name}: ${productCount} products`);
    }

    // Products
    const productsCount = await Product.countDocuments();
    const bestsellerProducts = await Product.countDocuments({ salesCount: { $gt: 40 } });
    const topRatedProducts = await Product.countDocuments({ rating: { $gte: 4.0 } });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const trendingProducts = await Product.countDocuments({ isTrending: true });

    console.log(`\n📦 Products:`);
    console.log(`   Total: ${productsCount}`);
    console.log(`   Best Sellers: ${bestsellerProducts}`);
    console.log(`   Top Rated: ${topRatedProducts}`);
    console.log(`   Featured: ${featuredProducts}`);
    console.log(`   Trending: ${trendingProducts}`);

    // Catalogs
    const catalogsCount = await Catalog.countDocuments();
    if (catalogsCount > 0) {
      const bestsellerCatalogs = await Catalog.countDocuments({ salesCount: { $gt: 40 } });
      const topRatedCatalogs = await Catalog.countDocuments({ rating: { $gte: 4.0 } });
      const featuredCatalogs = await Catalog.countDocuments({ isFeatured: true });

      console.log(`\n📦 Catalogs:`);
      console.log(`   Total: ${catalogsCount}`);
      console.log(`   Best Sellers: ${bestsellerCatalogs}`);
      console.log(`   Top Rated: ${topRatedCatalogs}`);
      console.log(`   Featured: ${featuredCatalogs}`);
    }

    // Brands
    const brands = await Product.distinct('brand');
    console.log(`\n🏷️  Brands: ${brands.length}`);
    console.log(`   ${brands.join(', ')}`);

    // ========================================
    // 5. SAMPLE DATA
    // ========================================
    console.log('\n📋 Sample Trending Products by Collection:');
    console.log('==========================================\n');

    for (const col of collections.slice(0, 3)) {
      const trending = await Product.find({ collectionId: col._id, isTrending: true }).limit(2);
      console.log(`${col.name}:`);
      trending.forEach((p) => {
        console.log(`   • ${p.title} - ₹${p.price} (${p.rating}★)`);
      });
    }

    console.log('\n✅ Comprehensive seeding completed!\n');

    console.log('🔗 Test these endpoints:');
    console.log('========================');
    console.log('   GET http://localhost:8000/api/collections');
    console.log('   GET http://localhost:8000/api/products');
    console.log('   GET http://localhost:8000/api/best-sellers');
    console.log('   GET http://localhost:8000/api/top-rated');
    console.log('   GET http://localhost:8000/api/brands');
    console.log('   GET http://localhost:8000/api/trending');
    console.log('\n🌐 Frontend:');
    console.log('   http://localhost:3000 - Home page with trending products');
    console.log('   http://localhost:3000/best - Best sellers');
    console.log('   http://localhost:3000/top - Top rated');
    console.log('   http://localhost:3000/brands - Featured brands');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedCompleteData()
  .then(() => {
    console.log('✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
