"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { ClockIcon, EyeIcon, BookmarkIcon, XIcon, HistoryIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const SAMPLE_VIEWED_JOBS = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    companyLogo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    location: "San Francisco, CA",
    salary: "$120k - $180k",
    type: "Full-time",
    remote: true,
    viewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    viewCount: 3,
    saved: false
  },
  {
    id: "2",
    title: "Product Manager",
    company: "StartupXYZ",
    companyLogo: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    location: "New York, NY",
    salary: "$130k - $160k",
    type: "Full-time",
    remote: false,
    viewedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    viewCount: 1,
    saved: true
  },
  {
    id: "3",
    title: "UX Designer",
    company: "Design Studio",
    companyLogo: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    location: "Remote",
    salary: "$85k - $120k",
    type: "Full-time",
    remote: true,
    viewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    viewCount: 2,
    saved: false
  },
  {
    id: "4",
    title: "Data Scientist",
    company: "AI Solutions",
    companyLogo: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    location: "Seattle, WA",
    salary: "$110k - $160k",
    type: "Full-time",
    remote: true,
    viewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    viewCount: 1,
    saved: false
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "CloudTech Inc",
    companyLogo: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    location: "Austin, TX",
    salary: "$100k - $140k",
    type: "Full-time",
    remote: true,
    viewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    viewCount: 4,
    saved: true
  }
];

export default function RecentlyViewedJobs() {
  const [viewedJobs, setViewedJobs] = useState(SAMPLE_VIEWED_JOBS);
  const [filter, setFilter] = useState<"all" | "saved" | "recent">("all");

  const toggleSaveJob = (jobId: string) => {
    setViewedJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  const removeFromHistory = (jobId: string) => {
    setViewedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const clearAllHistory = () => {
    setViewedJobs([]);
  };

  const filteredJobs = viewedJobs.filter(job => {
    switch (filter) {
      case "saved":
        return job.saved;
      case "recent":
        return Date.now() - job.viewedAt.getTime() < 24 * 60 * 60 * 1000; // Last 24 hours
      default:
        return true;
    }
  });

  const getCompanyInitials = (companyName: string) => {
    return companyName.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Recently Viewed Jobs
          </h1>
          <p className="text-muted-foreground text-lg">
            Keep track of jobs you`ve viewed and easily return to them
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({viewedJobs.length})
            </Button>
            <Button
              variant={filter === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("recent")}
            >
              Recent ({viewedJobs.filter(job => Date.now() - job.viewedAt.getTime() < 24 * 60 * 60 * 1000).length})
            </Button>
            <Button
              variant={filter === "saved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("saved")}
            >
              Saved ({viewedJobs.filter(job => job.saved).length})
            </Button>
          </div>

          {viewedJobs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllHistory}
              className="text-destructive hover:text-destructive"
            >
              Clear All History
            </Button>
          )}
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-2 border-background shadow-sm">
                      <AvatarImage src={job.companyLogo} alt={job.company} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getCompanyInitials(job.company)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold mb-1 hover:text-primary cursor-pointer">
                            {job.title}
                          </h3>
                          <p className="text-muted-foreground">{job.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleSaveJob(job.id)}
                          >
                            <BookmarkIcon 
                              className={`w-4 h-4 ${job.saved ? 'fill-current text-primary' : ''}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromHistory(job.id)}
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="font-medium text-green-600">{job.salary}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{job.type}</Badge>
                        {job.remote && <Badge variant="outline">Remote</Badge>}
                        {job.saved && <Badge variant="outline" className="text-primary border-primary">Saved</Badge>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>Viewed {formatDistanceToNow(job.viewedAt, { addSuffix: true })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <EyeIcon className="w-4 h-4" />
                            <span>{job.viewCount} {job.viewCount === 1 ? 'view' : 'views'}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <HistoryIcon className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              {filter === "all" ? "No jobs viewed yet" : 
               filter === "saved" ? "No saved jobs" : 
               "No recent views"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {filter === "all" ? "Start browsing jobs to see your viewing history here" :
               filter === "saved" ? "Save jobs you're interested in to find them easily later" :
               "No jobs viewed in the last 24 hours"}
            </p>
            <Button>
              Browse Jobs
            </Button>
          </div>
        )}

        {/* Viewing Tips */}
        {viewedJobs.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="w-5 h-5" />
                Viewing History Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <BookmarkIcon className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Save for Later</p>
                    <p className="text-muted-foreground">Click the bookmark icon to save jobs you`re interested in</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <EyeIcon className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Track Views</p>
                    <p className="text-muted-foreground">See how many times you`ve viewed each job</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ClockIcon className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Recent Activity</p>
                    <p className="text-muted-foreground">Jobs are sorted by when you last viewed them</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}