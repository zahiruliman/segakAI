import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Function to get OpenAI API key from app_config
async function getOpenAIKey() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get OpenAI API key from app_config
  const { data, error } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'OPENAI_API_KEY')
    .single();
  
  if (error || !data?.value) {
    console.error("Error fetching OpenAI API key:", error);
    throw new Error('OpenAI API key not configured');
  }
  
  return data.value;
}

export async function POST(request: NextRequest) {
  try {
    // Get OpenAI API key from app_config
    const apiKey = await getOpenAIKey();
    
    // Initialize OpenAI client with the API key
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Create Supabase client for auth
    const cookieStore = cookies();
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
    
    // Get auth token from cookies
    const authToken = request.cookies.get('sb-auth-token')?.value;
    if (authToken) {
      await supabaseClient.auth.setSession({
        access_token: authToken,
        refresh_token: '',
      });
    }

    // Verify authentication
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { userDetails } = body;

    if (!userDetails) {
      return NextResponse.json(
        { error: 'User details are required' },
        { status: 400 }
      );
    }

    // Generate a prompt for OpenAI based on user details
    const prompt = generatePrompt(userDetails);

    // Call OpenAI API to generate plan
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional fitness trainer and nutritionist. Your task is to create a personalized workout and diet plan based on the user's information. 
          The plan should be detailed, practical, and tailored to their specific goals, lifestyle, and physical attributes.
          Format your response as JSON with the following structure:
          {
            "workoutPlan": {
              "summary": "Brief overview of the workout plan and goals",
              "weeklySchedule": [
                {
                  "day": "Monday",
                  "focus": "Upper Body",
                  "exercises": [
                    {
                      "name": "Exercise name",
                      "sets": "Number of sets",
                      "reps": "Number of repetitions or duration",
                      "restPeriod": "Rest between sets",
                      "notes": "Optional form tips or variations"
                    }
                  ]
                }
              ],
              "progressionPlan": "How to progress over time",
              "recommendations": "Additional recommendations based on user's experience level"
            },
            "dietPlan": {
              "summary": "Brief overview of the nutritional approach",
              "dailyCalories": "Estimated daily caloric intake",
              "macronutrients": {
                "protein": "Daily protein target",
                "carbs": "Daily carbohydrate target",
                "fats": "Daily fat target"
              },
              "mealPlan": [
                {
                  "meal": "Breakfast",
                  "options": [
                    {
                      "name": "Meal name",
                      "ingredients": ["List of ingredients"],
                      "preparation": "Brief preparation instructions",
                      "nutritionalInfo": "Estimated calories and macros"
                    }
                  ]
                }
              ],
              "recommendations": "Additional dietary recommendations",
              "hydration": "Water intake recommendations"
            },
            "additionalRecommendations": "General lifestyle advice, sleep recommendations, etc."
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const plan = JSON.parse(completion.choices[0].message.content || '{}');

    // Store the plan in Supabase
    const { data, error } = await supabaseClient.from('plans').insert({
      user_id: user.id,
      plan_data: plan,
      user_details: userDetails
    }).select();

    if (error) {
      console.error('Error storing plan:', error);
      return NextResponse.json(
        { error: 'Failed to store generated plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      plan,
      plan_id: data?.[0]?.id
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
}

function generatePrompt(userDetails: any): string {
  return `I need a personalized workout and diet plan based on the following information:

Age: ${userDetails.age}
Gender: ${userDetails.gender}
Cultural Background: ${userDetails.culturalBackground || 'Not specified'}

Lifestyle:
- Sleep Quality: ${userDetails.lifestyle?.sleepQuality || 'Not specified'}
- Mental Health: ${userDetails.lifestyle?.mentalHealth || 'Not specified'}
- Family Status: ${userDetails.lifestyle?.familyStatus || 'Not specified'}
- Living Arrangement: ${userDetails.lifestyle?.livingArrangement || 'Not specified'}
- Workload: ${userDetails.lifestyle?.workload || 'Not specified'}

Physical Attributes:
- Body Description: ${userDetails.physicalAttributes?.bodyDescription || 'Not specified'}
- Current Meal Habits: ${userDetails.physicalAttributes?.currentMealHabits || 'Not specified'}
- Exercise Knowledge/Experience: ${userDetails.physicalAttributes?.exerciseKnowledge || 'Not specified'}

Fitness Goals:
- Primary Goal: ${userDetails.goals?.primaryGoal || 'Not specified'}
- Desired Body Shape: ${userDetails.goals?.desiredBodyShape || 'Not specified'}
- Workout Duration Preference: ${userDetails.goals?.efficiencyPreference || 'Not specified'}

Please provide a detailed workout plan and diet plan tailored specifically to this individual. Take into account their lifestyle constraints, physical attributes, and goals to make the plan realistic and achievable.`;
} 