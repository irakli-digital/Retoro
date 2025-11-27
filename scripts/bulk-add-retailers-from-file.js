const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

/**
 * Bulk add retailers from a text file
 * 
 * Usage:
 * 1. Create a file called "retailers.txt" in the scripts folder
 * 2. Add one domain per line (e.g., "amazon.com")
 * 3. Run: node scripts/bulk-add-retailers-from-file.js
 * 
 * Or specify a custom file:
 * node scripts/bulk-add-retailers-from-file.js path/to/your/file.txt
 */

const DEFAULT_RETURN_WINDOW_DAYS = 30;
const DEFAULT_HAS_FREE_RETURNS = false;

function generateRetailerId(domain) {
  domain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  const parts = domain.split('.');
  
  if (parts.length > 2) {
    const subdomain = parts[0];
    const mainDomain = parts.slice(-2).join('-');
    return `${subdomain}-${mainDomain}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
  
  return parts[0].toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

function generateWebsiteUrl(domain) {
  if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
    return `https://${domain}`;
  }
  return domain;
}

function generateRetailerName(domain) {
  let name = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
  const parts = name.split('.');
  let mainPart = parts[0];
  
  const specialCases = {
    'hm': 'H&M',
    'jcrew': 'J.Crew',
    'llbean': 'L.L.Bean',
    'barnesandnoble': 'Barnes & Noble',
    'williams-sonoma': 'Williams Sonoma',
    'saksfifthavenue': 'Saks Fifth Avenue',
    'neimanmarcus': 'Neiman Marcus',
    'dickssportinggoods': "Dick's Sporting Goods",
    'bathandbodyworks': 'Bath & Body Works',
    'advanceautoparts': 'Advance Auto Parts',
    'oreillyauto': "O'Reilly Auto Parts",
    'costplusworldmarket': 'Cost Plus World Market',
  };
  
  if (specialCases[mainPart]) {
    return specialCases[mainPart];
  }
  
  return mainPart.charAt(0).toUpperCase() + mainPart.slice(1);
}

async function bulkAddRetailersFromFile(filePath) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not defined in .env.local');
  }

  // Default to retailers.txt in scripts folder
  const defaultFile = path.join(__dirname, 'retailers.txt');
  const inputFile = filePath || defaultFile;

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`);
    console.log('\n💡 Create a file with one domain per line, e.g.:');
    console.log('   amazon.com');
    console.log('   walmart.com');
    console.log('   target.com');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(inputFile, 'utf-8');
  const domains = fileContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#')); // Remove empty lines and comments

  if (domains.length === 0) {
    console.error('❌ No domains found in file');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log(`📦 Bulk adding retailers from: ${inputFile}`);
  console.log(`Total retailers to add: ${domains.length}\n`);

  const results = {
    added: [],
    skipped: [],
    errors: [],
  };

  try {
    for (const domain of domains) {
      const domainClean = domain.trim().toLowerCase();
      
      if (!domainClean) {
        continue;
      }

      const id = generateRetailerId(domainClean);
      const name = generateRetailerName(domainClean);
      const websiteUrl = generateWebsiteUrl(domainClean);

      try {
        const existing = await sql`
          SELECT id, name FROM retailer_policies 
          WHERE id = ${id} OR LOWER(name) = LOWER(${name})
        `;

        if (existing.length > 0) {
          console.log(`⏭️  Skipped: ${name} (already exists)`);
          results.skipped.push({ domain: domainClean, id, name, reason: 'already exists' });
          continue;
        }

        await sql`
          INSERT INTO retailer_policies (
            id, 
            name, 
            return_window_days, 
            website_url, 
            has_free_returns,
            policy_description
          )
          VALUES (
            ${id},
            ${name},
            ${DEFAULT_RETURN_WINDOW_DAYS},
            ${websiteUrl},
            ${DEFAULT_HAS_FREE_RETURNS},
            ${`${DEFAULT_RETURN_WINDOW_DAYS} days from purchase`}
          )
        `;

        console.log(`✅ Added: ${name} (${domainClean})`);
        results.added.push({ domain: domainClean, id, name });
      } catch (error) {
        console.error(`❌ Error adding ${domainClean}:`, error.message);
        results.errors.push({ domain: domainClean, error: error.message });
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Added: ${results.added.length}`);
    console.log(`⏭️  Skipped: ${results.skipped.length}`);
    console.log(`❌ Errors: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(({ domain, error }) => {
        console.log(`  - ${domain}: ${error}`);
      });
    }

    console.log('\n✅ Bulk add completed!');
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Get file path from command line argument
const filePath = process.argv[2];
bulkAddRetailersFromFile(filePath);

