"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  SearchIcon, 
  CodeIcon, 
  PaletteIcon, 
  TrendingUpIcon,
  DollarSignIcon,
  HeartIcon,
  GraduationCapIcon,
  BuildingIcon,
  UsersIcon,
  BarChart3Icon
} from "lucide-react";

const JOB_CATEGORIES = [
  {
    id: "technology",
    name: "Technology",
    icon: <CodeIcon className="w-8 h-8" />,
    description: "Software development, IT, and tech roles",
    jobCount: 1247,
    avgSalary: "$95k",
    growth: "+12%",
    color: "bg-blue-100 text-blue-600 border-blue-200",
    subcategories: ["Frontend Development", "Backend Development", "DevOps", "Data Science", "Mobile Development"]
  },
  {
    id: "design",
    name: "Design & Creative",
    icon: <PaletteIcon className="w-8 h-8" />,
    description: "UI/UX design, graphic design, and creative roles",
    jobCount: 456,
    avgSalary: "$72k",
    growth: "+8%",
    color: "bg-purple-100 text-purple-600 border-purple-200",
    subcategories: ["UI/UX Design", "Graphic Design", "Product Design", "Brand Design", "Motion Graphics"]
  },
  {
    id: "marketing",
    name: "Marketing & Sales",
    icon: <TrendingUpIcon className="w-8 h-8" />,
    description: "Digital marketing, sales, and growth roles",
    jobCount: 789,
    avgSalary: "$68k",
    growth: "+15%",
    color: "bg-green-100 text-green-600 border-green-200",
    subcategories: ["Digital Marketing", "Content Marketing", "Sales", "SEO/SEM", "Social Media"]
  },
  {
    id: "finance",
    name: "Finance & Accounting",
    icon: <DollarSignIcon className="w-8 h-8" />,
    description: "Financial analysis, accounting, and fintech",
    jobCount: 623,
    avgSalary: "$78k",
    growth: "+6%",
    color: "bg-yellow-100 text-yellow-600 border-yellow-200",
    subcategories: ["Financial Analysis", "Accounting", "Investment", "Risk Management", "Fintech"]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: <HeartIcon className="w-8 h-8" />,
    description: "Medical, nursing, and healthcare technology",
    jobCount: 892,
    avgSalary: "$82k",
    growth: "+18%",
    color: "bg-red-100 text-red-600 border-red-200",
    subcategories: ["Nursing", "Medical Technology", "Healthcare IT", "Clinical Research", "Telemedicine"]
  },
  {
    id: "education",
    name: "Education",
    icon: <GraduationCapIcon className="w-8 h-8" />,
    description: "Teaching, training, and educational technology",
    jobCount: 334,
    avgSalary: "$58k",
    growth: "+4%",
    color: "bg-indigo-100 text-indigo-600 border-indigo-200",
    subcategories: ["K-12 Teaching", "Higher Education", "EdTech", "Corporate Training", "Curriculum Design"]
  },
  {
    id: "construction",
    name: "Construction & Engineering",
    icon: <BuildingIcon className="w-8 h-8" />,
    description: "Civil engineering, construction, and architecture",
    jobCount: 567,
    avgSalary: "$75k",
    growth: "+10%",
    color: "bg-orange-100 text-orange-600 border-orange-200",
    subcategories: ["Civil Engineering", "Architecture", "Construction Management", "Electrical", "Mechanical"]
  },
  {
    id: "hr",
    name: "Human Resources",
    icon: <UsersIcon className="w-8 h-8" />,
    description: "HR management, recruiting, and people operations",
    jobCount: 298,
    avgSalary: "$65k",
    growth: "+7%",
    color: "bg-pink-100 text-pink-600 border-pink-200",
    subcategories: ["Recruiting", "HR Management", "People Operations", "Compensation", "Training & Development"]
  },
  {
    id: "consulting",
    name: "Consulting & Strategy",
    icon: <BarChart3Icon className="w-8 h-8" />,
    description: "Business consulting and strategic planning",
    jobCount: 445,
    avgSalary: "$92k",
    growth: "+9%",
    color: "bg-teal-100 text-teal-600 border-teal-200",
    subcategories: ["Management Consulting", "Strategy", "Business Analysis", "Operations", "Change Management"]
  }
];

export default function JobCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = JOB_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalJobs = JOB_CATEGORIES.reduce((sum, cat) => sum + cat.jobCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Browse by Category
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore {totalJobs.toLocaleString()} jobs across {JOB_CATEGORIES.length} industries
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map(category => (
            <Card 
              key={category.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${category.color} group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{category.jobCount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">open positions</div>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {category.name}
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  {category.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{category.avgSalary}</div>
                    <div className="text-xs text-muted-foreground">Avg Salary</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{category.growth}</div>
                    <div className="text-xs text-muted-foreground">Growth</div>
                  </div>
                </div>

                {/* Subcategories */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Popular roles:</h4>
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.slice(0, 3).map(sub => (
                      <Badge key={sub} variant="outline" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
                    {category.subcategories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.subcategories.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  View {category.jobCount} Jobs
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <SearchIcon className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{totalJobs.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Jobs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{JOB_CATEGORIES.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">$75k</div>
              <div className="text-sm text-muted-foreground">Avg Salary</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">+10%</div>
              <div className="text-sm text-muted-foreground">Avg Growth</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}