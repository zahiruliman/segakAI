"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@supabase/supabase-js";
import { Eye, EyeOff, Save, Lock, UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface ConfigItem {
  id: string;
  key: string;
  value: string;
  description: string;
  is_secret: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  const [updatedValues, setUpdatedValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      setIsLoading(true);
      try {
        // Initialize Supabase client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Check authentication status
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("You must be logged in to access admin settings");
          router.push("/login?redirect=/admin");
          return;
        }

        // Verify admin status
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError || !userData) {
          toast.error("Failed to load user data");
          router.push("/dashboard");
          return;
        }

        const isAdmin = userData?.raw_user_meta_data?.is_admin === true || 
                        userData?.user_metadata?.is_admin === true;

        if (!isAdmin) {
          toast.error("You don't have permission to access admin settings");
          router.push("/dashboard");
          return;
        }

        setIsAdminUser(true);

        // Fetch configurations
        const response = await fetch("/api/config");
        if (!response.ok) {
          throw new Error(`Error fetching config: ${response.statusText}`);
        }
        
        const data = await response.json();
        setConfigs(data);
        
        // Initialize updatedValues with current values
        const values: Record<string, string> = {};
        data.forEach((config: ConfigItem) => {
          values[config.key] = config.value;
        });
        setUpdatedValues(values);
      } catch (error) {
        console.error("Error loading admin page:", error);
        toast.error("Failed to load admin settings");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  const handleValueChange = (key: string, value: string) => {
    setUpdatedValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleShowSecret = (key: string) => {
    setShowSecret((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveConfig = async (key: string) => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          value: updatedValues[key],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error updating config: ${response.statusText}`);
      }

      toast.success(`${key} updated successfully`);
      
      // Refresh the configs
      const response2 = await fetch("/api/config");
      if (response2.ok) {
        const data = await response2.json();
        setConfigs(data);
      }
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error(`Failed to update ${key}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <Separator />
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => router.push("/admin/make-admin")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Make Admin
          </Button>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
      
      <Separator />

      <div className="grid gap-6">
        {configs.map((config) => (
          <Card key={config.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{config.key}</CardTitle>
                  <CardDescription>{config.description}</CardDescription>
                </div>
                {config.is_secret && (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`config-${config.key}`}>Value</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <div className="relative w-full">
                    <Input
                      id={`config-${config.key}`}
                      type={config.is_secret && !showSecret[config.key] ? "password" : "text"}
                      value={updatedValues[config.key] || ""}
                      onChange={(e) => handleValueChange(config.key, e.target.value)}
                      className="pr-10"
                    />
                    {config.is_secret && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10"
                        onClick={() => toggleShowSecret(config.key)}
                      >
                        {showSecret[config.key] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={() => saveConfig(config.key)}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 text-xs text-muted-foreground">
              Last updated: {new Date(config.updated_at).toLocaleString()}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 