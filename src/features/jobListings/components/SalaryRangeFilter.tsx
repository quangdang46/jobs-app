"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { DollarSignIcon, FilterIcon, SearchIcon } from "lucide-react";

const SAMPLE_JOBS = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: { min: 120000, max: 180000, interval: "yearly" },
    type: "Full-time",
    remote: true,
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "StartupXYZ",
    location: "New York, NY",
    salary: { min: 80000, max: 120000, interval: "yearly" },
    type: "Full-time",
    remote: false,
  },
  {
    id: "3",
    title: "Freelance Designer",
    company: "Design Studio",
    location: "Remote",
    salary: { min: 50, max: 100, interval: "hourly" },
    type: "Contract",
    remote: true,
  },
  {
    id: "4",
    title: "Product Manager",
    company: "BigTech Inc",
    location: "Seattle, WA",
    salary: { min: 140000, max: 200000, interval: "yearly" },
    type: "Full-time",
    remote: true,
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "AI Solutions",
    location: "Boston, MA",
    salary: { min: 100000, max: 150000, interval: "yearly" },
    type: "Full-time",
    remote: false,
  },
];

export default function SalaryRangeFilter() {
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [salaryType, setSalaryType] = useState("yearly");
  const [jobType, setJobType] = useState("all");
  const [location, setLocation] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const formatSalary = (amount: number, interval: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    });

    if (interval === "hourly") {
      return `${formatter.format(amount)}/hr`;
    }
    return formatter.format(amount);
  };

  const isInSalaryRange = (jobSalary: (typeof SAMPLE_JOBS)[0]["salary"]) => {
    if (jobSalary.interval !== salaryType) return false;

    const jobMin = jobSalary.min;
    const jobMax = jobSalary.max;
    const [filterMin, filterMax] = salaryRange;

    return jobMax >= filterMin && jobMin <= filterMax;
  };

  const filteredJobs = SAMPLE_JOBS.filter((job) => {
    const matchesSalary = isInSalaryRange(job.salary);
    const matchesType =
      jobType === "all" || job.type.toLowerCase().includes(jobType);
    const matchesLocation =
      location === "all" ||
      (location === "remote" && job.remote) ||
      (location === "onsite" && !job.remote) ||
      job.location.toLowerCase().includes(location.toLowerCase());
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSalary && matchesType && matchesLocation && matchesSearch;
  });

  const resetFilters = () => {
    setSalaryRange([0, 200000]);
    setSalaryType("yearly");
    setJobType("all");
    setLocation("all");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Jobs by Salary Range
          </h1>
          <p className="text-muted-foreground text-lg">
            Find jobs that match your salary expectations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FilterIcon className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Job title or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Salary Type */}
                <div className="space-y-2">
                  <Label>Salary Type</Label>
                  <Select value={salaryType} onValueChange={setSalaryType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yearly">Annual Salary</SelectItem>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Salary Range */}
                <div className="space-y-4">
                  <Label>
                    Salary Range (
                    {salaryType === "yearly" ? "Annual" : "Hourly"})
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={salaryRange}
                      onValueChange={setSalaryRange}
                      max={salaryType === "yearly" ? 300000 : 200}
                      min={0}
                      step={salaryType === "yearly" ? 5000 : 5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatSalary(salaryRange[0], salaryType)}</span>
                    <span>{formatSalary(salaryRange[1], salaryType)}</span>
                  </div>
                </div>

                {/* Job Type */}
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="san francisco">
                        San Francisco
                      </SelectItem>
                      <SelectItem value="new york">New York</SelectItem>
                      <SelectItem value="seattle">Seattle</SelectItem>
                      <SelectItem value="boston">Boston</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Job Results */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {filteredJobs.length} Jobs Found
              </h2>
              <div className="text-sm text-muted-foreground">
                Showing jobs with {formatSalary(salaryRange[0], salaryType)} -{" "}
                {formatSalary(salaryRange[1], salaryType)}
              </div>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-semibold text-green-600">
                          <DollarSignIcon className="w-5 h-5" />
                          {formatSalary(
                            job.salary.min,
                            job.salary.interval
                          )} -{" "}
                          {formatSalary(job.salary.max, job.salary.interval)}
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">
                          {job.salary.interval}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{job.type}</Badge>
                      <Badge variant="outline">{job.location}</Badge>
                      {job.remote && <Badge variant="outline">Remote</Badge>}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Posted 2 days ago • 15 applicants
                      </div>
                      <Button>Apply Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                  <DollarSignIcon className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your salary range or other filters
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
