Below is an enhanced PRD for SegakAI that provides clear, actionable guidance to developers. It includes a detailed file structure, example code snippets for context (without full implementation), sample API responses, and links to the relevant documentation for the major packages and technologies used. You can use this document as a reference point during implementation.

---

# Project Requirements Document (PRD) for SegakAI

## 1. Project Overview

**Project Title:** SegakAI

**Description:**  
SegakAI is a progressive web app (PWA) that leverages the OpenAI API to generate personalized and extensive workout and diet plans. The app follows a human-centric, step-by-step approach to collect comprehensive user details. It tailors fitness recommendations—including exercise routines, durations, and nutritional plans—to the individual's goals. The UI/UX is built strictly following [shadcn guidelines](https://ui.shadcn.com/) for a modern, clean design. The app is deployed on a dedicated VPS and uses [Supabase](https://supabase.com/docs) for backend services, including authentication (with social login support).

---

## 2. Core Functionality

### 2.1. User Onboarding & Authentication

- **Purpose:**  
  - Provide a seamless user registration/login process using Supabase Auth.
  - Offer social login options (e.g., Google, Facebook) alongside email/password sign-up.
  
- **Key Features:**
  - **Landing Page:**  
    - Hero section with clear value proposition and a "Get Started" call-to-action.
  - **Authentication Flow:**  
    - A sign-up/login page that integrates Supabase Auth.
  - **Onboarding Tutorial:**  
    - A brief walkthrough that introduces users to the step-by-step data input form and explains how to navigate the dashboard.

- **Example Code Snippet (Pseudo-code):**

  ```tsx
  // pages/index.tsx (simplified view for authentication)
  const IndexPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    return (
      <>
        {!isAuthenticated ? (
          <LandingPage onAuthSuccess={() => setIsAuthenticated(true)} />
        ) : (
          <MainAppFlow />
        )}
      </>
    );
  };
  ```

  *This example demonstrates conditional rendering based on the user's authentication status.*

### 2.2. Step-by-Step Data Input Form

- **Purpose:**  
  - Collect detailed user information in manageable steps.
  
- **Flow & Fields:**
  - **Step 1:** Personal Details (Age, Gender, Nationality/Cultural Background)
  - **Step 2:** Lifestyle & Wellbeing (Sleep, Mental Health, Family Status, Living Arrangement, Workload)
  - **Step 3:** Physical Attributes & Current Habits (Body Description, Current Meal Habits, Exercise Knowledge)
  - **Step 4:** Fitness Goals & Preferences (Primary Goals, Desired Body Shape, Efficiency Preferences)
  
- **Developer Notes:**
  - Use state management (e.g., React Context or local state) to track progress through the form.
  - Include progress indicators and the ability to review or modify previous entries.

- **Example Code Snippet (Pseudo-code):**

  ```tsx
  // Pseudocode for a multi-step form component
  const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    
    const handleNext = (data) => {
      setFormData({...formData, ...data});
      setStep(step + 1);
    };

    switch(step) {
      case 1:
        return <StepOne onNext={handleNext} />;
      case 2:
        return <StepTwo onNext={handleNext} />;
      // additional cases...
      default:
        return <ReviewForm data={formData} />;
    }
  };
  ```

### 2.3. AI-Powered Plan Generation

- **Purpose:**  
  - Use the collected user data to generate a personalized workout and diet plan by calling the OpenAI API.
  
- **Flow:**
  - On final form submission, the frontend sends user data to an API endpoint.
  - The backend processes the data and calls the OpenAI API to generate recommendations.
  - The API returns a structured plan (workout details and diet plan) which is then saved in the user's account.

- **Developer Notes:**
  - Create an API route (e.g., `/api/generate.ts`) that handles requests.
  - Use environment variables to securely store API keys and configuration settings.
  
- **Example API Request/Response:**

  **Request (JSON):**
  ```json
  {
    "userDetails": {
      "age": 28,
      "gender": "Female",
      "lifestyle": { "sleep": "not enough sleep", "workload": "busy" },
      "physicalAttributes": { "bodyDescription": "skinny fat" },
      "goals": { "primary": "remove belly fat", "preferences": "fast routines" }
    }
  }
  ```

  **Response (JSON):**
  ```json
  {
    "workoutPlan": {
      "exercises": [
        { "name": "Plank", "duration": "60 seconds" },
        { "name": "Squats", "reps": "3 sets of 15" }
      ],
      "goal": "Fat Loss"
    },
    "dietPlan": {
      "meals": [
        { "time": "Breakfast", "recommendation": "Oatmeal with fruits" },
        { "time": "Lunch", "recommendation": "Grilled chicken salad" }
      ]
    }
  }
  ```

