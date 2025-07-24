"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  MessageSquareIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  CalendarIcon,
  UserIcon,
  StarIcon,
  FilterIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const SAMPLE_APPLICATIONS = [
  {
    id: "1",
    candidateName: "Sarah Johnson",
    candidateAvatar: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    jobTitle: "Senior Frontend Developer",
    stage: "interviewed",
    rating: 4,
    appliedDate: new Date("2024-01-15"),
    notes: [
      {
        id: "n1",
        content: "Strong technical background in React and TypeScript. Great communication skills during the phone screening.",
        author: "John Smith",
        authorRole: "Hiring Manager",
        createdAt: new Date("2024-01-16T10:30:00"),
        type: "general"
      },
      {
        id: "n2", 
        content: "Technical interview went well. Candidate demonstrated solid problem-solving skills and clean coding practices.",
        author: "Mike Chen",
        authorRole: "Senior Developer",
        createdAt: new Date("2024-01-18T14:15:00"),
        type: "interview"
      }
    ]
  },
  {
    id: "2",
    candidateName: "David Rodriguez",
    candidateAvatar: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    jobTitle: "Product Manager",
    stage: "applied",
    rating: 3,
    appliedDate: new Date("2024-01-20"),
    notes: [
      {
        id: "n3",
        content: "Resume shows good product management experience. Need to verify leadership experience in next interview.",
        author: "Lisa Wang",
        authorRole: "VP Product",
        createdAt: new Date("2024-01-21T09:00:00"),
        type: "screening"
      }
    ]
  },
  {
    id: "3",
    candidateName: "Emily Chen",
    candidateAvatar: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    jobTitle: "UX Designer",
    stage: "interested",
    rating: 5,
    appliedDate: new Date("2024-01-18"),
    notes: [
      {
        id: "n4",
        content: "Exceptional portfolio showcasing user-centered design approach. Strong understanding of accessibility principles.",
        author: "Alex Thompson",
        authorRole: "Design Lead",
        createdAt: new Date("2024-01-19T11:45:00"),
        type: "portfolio_review"
      },
      {
        id: "n5",
        content: "Follow up: Candidate is very interested in our design system work. Schedule design challenge for next week.",
        author: "Alex Thompson", 
        authorRole: "Design Lead",
        createdAt: new Date("2024-01-22T16:20:00"),
        type: "follow_up"
      }
    ]
  }
];

const NOTE_TYPES = [
  { value: "general", label: "General", color: "bg-gray-100 text-gray-800" },
  { value: "screening", label: "Screening", color: "bg-blue-100 text-blue-800" },
  { value: "interview", label: "Interview", color: "bg-green-100 text-green-800" },
  { value: "portfolio_review", label: "Portfolio Review", color: "bg-purple-100 text-purple-800" },
  { value: "follow_up", label: "Follow Up", color: "bg-yellow-100 text-yellow-800" },
  { value: "reference", label: "Reference Check", color: "bg-orange-100 text-orange-800" }
];

