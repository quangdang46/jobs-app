"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CalendarIcon, ClockIcon, AlertTriangleIcon, RefreshCwIcon, BellIcon } from "lucide-react";
import { differenceInDays, format, addDays } from "date-fns";

const JOB_LISTINGS = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    postedDate: new Date("2024-01-15"),
    expiryDate: new Date("2024-02-15"),
    status: "active",
    applications: 45,
    autoRenewal: true,
    renewalDays: 30
  },
  {
    id: "2", 
    title: "Product Manager",
    postedDate: new Date("2024-01-20"),
    expiryDate: new Date("2024-01-28"),
    status: "expiring_soon",
    applications: 23,
    autoRenewal: false,
    renewalDays: 30
  },
  {
    id: "3",
    title: "Data Scientist",
    postedDate: new Date("2024-01-10"),
    expiryDate: new Date("2024-01-25"),
    status: "expired",
    applications: 67,
    autoRenewal: true,
    renewalDays: 45
  },
  {
    id: "4",
    title: "UX Designer", 
    postedDate: new Date("2024-01-22"),
    expiryDate: new Date("2024-02-22"),
    status: "active",
    applications: 34,
    autoRenewal: false,
    renewalDays: 30
  }
];

export default function JobExpiryManagement() {
  const [jobListings, setJobListings] = useState(JOB_LISTINGS);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "expiring_soon": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "expired": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <ClockIcon className="w-4 h-4" />;
      case "expiring_soon": return <AlertTriangleIcon className="w-4 h-4" />;
      case "expired": return <AlertTriangleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getDaysRemaining = (expiryDate: Date) => {
    return differenceInDays(expiryDate, new Date());
  };

  const getProgressPercentage = (postedDate: Date, expiryDate: Date) => {
    const totalDays = differenceInDays(expiryDate, postedDate);
    const daysElapsed = differenceInDays(new Date(), postedDate);
    return Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
  };

  const toggleAutoRenewal = (jobId: string) => {
    setJobListings(prev => prev.map(job => 
      job.id === jobId ? { ...job, autoRenewal: !job.autoRenewal } : job
    ));
  };

  const renewJob = (jobId: string) => {
    setJobListings(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            expiryDate: addDays(new Date(), job.renewalDays),
            status: "active"
          } 
        : job
    ));
  };

  const activeJobs = jobListings.filter(job => job.status === "active").length;
  const expiringSoon = jobListings.filter(job => job.status === "expiring_soon").length;
  const expiredJobs = jobListings.filter(job => job.status === "expired").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Job Expiry Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor and manage job listing expiration dates and renewals
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                  <p className="text-3xl font-bold text-green-600">{activeJobs}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                  <p className="text-3xl font-bold text-yellow-600">{expiringSoon}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangleIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expired</p>
                  <p className="text-3xl font-bold text-red-600">{expiredJobs}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobListings.map(job => {
            const daysRemaining = getDaysRemaining(job.expiryDate);
            const progress = getProgressPercentage(job.postedDate, job.expiryDate);
            
            return (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Posted: {format(job.postedDate, "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Expires: {format(job.expiryDate, "MMM dd, yyyy")}</span>
                        </div>
                        <span>{job.applications} applications</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1 capitalize">{job.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Time elapsed</span>
                      <span>
                        {daysRemaining > 0 
                          ? `${daysRemaining} days remaining`
                          : `Expired ${Math.abs(daysRemaining)} days ago`
                        }
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className={`h-2 ${
                        job.status === "expired" ? "bg-red-100" :
                        job.status === "expiring_soon" ? "bg-yellow-100" : "bg-green-100"
                      }`}
                    />
                  </div>

                  {/* Auto Renewal Settings */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`auto-renewal-${job.id}`}
                        checked={job.autoRenewal}
                        onCheckedChange={() => toggleAutoRenewal(job.id)}
                      />
                      <Label htmlFor={`auto-renewal-${job.id}`} className="flex items-center gap-2">
                        <RefreshCwIcon className="w-4 h-4" />
                        Auto-renewal ({job.renewalDays} days)
                      </Label>
                    </div>
                    
                    <div className="flex gap-2">
                      {job.status === "expired" && (
                        <Button 
                          size="sm" 
                          onClick={() => renewJob(job.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <RefreshCwIcon className="w-4 h-4 mr-1" />
                          Renew Now
                        </Button>
                      )}
                      
                      {job.status === "expiring_soon" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => renewJob(job.id)}
                        >
                          <RefreshCwIcon className="w-4 h-4 mr-1" />
                          Extend
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline">
                        <BellIcon className="w-4 h-4 mr-1" />
                        Remind Me
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}