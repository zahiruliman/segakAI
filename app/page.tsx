import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-24 md:py-32 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your <span className="text-primary">Personalized</span> Fitness Journey Starts Here
          </h1>
          <p className="text-xl text-muted-foreground max-w-prose mx-auto">
            SegakAI generates tailored workout and diet plans customized to your unique goals, lifestyle, and preferences using advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg" className="font-medium">
              <Link href="/onboarding">
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SegakAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Personalized Plans</h3>
              <p className="text-muted-foreground">Get workout and diet plans tailored specifically to your body, lifestyle, and goals.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Human-Centric Approach</h3>
              <p className="text-muted-foreground">We consider all aspects of your life to create balanced, achievable fitness plans.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-muted-foreground">Leverage cutting-edge AI to receive evidence-based recommendations for optimal results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-primary">1</span>
              </div>
              <h3 className="font-medium mb-2">Create an Account</h3>
              <p className="text-sm text-muted-foreground">Sign up and set up your profile</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-primary">2</span>
              </div>
              <h3 className="font-medium mb-2">Answer Questions</h3>
              <p className="text-sm text-muted-foreground">Tell us about your lifestyle and goals</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-primary">3</span>
              </div>
              <h3 className="font-medium mb-2">Get Your Plan</h3>
              <p className="text-sm text-muted-foreground">Receive your personalized recommendations</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-primary">4</span>
              </div>
              <h3 className="font-medium mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">Follow your plan and see results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer/CTA */}
      <section className="mt-auto py-12 bg-primary/5">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to transform your fitness journey?</h2>
          <Button asChild size="lg" className="font-medium">
            <Link href="/onboarding">
              Get Started Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
