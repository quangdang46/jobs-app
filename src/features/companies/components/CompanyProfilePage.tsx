"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { 
  MapPinIcon, 
  UsersIcon, 
  CalendarIcon, 
  GlobeIcon, 
  BuildingIcon,
  StarIcon,
  BriefcaseIcon,
  HeartIcon,
  ShareIcon
} from "lucide-react";

const COMPANY_DATA = {
  id: "1",
  name: "TechCorp Solutions",
  logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  coverImage: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
  description: "We are a leading technology company focused on innovative solutions for modern businesses. Our team of experts delivers cutting-edge software and services to help organizations transform digitally.",
  industry: "Technology",
  size: "201-500 employees",
  founded: "2015",
  location: "San Francisco, CA",
  website: "https://techcorp.com",
  rating: 4.5,
  reviewCount: 127,
  benefits: [
    "Health Insurance",
    "Remote Work",
    "Flexible Hours",
    "Stock Options",
    "Learning Budget",
    "Gym Membership"
  ],
  values: [
    "Innovation",
    "Collaboration", 
    "Integrity",
    "Excellence"
  ],
  stats: {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 456,
    avgResponseTime: "3 days"
  }
};

const ACTIVE_JOBS = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    postedDate: "2024-01-20",
    applications: 45,
    salary: "$120k - $150k"
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    type: "Full-time", 
    postedDate: "2024-01-18",
    applications: 32,
    salary: "$130k - $160k"
  },
  {
    id: "3",
    title: "UX Designer",
    department: "Design",
    location: "Hybrid",
    type: "Full-time",
    postedDate: "2024-01-15",
    applications: 28,
    salary: "$100k - $130k"
  }
];

export default function CompanyProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);

  const displayedJobs = showAllJobs ? ACTIVE_JOBS : ACTIVE_JOBS.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Cover Image */}
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${COMPANY_DATA.coverImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        {/* Company Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                <AvatarImage src={COMPANY_DATA.logo} alt={COMPANY_DATA.name} />
                <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                  {COMPANY_DATA.name.split(' ').map(word => word[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{COMPANY_DATA.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{COMPANY_DATA.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" />
                        <span>{COMPANY_DATA.size}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Founded {COMPANY_DATA.founded}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < Math.floor(COMPANY_DATA.rating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="font-medium">{COMPANY_DATA.rating}</span>
                      <span className="text-muted-foreground">({COMPANY_DATA.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      <HeartIcon className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant="outline">
                      <ShareIcon className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About {COMPANY_DATA.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {COMPANY_DATA.description}
                </p>
              </CardContent>
            </Card>

            {/* Active Jobs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5" />
                    Open Positions ({COMPANY_DATA.stats.activeJobs})
                  </CardTitle>
                  {ACTIVE_JOBS.length > 3 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAllJobs(!showAllJobs)}
                    >
                      {showAllJobs ? 'Show Less' : 'View All'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayedJobs.map(job => (
                  <div key={job.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {job.applications} applications • Posted {job.postedDate}
                      </div>
                      <Button size="sm">Apply Now</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Company Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Jobs Posted</span>
                  <span className="font-medium">{COMPANY_DATA.stats.totalJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Jobs</span>
                  <span className="font-medium">{COMPANY_DATA.stats.activeJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Applications</span>
                  <span className="font-medium">{COMPANY_DATA.stats.totalApplications}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Response Time</span>
                  <span className="font-medium">{COMPANY_DATA.stats.avgResponseTime}</span>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <BuildingIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{COMPANY_DATA.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GlobeIcon className="w-4 h-4 text-muted-foreground" />
                  <a href={COMPANY_DATA.website} className="text-primary hover:underline">
                    Visit Website
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {COMPANY_DATA.benefits.map(benefit => (
                    <Badge key={benefit} variant="secondary">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Values */}
            <Card>
              <CardHeader>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {COMPANY_DATA.values.map(value => (
                    <div key={value} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}