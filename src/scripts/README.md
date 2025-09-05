# Database Seeding Scripts

This directory contains scripts for seeding the Super Mall database with initial data.

## Current Seeding Script

### seedAllData.js
This is the main seeding script that populates the database with:
- 8 Categories
- 9 Vendors
- 40 Products

To run the seeding script:
```bash
node src/scripts/seedAllData.js
```

## Data Overview

The seeding script creates a complete dataset with:
- Categories with proper slug fields to avoid indexing issues
- Vendors with realistic data and Cloudinary image URLs
- Products with detailed descriptions, features, and images

## Verification Scripts

- checkApi.js - Test API connectivity (requires development server running)
- checkCategories.js - Check the number and details of categories
- checkVendors.js - Check the number and details of vendors
- checkVendorCount.js - Check vendor count and list

To verify data after seeding:
```bash
node src/scripts/checkCategories.js
node src/scripts/checkVendors.js
node src/scripts/checkVendorCount.js
```

## Deleted Scripts

The following scripts have been removed as they were redundant or outdated:
- fixCategories.js - Fixed slug indexing issues (no longer needed)
- seedCategories.js - Basic category seeding (replaced by seedAllData.js)
- seedCategoriesAndProducts.js - Category and product seeding (replaced by seedAllData.js)
- seedDetailedVendors.js - Vendor seeding with detailed data (replaced by seedAllData.js)
- seedProducts.js - Product seeding (replaced by seedAllData.js)
- seedVendors.js - Basic vendor seeding (replaced by seedAllData.js)
- seedVendorsAndStores.js - Vendor seeding (replaced by seedAllData.js)
- updateCategories.js - Conceptual category update script (never implemented)