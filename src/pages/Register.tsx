
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Upload } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword;
  const isUsernameValid = username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!isEmailValid || !isUsernameValid || !hasMinLength || !hasUppercase || !hasNumber || !passwordsMatch || !agreeTerms) {
      toast({
        variant: "destructive",
        title: "Invalid form data",
        description: "Please check all form fields and try again.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: "", // We could add full name fields to the form if needed
          },
        },
      });
      
      if (error) throw error;
      
      // If avatar was uploaded, store it in Supabase Storage
      if (data?.user && avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${data.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(fileName, avatar);
          
        if (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          toast({
            variant: "destructive",
            title: "Avatar upload failed",
            description: "Your account was created, but we couldn't upload your profile picture.",
          });
        } else {
          // Get the public URL for the uploaded avatar
          const { data: publicUrlData } = supabase
            .storage
            .from('avatars')
            .getPublicUrl(fileName);
          
          // Update the user profile with avatar URL if needed
          if (publicUrlData.publicUrl) {
            const { error: profileError } = await supabase
              .from('users')
              .update({ avatar_url: publicUrlData.publicUrl })
              .eq('id', data.user.id);
              
            if (profileError) {
              console.error("Error updating profile with avatar:", profileError);
            }
          }
        }
      }
      
      toast({
        title: "Registration successful!",
        description: "Welcome to Planit. You can now log in.",
      });
      
      // Redirect to login page
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="container relative py-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {/* Avatar Upload */}
                <div className="grid gap-2">
                  <Label htmlFor="avatar">Profile Picture (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center overflow-hidden">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Profile Preview" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {email && !isEmailValid && (
                    <p className="text-xs text-destructive">Please enter a valid email address</p>
                  )}
                </div>

                {/* Username */}
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="off"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  {username && !isUsernameValid && (
                    <p className="text-xs text-destructive">
                      Username must be 3-20 characters and contain only letters, numbers and underscores
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  
                  {/* Password validation hints */}
                  {password && (
                    <div className="grid gap-1 text-xs mt-1">
                      <div className={`flex items-center ${hasMinLength ? 'text-secondary' : 'text-muted-foreground'}`}>
                        <div className={`h-1 w-1 rounded-full mr-1.5 ${hasMinLength ? 'bg-secondary' : 'bg-muted-foreground'}`}></div>
                        At least 8 characters
                      </div>
                      <div className={`flex items-center ${hasUppercase ? 'text-secondary' : 'text-muted-foreground'}`}>
                        <div className={`h-1 w-1 rounded-full mr-1.5 ${hasUppercase ? 'bg-secondary' : 'bg-muted-foreground'}`}></div>
                        At least 1 uppercase letter
                      </div>
                      <div className={`flex items-center ${hasNumber ? 'text-secondary' : 'text-muted-foreground'}`}>
                        <div className={`h-1 w-1 rounded-full mr-1.5 ${hasNumber ? 'bg-secondary' : 'bg-muted-foreground'}`}></div>
                        At least 1 number
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms} 
                    onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-tight">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline hover:text-primary">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
