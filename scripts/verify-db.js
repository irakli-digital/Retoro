const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function verifyDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('🔍 Verifying database setup...\n');

  try {
    // Check retailer policies
    const retailers = await sql`
      SELECT id, name, return_window_days, has_free_returns 
      FROM retailer_policies 
      ORDER BY name
    `;
    console.log(`📦 Retailer Policies: ${retailers.length} retailers`);
    retailers.forEach(r => {
      console.log(`   - ${r.name}: ${r.return_window_days === 0 ? 'No deadline' : r.return_window_days + ' days'} ${r.has_free_returns ? '(Free returns)' : ''}`);
    });

    // Check return items
    const items = await sql`
      SELECT ri.*, rp.name as retailer_name
      FROM return_items ri
      LEFT JOIN retailer_policies rp ON ri.retailer_id = rp.id
      WHERE ri.user_id = 'demo-user-123'
      ORDER BY ri.return_deadline ASC
    `;
    
    console.log(`\n📝 Return Items: ${items.length} items`);
    const activeItems = items.filter(i => !i.is_returned);
    const returnedItems = items.filter(i => i.is_returned);
    
    console.log(`   Active: ${activeItems.length}`);
    console.log(`   Returned: ${returnedItems.length}`);
    
    console.log('\n📋 Active Return Items:');
    activeItems.forEach(item => {
      const daysLeft = Math.ceil((new Date(item.return_deadline) - new Date()) / (1000 * 60 * 60 * 24));
      console.log(`   - ${item.name || 'Unnamed'} from ${item.retailer_name}: ${daysLeft} days left ($${item.price || 0})`);
    });
    
    if (returnedItems.length > 0) {
      console.log('\n✅ Returned Items:');
      returnedItems.forEach(item => {
        console.log(`   - ${item.name || 'Unnamed'} from ${item.retailer_name}: $${item.price || 0}`);
      });
    }

    console.log('\n✅ Database verification complete!');
  } catch (error) {
    console.error('❌ Error verifying database:', error);
    process.exit(1);
  }
}

verifyDatabase();

