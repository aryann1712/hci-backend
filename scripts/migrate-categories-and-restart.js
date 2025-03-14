const { exec } = require('child_process');
const path = require('path');
const migrateCategoryToCategories = require('../utils/migrateCategoryToCategories');

/**
 * This script will:
 * 1. Run the migration to convert single categories to category arrays
 * 2. Restart the server with the new schema
 * 
 * To run: node scripts/migrate-categories-and-restart.js
 */
async function migrateAndRestart() {
    try {
        console.log('Starting migration process...');

        // Run the migration
        await migrateCategoryToCategories();

        console.log('\nMigration completed successfully. Restarting server...');

        // Restart the server - this assumes you're using something like PM2 or nodemon
        // If you're not using a process manager, you'll need to manually restart the server
        const serverPath = path.join(__dirname, '../index.js');

        // Using nodemon to restart if available
        const restartProcess = exec('npm run dev', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error restarting server: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Server stderr: ${stderr}`);
                return;
            }
            console.log(`Server stdout: ${stdout}`);
        });

        restartProcess.on('exit', (code) => {
            console.log(`Server process exited with code ${code}`);
        });

    } catch (error) {
        console.error('Migration and restart failed:', error);
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    migrateAndRestart().catch(console.error);
}

module.exports = migrateAndRestart; 