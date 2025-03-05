"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Save, Lock, ArrowLeft } from "lucide-react";
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
        // Check authentication status
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          toast.error("You must be logged in to access admin settings");
          router.push("/login?redirect=/admin");
          return;
        }

        // Check if user is admin directly from metadata
        const isAdmin = 
          session.user.user_metadata?.is_admin === true || 
          session.user.user_metadata?.is_admin === 'true';

        if (!isAdmin) {
          toast.error("You don't have permission to access admin settings");
          router.push("/dashboard");
          return;
        }

        setIsAdminUser(true);

        // Fetch configurations from app_config table
        const { data: configData, error: configError } = await supabase
          .from('app_config')
          .select('*');
          
        if (configError) {
          throw configError;
        }
        
        setConfigs(configData || []);
        
        // Initialize updatedValues with current values
        const values: Record<string, string> = {};
        configData?.forEach((config: ConfigItem) => {
          values[config.key] = config.value;
        });
        setUpdatedValues(values);
      } catch (error) {
        console.error("Error loading admin page:", error);
        toast.error("Failed to load admin settings");
        router.push("/dashboard");
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
      
      // Update the config directly using Supabase
      const { error } = await supabase
        .from('app_config')
        .update({ value: updatedValues[key] })
        .eq('key', key);
        
      if (error) {
        throw error;
      }

      toast.success(`${key} updated successfully`);
      
      // Refresh the configs
      const { data: refreshedData } = await supabase
        .from('app_config')
        .select('*');
        
      if (refreshedData) {
        setConfigs(refreshedData);
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
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
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
        <Button onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
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
          </Card>
        ))}
      </div>
    </div>
  );
} 