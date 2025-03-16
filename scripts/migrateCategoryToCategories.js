const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/productModel');

/**
 * Migration script to convert products with a single 'category' field
 * to use the new 'categories' array field.
 * 
 * To run this script: node utils/migrateCategoryToCategories.js
 */
async function migrateCategoryToCategories() {
    console.log('Starting migration: Converting category to categories array...');

    try {
        // Connect to the database
        await connectDB();

        // Find all products that might have the old 'category' field
        // The query handles both cases - products with the old field and products already migrated
        const products = await Product.find({}).lean();

        let migratedCount = 0;
        let alreadyMigratedCount = 0;
        let errorCount = 0;

        for (const product of products) {
            try {
                // Check if product has the old category field as a property (not just undefined)
                // This handles the case where the field exists but might be null/undefined
                const hasOldCategoryField = Object.prototype.hasOwnProperty.call(product, 'category');

                if (hasOldCategoryField) {
                    // Preserve the original category value
                    const originalCategory = product.category;

                    // Update the product to use the categories array
                    // Only add non-empty category strings
                    const categoriesArray = originalCategory ? [originalCategory] : [];

                    await Product.updateOne(
                        { _id: product._id },
                        {
                            $set: { categories: categoriesArray },
                            $unset: { category: 1 } // Remove the old field
                        }
                    );

                    migratedCount++;
                    console.log(`Migrated product ${product._id}: "${product.name}"`);
                } else {
                    // Product already has the new schema
                    alreadyMigratedCount++;
                }
            } catch (error) {
                console.error(`Error migrating product ${product._id}:`, error);
                errorCount++;
            }
        }

        console.log('\nMigration completed:');
        console.log(`- Total products processed: ${products.length}`);
        console.log(`- Successfully migrated: ${migratedCount}`);
        console.log(`- Already using new schema: ${alreadyMigratedCount}`);
        console.log(`- Errors encountered: ${errorCount}`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        // Close the mongoose connection
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

// Run the migration if this file is executed directly
if (require.main === module) {
    migrateCategoryToCategories().catch(console.error);
}

module.exports = migrateCategoryToCategories; 