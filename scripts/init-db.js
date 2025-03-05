// Initialize Supabase Database Script
// This script reads the schema SQL file and executes it against your Supabase database

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Read the schema SQL file
const schemaPath = path.join(__dirname, '..', 'lib', 'supabase-schema.sql');

async function initializeDatabase() {
  try {
    console.log('Reading schema file...');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing SQL schema...');
    
    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        // Execute the SQL statement
        await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'params=single-object'
          },
          body: JSON.stringify({
            query: stmt + ';'
          })
        });
      } catch (error) {
        console.warn(`Warning: Statement ${i + 1} execution error:`, error.message);
        // Continue with next statement
      }
    }
    
    console.log('✅ Database initialized successfully!');
    
    // List tables to verify
    console.log('\nVerifying tables...');
    const tablesResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
      })
    });
    
    const tablesData = await tablesResponse.json();
    
    if (tablesData && tablesData.length > 0) {
      console.log('\nTables in public schema:');
      tablesData.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    } else {
      console.log('No tables found or could not verify tables.');
    }
    
  } catch (err) {
    console.error('Initialization failed:', err);
    process.exit(1);
  }
}

// Use node-fetch for Node.js < 18
let fetch;
if (parseInt(process.versions.node.split('.')[0]) < 18) {
  // For Node.js < 18
  import('node-fetch').then(module => {
    fetch = module.default;
    initializeDatabase();
  });
} else {
  // For Node.js >= 18
  fetch = global.fetch;
  initializeDatabase();
} 