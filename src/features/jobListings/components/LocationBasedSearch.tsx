"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { MapPinIcon, SearchIcon, NavigationIcon, FilterIcon } from "lucide-react";

const SAMPLE_JOBS = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    distance: "2.3 miles",
    salary: "$120k - $180k",
    type: "Full-time",
    remote: false,
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: "2",
    title: "Frontend Developer", 
    company: "StartupXYZ",
    location: "Palo Alto, CA",
    distance: "15.7 miles",
    salary: "$90k - $130k",
    type: "Full-time",
    remote: false,
    coordinates: { lat: 37.4419, lng: -122.1430 }
  },
  {
    id: "3",
    title: "Remote Product Manager",
    company: "GlobalTech",
    location: "Remote (US)",
    distance: "Remote",
    salary: "$140k - $200k",
    type: "Full-time", 
    remote: true,
    coordinates: null
  },
  {
    id: "4",
    title: "UX Designer",
    company: "Design Studio",
    location: "Oakland, CA",
    distance: "8.1 miles",
    salary: "$85k - $120k",
    type: "Full-time",
    remote: false,
    coordinates: { lat: 37.8044, lng: -122.2712 }
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "AI Solutions",
    location: "San Jose, CA", 
    distance: "42.3 miles",
    salary: "$110k - $160k",
    type: "Full-time",
    remote: false,
    coordinates: { lat: 37.3382, lng: -121.8863 }
  }
];

const POPULAR_LOCATIONS = [
  "San Francisco, CA",
  "New York, NY", 
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Los Angeles, CA"
];

export default function LocationBasedSearch() {
  const [searchLocation, setSearchLocation] = useState("San Francisco, CA");
  const [searchRadius, setSearchRadius] = useState("25");
  const [jobType, setJobType] = useState("all");
  const [includeRemote, setIncludeRemote] = useState(true);
  const [sortBy, setSortBy] = useState("distance");

  const filteredJobs = SAMPLE_JOBS.filter(job => {
    const matchesType = jobType === "all" || job.type.toLowerCase().includes(jobType);
    const matchesRemote = includeRemote || !job.remote;
    return matchesType && matchesRemote;
  }).sort((a, b) => {
    if (sortBy === "distance") {
      if (a.remote && !b.remote) return 1;
      if (!a.remote && b.remote) return -1;
      if (a.remote && b.remote) return 0;
      return parseFloat(a.distance) - parseFloat(b.distance);
    }
    return 0;
  });

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          setSearchLocation("Current Location");
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Jobs Near You
          </h1>
          <p className="text-muted-foreground text-lg">
            Find opportunities in your area or explore remote positions
          </p>
        </div>

        {/* Search Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Location Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Enter city, state, or zip code"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={useCurrentLocation}
                  className="mt-2 text-primary"
                >
                  <NavigationIcon className="w-4 h-4 mr-1" />
                  Use current location
                </Button>
              </div>

              {/* Search Radius */}
              <div>
                <Select value={searchRadius} onValueChange={setSearchRadius}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Within 5 miles</SelectItem>
                    <SelectItem value="10">Within 10 miles</SelectItem>
                    <SelectItem value="25">Within 25 miles</SelectItem>
                    <SelectItem value="50">Within 50 miles</SelectItem>
                    <SelectItem value="100">Within 100 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type */}
              <div>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Sort by Distance</SelectItem>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="salary">Sort by Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Popular Locations */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Popular locations:</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_LOCATIONS.map(location => (
                  <Button
                    key={location}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchLocation(location)}
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5" />
                  Job Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPinIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive Map</p>
                    <p className="text-sm text-muted-foreground">
                      {filteredJobs.length} jobs in this area
                    </p>
                  </div>
                </div>
                
                {/* Distance Legend */}
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-sm">Distance Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>0-10 miles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>10-25 miles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>25+ miles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Remote</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Results */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {filteredJobs.length} Jobs Found
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={includeRemote ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIncludeRemote(!includeRemote)}
                >
                  Include Remote
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredJobs.map(job => {
                const getDistanceColor = (distance: string) => {
                  if (distance === "Remote") return "text-blue-600";
                  const miles = parseFloat(distance);
                  if (miles <= 10) return "text-green-600";
                  if (miles <= 25) return "text-yellow-600";
                  return "text-red-600";
                };

                const getDistanceDot = (distance: string) => {
                  if (distance === "Remote") return "bg-blue-500";
                  const miles = parseFloat(distance);
                  if (miles <= 10) return "bg-green-500";
                  if (miles <= 25) return "bg-yellow-500";
                  return "bg-red-500";
                };

                return (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow max-w-lg w-full">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                          <p className="text-muted-foreground">{job.company}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            {job.salary}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getDistanceDot(job.distance)}`}></div>
                          <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <div className={`text-sm font-medium ${getDistanceColor(job.distance)}`}>
                          {job.distance}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{job.type}</Badge>
                        {job.remote && <Badge variant="outline">Remote</Badge>}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Posted 2 days ago • 12 applicants
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            View on Map
                          </Button>
                          <Button size="sm">Apply Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                  <SearchIcon className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try expanding your search radius or adjusting your filters
                </p>
                <Button onClick={() => setSearchRadius("50")}>
                  Expand Search Radius
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}