- **Relevant Documentation:**
  - [OpenAI API Documentation](https://platform.openai.com/docs)  
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

### 2.4. Dashboard & Report UI

- **Purpose:**  
  - Provide a clear, user-friendly interface to view and manage past AI-generated plans.
  
- **Key Features:**
  - **Dashboard:**  
    - Display a list of previous plans with summary details (date, highlights, status).
  - **Detailed Report View:**  
    - When a plan is selected, show a full report including workout routines and diet recommendations.
    - Options to download the report as a PDF or share it via social/email.

- **Example Code Snippet (Pseudo-code):**

  ```tsx
  // Pseudocode for rendering the dashboard
  const Dashboard = ({ plans }) => {
    return (
      <div>
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    );
  };

  // Pseudocode for the detailed report view
  const PlanReport = ({ plan }) => {
    return (
      <div>
        <h2>Plan Generated on: {plan.date}</h2>
        <section>
          <h3>Workout Plan</h3>
          {plan.workoutPlan.exercises.map(exercise => (
            <div key={exercise.name}>{exercise.name} - {exercise.duration || exercise.reps}</div>
          ))}
        </section>
        <section>
          <h3>Diet Plan</h3>
          {plan.dietPlan.meals.map(meal => (
            <div key={meal.time}>{meal.time}: {meal.recommendation}</div>
          ))}
        </section>
      </div>
    );
  };
  ```

- **Developer Notes:**
  - Ensure the UI follows [shadcn guidelines](https://ui.shadcn.com/) for consistency and modern design.
  - Utilize Next.js's dynamic routing if you wish to split the dashboard and report pages in the future.

---

## 3. File Structure

Below is the minimal file structure to keep the project lean yet fully functional:

```
/segakai
├── package.json              // Project metadata, dependencies, and scripts
├── tsconfig.json             // TypeScript configuration
├── next.config.js            // Next.js configuration (PWA, etc.)
├── /pages
│   ├── _app.tsx              // Global context, CSS imports, Supabase Auth setup
│   ├── index.tsx             // Combines landing page, auth, form, and dashboard (conditional rendering)
│   └── api
│       └── generate.ts       // API endpoint for OpenAI integration
├── /styles
│   └── globals.css           // Global styling (adhering to shadcn guidelines)
└── /public
    ├── manifest.json         // PWA manifest for installation
    └── favicon.ico           // Favicon for the app
```

**Developer Notes on File Structure:**

- **pages/\_app.tsx:**  
  - This file sets up the global application context, imports global CSS, and integrates Supabase Auth.
  - [Next.js Custom App Documentation](https://nextjs.org/docs/advanced-features/custom-app)

- **pages/index.tsx:**  
  - Use conditional rendering to manage the multi-step process (landing, auth, form, dashboard).
  - This file acts as the central hub for UI state management.
  
- **pages/api/generate.ts:**  
  - Handles backend logic for AI plan generation.
  - Secure API key management via environment variables.
  - [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)

- **styles/globals.css:**  
  - Contains all global styles.
  - Ensure adherence to [shadcn UI guidelines](https://ui.shadcn.com/).

- **public/manifest.json:**  
  - Basic configuration to enable PWA functionality.
  - [MDN PWA Manifest Documentation](https://developer.mozilla.org/en-US/docs/Web/Manifest)

---

## 4. Integration & Dependencies

### 4.1. Frontend (React with Next.js)

- **Documentation:**  
  - [Next.js Documentation](https://nextjs.org/docs)  
  - [React Documentation](https://reactjs.org/docs/getting-started.html)

- **Example Code for a Next.js Page Component:**

  ```tsx
  // Example of a simple Next.js page
  const HomePage = () => {
    return (
      <div>
        <h1>Welcome to SegakAI</h1>
        <p>Generate your personalized workout and diet plans.</p>
      </div>
    );
  };

  export default HomePage;
  ```

### 4.2. Backend (Supabase & OpenAI API)

- **Supabase:**
  - **Documentation:**  
    - [Supabase Documentation](https://supabase.com/docs)
  - **Integration Notes:**
    - Use [Supabase Auth](https://supabase.com/docs/guides/auth) for user authentication.
    - Leverage Supabase's PostgreSQL database for storing user plans and history.

- **OpenAI API:**
  - **Documentation:**  
    - [OpenAI API Documentation](https://platform.openai.com/docs)
  - **Integration Notes:**
    - Securely call the OpenAI API from your API route (pages/api/generate.ts).
    - Ensure that your API keys are stored in environment variables (e.g., `.env.local`).

### 4.3. Progressive Web App (PWA)

- **Documentation:**  
  - [PWA Overview – Google Developers](https://developers.google.com/web/progressive-web-apps)
- **Integration Notes:**
  - Implement service workers and caching strategies via Next.js configuration.
  - The manifest.json file should be properly configured for installation on devices.

---

## 5. Testing & Documentation

### 5.1. Testing

- **Unit Testing:**  
  - Consider using [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for frontend components.
- **End-to-End Testing:**  
  - Tools like [Cypress](https://www.cypress.io/) can be integrated for testing user flows (from landing page to dashboard).

### 5.2. Developer Documentation

- **Inline Documentation:**  
  - Include JSDoc/TSDoc comments within code files to explain component logic and API behavior.
- **Project Wiki/README:**  
  - Expand the README.md with instructions on setting up environment variables, running the development server, and deploying to production.
- **Example Response Documentation:**
  - Document expected API responses (as shown in the API request/response section above) in the project's Wiki or a dedicated API documentation file.

---

## 6. Additional Resources

- **Next.js:** [https://nextjs.org/docs](https://nextjs.org/docs) citenextjs-docs  
- **Supabase:** [https://supabase.com/docs](https://supabase.com/docs) citesupabase-docs  
- **OpenAI API:** [https://platform.openai.com/docs](https://platform.openai.com/docs) citeopenai-docs  
- **PWA Guidelines:** [https://developers.google.com/web/progressive-web-apps](https://developers.google.com/web/progressive-web-apps) citepwa-docs  
- **shadcn UI:** [https://ui.shadcn.com/](https://ui.shadcn.com/) citeshadcn-docs

---

## Conclusion

This PRD outlines the technical and functional requirements for SegakAI, ensuring clear alignment for developers. The document details the minimal file structure, step-by-step flows, example code snippets, and references to relevant documentation. This should serve as a comprehensive guide for building, testing, and deploying the project with best practices in mind.

Feel free to expand or modify sections as needed during the development process, and ensure that all team members have access to the linked documentation for deeper context and ongoing reference.