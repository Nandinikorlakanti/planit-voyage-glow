
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";
import { TripForm } from "@/components/trips/TripForm";
import { useToast } from "@/hooks/use-toast";

export default function CreateTrip() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateTrip = (tripData: any) => {
    console.log("Trip data:", tripData);
    
    // Show success toast
    toast({
      title: "Trip created successfully!",
      description: "Your new trip has been added to your dashboard.",
    });
    
    // Navigate to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <PageTransition>
      <div className="container max-w-3xl py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Create a New Trip</h1>
          <p className="text-muted-foreground">Fill in the details to start planning your adventure</p>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <TripForm onSubmit={handleCreateTrip} />
        </div>
      </div>
    </PageTransition>
  );
}
