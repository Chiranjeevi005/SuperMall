# Fix for MongoDB orderNumber Index Issue

## Problem
You're encountering this error when creating orders:
```
MongoServerError: E11000 duplicate key error collection: supermall.orders index: orderNumber_1 dup key: { orderNumber: null }
```

This happens because there's a leftover index on the `orderNumber` field in your MongoDB database that's not defined in the current schema.

## Solution

### Option 1: Step-by-step fix (recommended for understanding the issue)
1. Remove the problematic index:
   ```bash
   npm run remove:orderNumber-index
   ```

2. Fix documents with null orderId values:
   ```bash
   npm run fix:null-orderId
   ```

3. Remove the orderNumber field from all documents:
   ```bash
   npm run remove:orderNumber-field
   ```

4. Reset all order collection indexes:
   ```bash
   npm run reset:orders-indexes
   ```

### Option 2: Complete fix (one command)
Run the comprehensive fix script that handles all steps automatically:
```bash
npm run fix:orders-complete
```

### Verify the fix
After running the fix, verify it worked correctly:
```bash
npm run verify:orders-fix
```

## Alternative Manual Solution
If you prefer to remove the index manually, connect to your MongoDB database and run:
```javascript
db.orders.dropIndex("orderNumber_1")
```

## Why This Happened
This issue typically occurs when:
1. A previous version of the schema included an `orderNumber` field with a unique index
2. The field was later removed from the schema but the index remained in the database
3. When creating new orders, MongoDB tries to enforce the unique constraint on the non-existent field, causing the error

## Prevention
The updated Order schema now:
- Uses only `orderId` as the unique identifier
- Properly manages indexes to avoid duplicates
- Has improved error handling for order creation