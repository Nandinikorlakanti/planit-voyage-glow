
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      title: "Collaborative Planning",
      description: "Plan together in real-time with friends and family. No more spreadsheets or long email chains.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      title: "Smart Itineraries",
      description: "Easily create and share detailed itineraries. Sync with your calendar to never miss an activity.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
    },
    {
      title: "Budget Tracking",
      description: "Keep track of expenses and split costs easily. Everyone stays on the same page financially.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      ),
    },
  ];

  const staggerDelay = 0.1;

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/40 py-24 md:py-32">
          <div className="container relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col space-y-6"
              >
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold !leading-tight">
                  Plan Your Adventures <span className="gradient-text">Together</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                  Collaborate with friends and family to create unforgettable travel experiences with ease.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button size="lg" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop"
                    alt="Friends traveling"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-2/3 rounded-lg shadow-lg overflow-hidden border-4 border-background">
                  <img
                    src="https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=500&auto=format&fit=crop"
                    alt="Planning a trip"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <svg className="absolute right-0 top-0 h-full text-primary/5" viewBox="0 0 500 500" width="500" xmlns="http://www.w3.org/2000/svg">
              <circle cx="400" cy="100" r="100" fill="currentColor" />
              <circle cx="100" cy="300" r="150" fill="currentColor" />
              <circle cx="400" cy="400" r="70" fill="currentColor" />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">How Planit Makes Trip Planning Easy</h2>
              <p className="text-muted-foreground text-lg">
                Our platform simplifies the process of planning trips with others, helping you create memorable experiences without the hassle.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * staggerDelay }}
                  className="flex flex-col bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-muted">
          <div className="container">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-10 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-4">
                  <h2 className="font-heading text-2xl md:text-3xl font-bold">Ready to start planning your next adventure?</h2>
                  <p className="text-white/80 max-w-lg">
                    Join Planit today and experience the easiest way to plan trips with friends and family.
                  </p>
                </div>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <Link to="/register">Sign Up Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - Could be added in the future */}
      </div>
    </PageTransition>
  );
}
