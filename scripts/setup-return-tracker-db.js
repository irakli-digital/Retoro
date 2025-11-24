const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env.local');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('📦 Setting up Return Tracker database...\n');

  try {
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    console.log('📋 Creating tables and indexes...');
    
    // Execute schema statements one by one
    // First, create retailer_policies table
    await sql`
      CREATE TABLE IF NOT EXISTS retailer_policies (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        return_window_days INTEGER NOT NULL,
        policy_description TEXT,
        website_url VARCHAR(500),
        has_free_returns BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_retailer_policies_name ON retailer_policies(name)
    `;
    
    // Create return_items table
    await sql`
      CREATE TABLE IF NOT EXISTS return_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        retailer_id VARCHAR(100) NOT NULL REFERENCES retailer_policies(id),
        name VARCHAR(255),
        price DECIMAL(10, 2),
        purchase_date TIMESTAMP NOT NULL,
        return_deadline TIMESTAMP NOT NULL,
        is_returned BOOLEAN DEFAULT false,
        returned_date TIMESTAMP,
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_return_items_user_id ON return_items(user_id)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_return_items_return_deadline ON return_items(return_deadline)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_return_items_is_returned ON return_items(is_returned)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_return_items_user_deadline ON return_items(user_id, return_deadline)
    `;
    
    // Insert retailer policies
    console.log('📋 Seeding retailer policies...');
    await sql`
      INSERT INTO retailer_policies (id, name, return_window_days, policy_description, website_url, has_free_returns) VALUES
      ('zara', 'Zara', 30, '30 days from delivery date', 'https://www.zara.com/us/en/help/returns', false),
      ('nordstrom', 'Nordstrom', 0, 'No deadline - free returns', 'https://www.nordstrom.com/browse/customer-service/return-policy', true),
      ('asos', 'ASOS', 28, '28 days from delivery', 'https://www.asos.com/customer-care/returns/', true),
      ('macys', 'Macy''s', 90, '90 days from purchase', 'https://www.macys.com/service/returns/index', false),
      ('target', 'Target', 90, '90 days for most items', 'https://www.target.com/help/returns-exchanges', false),
      ('amazon', 'Amazon', 30, '30 days from delivery', 'https://www.amazon.com/gp/help/customer/display.html', true),
      ('h-m', 'H&M', 30, '30 days from purchase', 'https://www2.hm.com/en_us/customer-service/returns.html', false),
      ('gap', 'Gap', 30, '30 days from purchase', 'https://www.gap.com/customer-service/returns', true),
      ('old-navy', 'Old Navy', 30, '30 days from purchase', 'https://oldnavy.gap.com/customer-service/returns', true),
      ('banana-republic', 'Banana Republic', 30, '30 days from purchase', 'https://bananarepublic.gap.com/customer-service/returns', true)
      ON CONFLICT (id) DO NOTHING
    `;
    
    console.log('✅ Tables created successfully!\n');

    // Insert dummy return items
    console.log('📝 Inserting dummy return items...');
    
    const dummyItems = [
      {
        retailer_id: 'zara',
        name: 'Black Leather Jacket',
        price: 89.99,
        purchase_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        user_id: 'demo-user-123',
      },
      {
        retailer_id: 'nordstrom',
        name: 'Blue Denim Jeans',
        price: 79.50,
        purchase_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        user_id: 'demo-user-123',
      },
      {
        retailer_id: 'asos',
        name: 'White Cotton T-Shirt',
        price: 24.99,
        purchase_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        user_id: 'demo-user-123',
      },
      {
        retailer_id: 'target',
        name: 'Running Shoes',
        price: 59.99,
        purchase_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        user_id: 'demo-user-123',
      },
      {
        retailer_id: 'amazon',
        name: 'Wireless Headphones',
        price: 129.99,
        purchase_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        user_id: 'demo-user-123',
      },
      {
        retailer_id: 'gap',
        name: 'Gray Sweater',
        price: 45.00,
        purchase_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
        user_id: 'demo-user-123',
      },
      {
        retailer_id: 'macys',
        name: 'Formal Dress',
        price: 149.99,
        purchase_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        user_id: 'demo-user-123',
      },
      {
        retailer_id: 'h-m',
        name: 'Summer Shorts',
        price: 19.99,
        purchase_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        user_id: 'demo-user-123',
      },
    ];

    // Get retailer policies to calculate deadlines
    const retailers = await sql`
      SELECT id, return_window_days FROM retailer_policies
    `;
    const retailerMap = {};
    retailers.forEach(r => {
      retailerMap[r.id] = r.return_window_days;
    });

    // Insert dummy items with calculated deadlines
    for (const item of dummyItems) {
      const returnWindowDays = retailerMap[item.retailer_id] || 30;
      const purchaseDate = item.purchase_date;
      const returnDeadline = new Date(purchaseDate);
      
      if (returnWindowDays === 0) {
        returnDeadline.setFullYear(returnDeadline.getFullYear() + 10);
      } else {
        returnDeadline.setDate(returnDeadline.getDate() + returnWindowDays);
      }

      try {
        await sql`
          INSERT INTO return_items (
            retailer_id, name, price, purchase_date, return_deadline, 
            is_returned, user_id
          )
          VALUES (
            ${item.retailer_id},
            ${item.name},
            ${item.price},
            ${purchaseDate.toISOString()},
            ${returnDeadline.toISOString()},
            false,
            ${item.user_id}
          )
          ON CONFLICT DO NOTHING
        `;
        console.log(`  ✅ Added: ${item.name} from ${item.retailer_id}`);
      } catch (error) {
        console.error(`  ❌ Error adding ${item.name}:`, error.message);
      }
    }

    // Add one returned item
    const returnedItem = {
      retailer_id: 'old-navy',
      name: 'Red Flannel Shirt',
      price: 34.99,
      purchase_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
      returned_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // returned 5 days ago
      user_id: 'demo-user-123',
    };

    const returnedRetailerWindow = retailerMap[returnedItem.retailer_id] || 30;
    const returnedDeadline = new Date(returnedItem.purchase_date);
    if (returnedRetailerWindow === 0) {
      returnedDeadline.setFullYear(returnedDeadline.getFullYear() + 10);
    } else {
      returnedDeadline.setDate(returnedDeadline.getDate() + returnedRetailerWindow);
    }

    try {
      await sql`
        INSERT INTO return_items (
          retailer_id, name, price, purchase_date, return_deadline, 
          is_returned, returned_date, user_id
        )
        VALUES (
          ${returnedItem.retailer_id},
          ${returnedItem.name},
          ${returnedItem.price},
          ${returnedItem.purchase_date.toISOString()},
          ${returnedDeadline.toISOString()},
          true,
          ${returnedItem.returned_date.toISOString()},
          ${returnedItem.user_id}
        )
        ON CONFLICT DO NOTHING
      `;
      console.log(`  ✅ Added returned item: ${returnedItem.name}`);
    } catch (error) {
      console.error(`  ❌ Error adding returned item:`, error.message);
    }

    console.log('\n✅ Database setup complete!');
    console.log(`📊 Created ${dummyItems.length + 1} dummy return items`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();

