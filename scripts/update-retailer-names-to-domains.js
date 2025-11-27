const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function updateRetailerNamesToDomains() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not defined in .env.local');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('📦 Updating retailer names to domains...\n');

  // Map of retailer IDs to their domain names
  const retailerDomainMap = {
    'zara': 'zara.com',
    'nordstrom': 'nordstrom.com',
    'asos': 'asos.com',
    'macys': 'macys.com',
    'target': 'target.com',
    'amazon': 'amazon.com',
    'h-m': 'hm.com',
    'gap': 'gap.com',
    'old-navy': 'oldnavy.gap.com',
    'banana-republic': 'bananarepublic.gap.com'
  };

  try {
    for (const [retailerId, domain] of Object.entries(retailerDomainMap)) {
      console.log(`Updating ${retailerId} -> ${domain}...`);
      await sql`
        UPDATE retailer_policies
        SET name = ${domain}
        WHERE id = ${retailerId}
      `;
      console.log(`✅ Updated ${retailerId} to ${domain}`);
    }

    console.log('\n✅ All retailer names updated successfully!');
  } catch (error) {
    console.error('❌ Error updating retailer names:', error);
    process.exit(1);
  }
}

updateRetailerNamesToDomains();

