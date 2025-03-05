// Simple Supabase Database Initialization Script
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
    
    // Extract project reference from the URL
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
    
    // Execute the SQL using the Supabase REST API
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({ query: schemaSQL })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to execute SQL: ${response.status} ${response.statusText}\n${errorText}`);
    }
    
    console.log('✅ Database initialized successfully!');
    console.log('\nYour SegakAI database is now ready to use.');
    console.log('\nTo make a user an admin, go to the Supabase dashboard:');
    console.log('1. Navigate to Authentication > Users');
    console.log('2. Find the user you want to make an admin');
    console.log('3. Click "Edit" and add {"is_admin": "true"} to their metadata');
    console.log('4. Save the changes');
    
  } catch (err) {
    console.error('Initialization failed:', err);
    process.exit(1);
  }
}

// Use node-fetch for Node.js < 18
if (parseInt(process.versions.node.split('.')[0]) < 18) {
  // For Node.js < 18
  import('node-fetch').then(module => {
    global.fetch = module.default;
    initializeDatabase();
  });
} else {
  // For Node.js >= 18
  initializeDatabase();
} 