
import { PageTransition } from "@/components/layout/PageTransition";

export default function About() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      bio: "Former travel consultant with a passion for simplifying the trip planning process.",
      avatar: "https://i.pravatar.cc/300?img=1",
    },
    {
      name: "Marcus Johnson",
      role: "Head of Product",
      bio: "10+ years in product management with leading travel tech companies.",
      avatar: "https://i.pravatar.cc/300?img=3",
    },
    {
      name: "Aisha Patel",
      role: "Lead Developer",
      bio: "Full-stack developer specializing in collaborative tools and real-time applications.",
      avatar: "https://i.pravatar.cc/300?img=5",
    },
    {
      name: "David Kim",
      role: "UX Designer",
      bio: "Passionate about creating beautiful, intuitive user experiences that people love.",
      avatar: "https://i.pravatar.cc/300?img=8",
    },
  ];

  return (
    <PageTransition>
      <div className="container py-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
          <p className="text-xl text-muted-foreground">
            Planit was born from a simple idea: make group travel planning as enjoyable as the trip itself.
          </p>
        </div>

        {/* Our Story */}
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-semibold mb-4">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Planit began in 2023 when our founder, Sarah Chen, experienced the frustration of planning a multi-city European trip with friends. Endless email chains, conflicting spreadsheets, and missed details made what should have been exciting become stressful.
                </p>
                <p>
                  She envisioned a platform where groups could collaborate seamlessly, keeping all plans, ideas, and budgets in one place. After connecting with fellow travelers and tech enthusiasts, Planit was born.
                </p>
                <p>
                  Today, we're helping thousands of travelers around the world plan better trips together. Our platform combines collaborative tools, smart itinerary management, and budget tracking to create the ultimate trip planning experience.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=1000&auto=format&fit=crop" 
                alt="Team planning a trip" 
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-4 -left-4 bg-primary rounded-lg p-4 shadow-lg">
                <p className="text-white font-medium">Founded in 2023</p>
                <p className="text-white/80 text-sm">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12">
          <h2 className="font-heading text-3xl font-semibold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Adventure</h3>
              <p className="text-muted-foreground">
                We believe in fostering the spirit of adventure and exploration in everything we do.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-muted-foreground">
                We create tools that bring people together, just as travel brings us closer to each other.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Experience</h3>
              <p className="text-muted-foreground">
                We focus on creating memorable travel experiences, not just itineraries or checklists.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Simplicity</h3>
              <p className="text-muted-foreground">
                We strive to make complex planning processes simple, intuitive and enjoyable.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                  <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
                  <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
                  <circle cx="12" cy="12" r="2"></circle>
                  <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
                  <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Connection</h3>
              <p className="text-muted-foreground">
                We help people connect with each other and with the world around them.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Trust</h3>
              <p className="text-muted-foreground">
                We build secure and reliable tools that our users can trust with their travel plans.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-12">
          <h2 className="font-heading text-3xl font-semibold mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-card border rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-4">
                  <h3 className="font-heading text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
