const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

/**
 * Bulk add retailers from a list of domain names
 * 
 * Usage:
 * 1. Edit the RETAILER_LIST array below with your domains
 * 2. Run: node scripts/bulk-add-retailers.js
 */

// Default return policy values
const DEFAULT_RETURN_WINDOW_DAYS = 30;
const DEFAULT_HAS_FREE_RETURNS = false;

// List of retailer domains to add
// Format: domain name (e.g., "amazon.com", "walmart.com")
const RETAILER_LIST = [
  'amazon.com',
  'walmart.com',
  'ebay.com',
  'etsy.com',
  'target.com',
  'homedepot.com',
  'bestbuy.com',
  'costco.com',
  'wayfair.com',
  'macys.com',
  'kohls.com',
  'lowes.com',
  'nike.com',
  'apple.com',
  'samsclub.com',
  'kroger.com',
  'walgreens.com',
  'cvs.com',
  'shein.com',
  'zappos.com',
  'newegg.com',
  'overstock.com',
  'barnesandnoble.com',
  'chewy.com',
  'doordash.com',
  'ubereats.com',
  'instacart.com',
  'grubhub.com',
  'nordstrom.com',
  'gap.com',
  'oldnavy.com',
  'bananarepublic.com',
  'uniqlo.com',
  'hollisterco.com',
  'abercrombie.com',
  'sephora.com',
  'ulta.com',
  'glossier.com',
  'everlane.com',
  'hm.com',
  'jcrew.com',
  'patagonia.com',
  'columbia.com',
  'rei.com',
  'llbean.com',
  'officedepot.com',
  'staples.com',
  'dell.com',
  'hp.com',
  'lenovo.com',
  'bjs.com',
  'crateandbarrel.com',
  'potterybarn.com',
  'ashleyfurniture.com',
  'ikea.com',
  'autozone.com',
  'advanceautoparts.com',
  'oreillyauto.com',
  'rockauto.com',
  'carvana.com',
  'gamestop.com',
  'ticketmaster.com',
  'fandango.com',
  'expedia.com',
  'booking.com',
  'airbnb.com',
  'hotels.com',
  'bloomingdales.com',
  'saksfifthavenue.com',
  'neimanmarcus.com',
  'forever21.com',
  'fashionnova.com',
  'lulus.com',
  'victoriassecret.com',
  'bathandbodyworks.com',
  'express.com',
  'carters.com',
  'toysrus.com',
  'lego.com',
  'petsmart.com',
  'petco.com',
  'footlocker.com',
  'finishline.com',
  'dickssportinggoods.com',
  'backcountry.com',
  'zara.com',
  'madewell.com',
  'anthropologie.com',
  'urbanoutfitters.com',
  'freepeople.com',
  'aldo.com',
  'dsw.com',
  'sunglasshut.com',
  'blueapron.com',
  'hellofresh.com',
  'williams-sonoma.com',
  'surlatable.com',
  'costplusworldmarket.com',
  'microcenter.com',
  // Add more domains here...
];

/**
 * Generate retailer ID from domain name
 * Converts "amazon.com" -> "amazon"
 * Handles subdomains: "oldnavy.gap.com" -> "oldnavy-gap"
 */
function generateRetailerId(domain) {
  // Remove protocol if present
  domain = domain.replace(/^https?:\/\//, '');
  // Remove www. prefix
  domain = domain.replace(/^www\./, '');
  // Remove trailing slash
  domain = domain.replace(/\/$/, '');
  
  // Split by dots and take main domain parts
  const parts = domain.split('.');
  
  // If it's a subdomain (e.g., oldnavy.gap.com), combine them
  if (parts.length > 2) {
    // Take last two parts for main domain, combine with subdomain
    const subdomain = parts[0];
    const mainDomain = parts.slice(-2).join('-');
    return `${subdomain}-${mainDomain}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
  
  // Regular domain: take first part (e.g., "amazon" from "amazon.com")
  const id = parts[0].toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return id;
}

/**
 * Generate website URL from domain
 */
function generateWebsiteUrl(domain) {
  // Add https:// if not present
  if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
    return `https://${domain}`;
  }
  return domain;
}

/**
 * Generate retailer name (capitalize first letter, handle special cases)
 */
function generateRetailerName(domain) {
  // Remove protocol and www
  let name = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
  
  // Take main domain part
  const parts = name.split('.');
  let mainPart = parts[0];
  
  // Handle special cases
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
  
  // Capitalize first letter
  return mainPart.charAt(0).toUpperCase() + mainPart.slice(1);
}

async function bulkAddRetailers() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not defined in .env.local');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('📦 Bulk adding retailers to database...\n');
  console.log(`Total retailers to add: ${RETAILER_LIST.length}\n`);

  const results = {
    added: [],
    skipped: [],
    errors: [],
  };

  try {
    for (const domain of RETAILER_LIST) {
      const domainClean = domain.trim().toLowerCase();
      
      if (!domainClean) {
        continue;
      }

      const id = generateRetailerId(domainClean);
      const name = generateRetailerName(domainClean);
      const websiteUrl = generateWebsiteUrl(domainClean);

      try {
        // Check if retailer already exists
        const existing = await sql`
          SELECT id, name FROM retailer_policies 
          WHERE id = ${id} OR LOWER(name) = LOWER(${name})
        `;

        if (existing.length > 0) {
          console.log(`⏭️  Skipped: ${name} (already exists)`);
          results.skipped.push({ domain: domainClean, id, name, reason: 'already exists' });
          continue;
        }

        // Insert new retailer
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

bulkAddRetailers();