export default function ApplicationNotesPage() {
  const [applications, setApplications] = useState(SAMPLE_APPLICATIONS);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newNoteType, setNewNoteType] = useState("general");
  const [filterStage, setFilterStage] = useState("all");
  const [filterRating, setFilterRating] = useState("all");

  const filteredApplications = applications.filter(app => {
    const matchesStage = filterStage === "all" || app.stage === filterStage;
    const matchesRating = filterRating === "all" || app.rating.toString() === filterRating;
    return matchesStage && matchesRating;
  });

  const selectedApp = applications.find(app => app.id === selectedApplication);

  const addNote = () => {
    if (!newNote.trim() || !selectedApplication) return;

    const note = {
      id: `n${Date.now()}`,
      content: newNote,
      author: "Current User",
      authorRole: "Hiring Manager",
      createdAt: new Date(),
      type: newNoteType
    };

    setApplications(prev => prev.map(app => 
      app.id === selectedApplication 
        ? { ...app, notes: [...app.notes, note] }
        : app
    ));

    setNewNote("");
    setNewNoteType("general");
  };

  const deleteNote = (noteId: string) => {
    if (!selectedApplication) return;

    setApplications(prev => prev.map(app =>
      app.id === selectedApplication
        ? { ...app, notes: app.notes.filter(note => note.id !== noteId) }
        : app
    ));
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "applied": return "bg-blue-100 text-blue-800";
      case "interested": return "bg-green-100 text-green-800";
      case "interviewed": return "bg-purple-100 text-purple-800";
      case "hired": return "bg-emerald-100 text-emerald-800";
      case "denied": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getNoteTypeColor = (type: string) => {
    const noteType = NOTE_TYPES.find(t => t.value === type);
    return noteType?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Application Notes & Comments
          </h1>
          <p className="text-muted-foreground text-lg">
            Track interview feedback and hiring decisions for each candidate
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FilterIcon className="w-5 h-5" />
                  Applications ({filteredApplications.length})
                </CardTitle>
                
                {/* Filters */}
                <div className="space-y-2">
                  <Select value={filterStage} onValueChange={setFilterStage}>
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interested">Interested</SelectItem>
                      <SelectItem value="interviewed">Interviewed</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterRating} onValueChange={setFilterRating}>
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredApplications.map(app => (
                    <div
                      key={app.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 ${
                        selectedApplication === app.id 
                          ? 'bg-muted/50 border-l-primary' 
                          : 'border-l-transparent'
                      }`}
                      onClick={() => setSelectedApplication(app.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={app.candidateAvatar} alt={app.candidateName} />
                          <AvatarFallback>
                            {app.candidateName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{app.candidateName}</h3>
                          <p className="text-sm text-muted-foreground truncate">{app.jobTitle}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStageColor(app.stage)} variant="secondary">
                              {app.stage}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon 
                                  key={i} 
                                  className={`w-3 h-3 ${
                                    i < app.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <MessageSquareIcon className="w-3 h-3" />
                            <span>{app.notes.length} notes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Detail */}
          <div className="lg:col-span-3">
            {selectedApp ? (
              <div className="space-y-6">
                {/* Candidate Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={selectedApp.candidateAvatar} alt={selectedApp.candidateName} />
                        <AvatarFallback className="text-lg">
                          {selectedApp.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">{selectedApp.candidateName}</h2>
                        <p className="text-muted-foreground text-lg">{selectedApp.jobTitle}</p>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <Badge className={getStageColor(selectedApp.stage)}>
                            {selectedApp.stage}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < selectedApp.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarIcon className="w-4 h-4" />
                            <span>Applied {formatDistanceToNow(selectedApp.appliedDate, { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add New Note */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlusIcon className="w-5 h-5" />
                      Add Note
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="note-type">Note Type</Label>
                      <Select value={newNoteType} onValueChange={setNewNoteType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {NOTE_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="note-content">Note Content</Label>
                      <Textarea
                        id="note-content"
                        placeholder="Add your notes about this candidate..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-24"
                      />
                    </div>
                    
                    <Button onClick={addNote} disabled={!newNote.trim()}>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </CardContent>
                </Card>

                {/* Notes List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquareIcon className="w-5 h-5" />
                      Notes & Comments ({selectedApp.notes.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedApp.notes.length > 0 ? (
                      <div className="space-y-4">
                        {selectedApp.notes
                          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                          .map(note => (
                          <div key={note.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">{note.author}</span>
                                  <span className="text-sm text-muted-foreground">({note.authorRole})</span>
                                </div>
                                <Badge className={getNoteTypeColor(note.type)} variant="secondary">
                                  {NOTE_TYPES.find(t => t.value === note.type)?.label}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(note.createdAt, { addSuffix: true })}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteNote(note.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground leading-relaxed">
                              {note.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquareIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No notes yet</p>
                        <p className="text-sm text-muted-foreground">Add the first note about this candidate</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquareIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select an Application</h3>
                  <p className="text-muted-foreground">
                    Choose an application from the list to view and manage notes
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}