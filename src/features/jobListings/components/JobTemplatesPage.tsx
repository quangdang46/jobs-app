"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SearchIcon, BookmarkIcon, ClockIcon, UsersIcon } from "lucide-react";

const JOB_TEMPLATES = [
  {
    id: "1",
    title: "Software Engineer",
    category: "Technology",
    description: "Full-stack software engineer position with modern tech stack",
    requirements: ["3+ years experience", "React/Node.js", "Database knowledge"],
    responsibilities: ["Develop web applications", "Code reviews", "Collaborate with team"],
    usageCount: 245,
    lastUsed: "2 days ago",
    tags: ["Remote", "Full-time", "Senior"]
  },
  {
    id: "2", 
    title: "Marketing Manager",
    category: "Marketing",
    description: "Lead marketing campaigns and brand strategy",
    requirements: ["5+ years marketing", "Digital marketing", "Team leadership"],
    responsibilities: ["Campaign management", "Brand strategy", "Team coordination"],
    usageCount: 156,
    lastUsed: "1 week ago",
    tags: ["Hybrid", "Full-time", "Management"]
  },
  {
    id: "3",
    title: "Data Scientist",
    category: "Technology", 
    description: "Analyze data and build ML models for business insights",
    requirements: ["Python/R", "Machine Learning", "Statistics"],
    responsibilities: ["Data analysis", "Model building", "Report insights"],
    usageCount: 89,
    lastUsed: "3 days ago",
    tags: ["Remote", "Full-time", "Analytics"]
  },
  {
    id: "4",
    title: "UX Designer",
    category: "Design",
    description: "Create user-centered designs for digital products",
    requirements: ["Design portfolio", "Figma/Sketch", "User research"],
    responsibilities: ["User research", "Wireframing", "Prototyping"],
    usageCount: 134,
    lastUsed: "5 days ago",
    tags: ["Hybrid", "Full-time", "Creative"]
  }
];

const CATEGORIES = ["All", "Technology", "Marketing", "Design", "Sales", "Finance"];

export default function JobTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedTemplates, setSavedTemplates] = useState<string[]>([]);

  const filteredTemplates = JOB_TEMPLATES.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSaveTemplate = (templateId: string) => {
    setSavedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Job Templates
          </h1>
          <p className="text-muted-foreground text-lg">
            Pre-built job description templates to speed up your hiring process
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{template.title}</CardTitle>
                    <Badge variant="secondary" className="mb-2">{template.category}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSaveTemplate(template.id)}
                  >
                    <BookmarkIcon 
                      className={`w-4 h-4 ${savedTemplates.includes(template.id) ? 'fill-current' : ''}`}
                    />
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">{template.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {template.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Key Requirements:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {template.requirements.slice(0, 3).map((req, idx) => (
                      <li key={idx}>• {req}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <UsersIcon className="w-3 h-3" />
                    <span>{template.usageCount} uses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    <span>{template.lastUsed}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <SearchIcon className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}