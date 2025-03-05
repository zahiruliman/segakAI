"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AlertCircle, User, Lock, Save } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (!data.session) {
          router.push("/login");
          return;
        }

        setUser(data.session.user);
        setFormData(prev => ({
          ...prev,
          email: data.session.user.email || "",
          name: data.session.user.user_metadata?.name || ""
        }));
      } catch (error) {
        console.error("Profile error:", error);
        if (error instanceof Error) {
          setError(error.message);
          toast.error(`Authentication error: ${error.message}`);
        } else {
          setError("An unknown error occurred");
          toast.error("Failed to load profile. Please try logging in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      
      // Update user metadata (name)
      const { error: updateError } = await supabase.auth.updateUser({
        data: { name: formData.name }
      });

      if (updateError) throw updateError;
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      if (error instanceof Error) {
        toast.error(`Failed to update profile: ${error.message}`);
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    try {
      setSaving(true);
      
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }
      
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) throw error;
      
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Password update error:", error);
      if (error instanceof Error) {
        toast.error(`Failed to update password: ${error.message}`);
      } else {
        toast.error("Failed to update password");
      }
    } finally {
      setSaving(false);
    }
  };

  // Display a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        <div className="text-destructive mb-4">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground text-center mb-6">{error}</p>
        <Button onClick={() => router.push("/login")}>
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container py-8 md:py-12 mt-16"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Profile Settings</h1>
        
        <Tabs defaultValue="account" className="w-full">
          <div className="md:rounded-xl rounded-none md:border border-x-0 md:shadow-sm overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 md:rounded-t-xl sticky top-[57px] z-10 backdrop-blur">
              <TabsList className="w-full md:w-auto grid grid-cols-2 h-auto p-1 bg-muted/50">
                <TabsTrigger value="account" className="py-2 rounded-md data-[state=active]:bg-background">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="security" className="py-2 rounded-md data-[state=active]:bg-background">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Security</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="account" className="p-4 md:p-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Account Information</h2>
                  <p className="text-muted-foreground">Update your account details and personal information.</p>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your email address cannot be changed.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                    />
                  </div>
                  
                  <Button 
                    onClick={updateProfile} 
                    disabled={saving}
                    className="w-full md:w-auto flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="p-4 md:p-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Security Settings</h2>
                  <p className="text-muted-foreground">Update your password and security preferences.</p>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="New password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <Button 
                    onClick={updatePassword} 
                    disabled={saving || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
                    className="w-full md:w-auto flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Update Password
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
} 