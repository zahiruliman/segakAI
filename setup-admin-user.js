require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('\nWARNING: SUPABASE_SERVICE_ROLE_KEY is not set in your .env.local file.');
  console.error('This script requires the service role key to make users admin.');
  console.error('You can find this key in your Supabase project settings under "API".');
  console.error('Please add it to your .env.local file as SUPABASE_SERVICE_ROLE_KEY=your-key');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function makeUserAdmin(email) {
  try {
    console.log(`\nAttempting to make user ${email} an admin...`);
    
    // Create client with service role key for admin access
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Get user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError) {
      // Try to get the user from auth.users directly
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw new Error(`Could not list users: ${error.message}`);
      }
      
      const matchingUser = data.users.find(u => u.email === email);
      
      if (!matchingUser) {
        throw new Error(`User with email ${email} not found. Make sure they've signed up first.`);
      }
      
      // Update user metadata to make them an admin
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        matchingUser.id,
        { user_metadata: { is_admin: true } }
      );
      
      if (updateError) {
        throw new Error(`Failed to update user: ${updateError.message}`);
      }
      
      console.log(`\nSuccess! User ${email} is now an admin.`);
      
    } else {
      // Update user metadata to make them an admin
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { is_admin: true } }
      );
      
      if (updateError) {
        throw new Error(`Failed to update user: ${updateError.message}`);
      }
      
      console.log(`\nSuccess! User ${email} is now an admin.`);
    }
    
  } catch (error) {
    console.error(`\nError making user admin: ${error.message}`);
    console.error('If the user does not exist, please have them sign up first.');
  }
}

async function setupAdmin() {
  console.log('=== SegakAI Admin User Setup ===');
  console.log('This script will help you set up your first admin user.');
  console.log('The user must already exist in your Supabase auth system.');
  
  rl.question('\nEnter the email of the user you want to make an admin: ', async (email) => {
    if (!email) {
      console.error('Email is required.');
      rl.close();
      return;
    }
    
    await makeUserAdmin(email);
    rl.close();
  });
}

setupAdmin(); 