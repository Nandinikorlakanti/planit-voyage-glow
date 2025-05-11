
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type TripFormProps = {
  onSubmit: (tripData: any) => void;
};

export function TripForm({ onSubmit }: TripFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [budget, setBudget] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Mock location suggestions
  const mockLocations = [
    "Paris, France",
    "Tokyo, Japan",
    "New York, USA",
    "Barcelona, Spain",
    "Bali, Indonesia",
    "London, UK",
    "Sydney, Australia",
    "Rome, Italy"
  ];
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    
    if (value.length > 1) {
      // Filter locations that include the typed value
      const filtered = mockLocations.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocation(suggestion);
    setShowSuggestions(false);
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !location || !startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    if (startDate > endDate) {
      toast({
        variant: "destructive",
        title: "Invalid dates",
        description: "End date must be after start date.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Prepare trip data
    const tripData = {
      name,
      description,
      location,
      startDate,
      endDate,
      budget: budget ? parseFloat(budget) : undefined,
      coverImage: coverImagePreview || "/placeholder.svg",
    };
    
    // Simulate API delay
    setTimeout(() => {
      onSubmit(tripData);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trip Name */}
      <div className="space-y-2">
        <Label htmlFor="tripName" className="required">Trip Name</Label>
        <Input
          id="tripName"
          placeholder="Summer Vacation 2025"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <textarea
          id="description"
          placeholder="Tell us about your trip..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      
      {/* Location with Suggestions */}
      <div className="space-y-2">
        <Label htmlFor="location" className="required">Location</Label>
        <div className="relative">
          <Input
            id="location"
            placeholder="Where are you going?"
            value={location}
            onChange={handleLocationChange}
            required
          />
          {showSuggestions && (
            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover text-popover-foreground shadow-md">
              {locationSuggestions.map((suggestion) => (
                <li 
                  key={suggestion}
                  className="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <Label className="required">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                disabled={(date) => date < new Date()}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* End Date */}
        <div className="space-y-2">
          <Label className="required">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => date < (startDate || new Date())}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Budget (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="budget">Budget (Optional)</Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            $
          </span>
          <Input
            id="budget"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      {/* Cover Image */}
      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image (Optional)</Label>
        <div className="flex flex-col space-y-4">
          {coverImagePreview && (
            <div className="relative w-full h-48 rounded-md overflow-hidden">
              <img
                src={coverImagePreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center">
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Trip...
          </>
        ) : (
          "Create Trip"
        )}
      </Button>
    </form>
  );
}
