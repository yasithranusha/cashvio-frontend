"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Badge } from "@workspace/ui/components/badge";
import {
  MessageCircle,
  PlusCircle,
  Search,
  ShoppingBag,
  Clock,
  Store,
  FileQuestion,
  AlertTriangle,
  SendHorizonal,
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

// Types for our data
type SupportTicket = {
  id: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  status: "open" | "closed" | "pending";
  orderId?: string;
  category: "Product Availability" | "Damaged Order" | "Warranty Claim" | "Other";
  messages: SupportMessage[];
};

type SupportMessage = {
  id: string;
  content: string;
  timestamp: string;
  sender: "customer" | "support";
  attachments?: string[];
};

// Mock data
const supportTickets: SupportTicket[] = [
  {
    id: "TKT2025001",
    subject: "Product damaged",
    createdAt: "2025-04-10T14:30:00Z",
    updatedAt: "2025-04-12T09:15:00Z",
    status: "open",
    orderId: "INV2025015",
    category: "Damaged Order",
    messages: [
      {
        id: "msg1",
        content: "I picked up my order today but when I got home I noticed the phone screen was cracked. Please advise on next steps.",
        timestamp: "2025-04-10T14:30:00Z",
        sender: "customer",
      },
      {
        id: "msg2",
        content: "I'm sorry to hear about the damaged product. Could you please upload some photos of the damage so we can process a replacement?",
        timestamp: "2025-04-10T15:20:00Z",
        sender: "support",
      },
      {
        id: "msg3",
        content: "Here are the photos of the damaged screen. You can see the crack in the corner.",
        timestamp: "2025-04-10T16:05:00Z",
        sender: "customer",
        attachments: ["photo1.jpg", "photo2.jpg"],
      },
      {
        id: "msg4",
        content: "Thank you for providing the photos. I've initiated a replacement for you. You can visit our store to exchange the damaged item for a replacement. Would tomorrow work for you?",
        timestamp: "2025-04-10T16:45:00Z",
        sender: "support",
      },
      {
        id: "msg5",
        content: "Yes, I can come by tomorrow afternoon. What time is best and who should I ask for?",
        timestamp: "2025-04-12T09:15:00Z",
        sender: "customer",
      },
    ],
  },
  {
    id: "TKT2025002",
    subject: "Checking Samsung S30 Ultra availability",
    createdAt: "2025-04-15T10:22:00Z",
    updatedAt: "2025-04-15T11:30:00Z",
    status: "closed",
    category: "Product Availability",
    messages: [
      {
        id: "msg6",
        content: "Hi, I'd like to know if you have the Samsung Galaxy S30 Ultra in Cosmic Gray color available for pickup at your store?",
        timestamp: "2025-04-15T10:22:00Z",
        sender: "customer",
      },
      {
        id: "msg7",
        content: "Hello! Thank you for your interest. We currently have the Samsung Galaxy S30 Ultra in Cosmic Gray in stock at our main branch. Would you like me to reserve one for you to pick up?",
        timestamp: "2025-04-15T10:35:00Z",
        sender: "support",
      },
      {
        id: "msg8",
        content: "Great! Yes, please reserve one for me. I'll visit your store this afternoon.",
        timestamp: "2025-04-15T10:45:00Z",
        sender: "customer",
      },
      {
        id: "msg9",
        content: "Perfect! I've reserved a Galaxy S30 Ultra in Cosmic Gray under your name. The reservation will be valid until closing time today. Please ask for Mike at the customer service counter when you arrive. Is there anything else I can help with?",
        timestamp: "2025-04-15T11:00:00Z",
        sender: "support",
      },
      {
        id: "msg10",
        content: "That's all, thank you for your help!",
        timestamp: "2025-04-15T11:30:00Z",
        sender: "customer",
      },
    ],
  },
  {
    id: "TKT2025003",
    subject: "Warranty claim for LG refrigerator",
    createdAt: "2025-05-02T09:10:00Z",
    updatedAt: "2025-05-02T09:10:00Z",
    status: "pending",
    orderId: "INV2024020",
    category: "Warranty Claim",
    messages: [
      {
        id: "msg11",
        content: "I'd like to file a warranty claim for my LG refrigerator that I purchased last December. The cooling system has stopped working properly. When can I bring it to the store for inspection?",
        timestamp: "2025-05-02T09:10:00Z",
        sender: "customer",
      },
    ],
  },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<string>("active");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showNewTicketForm, setShowNewTicketForm] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Form state for new ticket
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    orderId: "",
    message: "",
  });

  // Filter tickets based on active tab and search query
  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesTab = 
      (activeTab === "active" && ticket.status !== "closed") ||
      (activeTab === "closed" && ticket.status === "closed") ||
      activeTab === "all";
    
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.orderId && ticket.orderId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesSearch;
  });

  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    // In a real app, this would send the message to the backend
    console.log(`Sending message for ticket ${selectedTicket.id}: ${newMessage}`);
    
    // For demo purposes, we'll just add it to the UI
    const updatedTicket = {
      ...selectedTicket,
      messages: [
        ...selectedTicket.messages,
        {
          id: `msg${Date.now()}`,
          content: newMessage,
          timestamp: new Date().toISOString(),
          sender: "customer" as const,
        },
      ],
      updatedAt: new Date().toISOString(),
    };
    
    setSelectedTicket(updatedTicket);
    setNewMessage("");
    
    // Simulate a support response after a delay
    if (Math.random() > 0.3) { // 70% chance of getting a quick response
      setTimeout(() => {
        if (selectedTicket) {
          const responseTicket = {
            ...updatedTicket,
            messages: [
              ...updatedTicket.messages,
              {
                id: `msg${Date.now() + 1}`,
                content: "Thank you for your message. Our team will review it and get back to you as soon as possible. If you need immediate assistance, please visit our store during business hours.",
                timestamp: new Date().toISOString(),
                sender: "support" as const,
              },
            ],
            updatedAt: new Date().toISOString(),
          };
          setSelectedTicket(responseTicket);
        }
      }, 2000);
    }
  };

  // Handle creating a new ticket
  const handleCreateTicket = () => {
    // Validate form
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.message) {
      alert("Please fill in all required fields");
      return;
    }
    
    // In a real app, this would send the form to the backend
    console.log("Creating new support ticket:", ticketForm);
    
    // For demo purposes, show a success message
    alert("Support ticket created successfully!");
    
    // Reset form and hide it
    setTicketForm({
      subject: "",
      category: "",
      orderId: "",
      message: "",
    });
    setShowNewTicketForm(false);
    
    // In a real app, we would fetch the updated ticket list here
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Customer Support</h1>
          <p className="text-muted-foreground mt-1">
            Get help with store products, orders, or warranty claims
          </p>
        </div>
        <Button onClick={() => setShowNewTicketForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Support Ticket
        </Button>
      </div>

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Support Ticket</CardTitle>
            <CardDescription>
              Fill in the details below to create a new support request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input 
                  id="subject" 
                  placeholder="Brief description of your issue" 
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Select 
                  onValueChange={(value) => setTicketForm({...ticketForm, category: value})}
                  value={ticketForm.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Product Availability">Product Availability</SelectItem>
                      <SelectItem value="Damaged Order">Damaged Order</SelectItem>
                      <SelectItem value="Warranty Claim">Warranty Claim</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="order" className="text-sm font-medium">
                  Order ID <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input 
                  id="order" 
                  placeholder="e.g. INV2025001" 
                  value={ticketForm.orderId}
                  onChange={(e) => setTicketForm({...ticketForm, orderId: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Describe your issue in detail" 
                  rows={5}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowNewTicketForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket}>
              Create Ticket
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
              <TabsTrigger value="closed" className="flex-1">Resolved</TabsTrigger>
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4 space-y-2 max-h-[calc(100vh-280px)] overflow-auto">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <Card 
                    key={ticket.id}
                    className={`cursor-pointer ${selectedTicket?.id === ticket.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium line-clamp-1">{ticket.subject}</span>
                        <Badge variant={ticket.status === 'open' ? 'default' : ticket.status === 'closed' ? 'secondary' : 'outline'}>
                          {ticket.status === 'open' ? 'Active' : ticket.status === 'closed' ? 'Resolved' : 'Pending'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{ticket.messages.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(ticket.updatedAt), "MMM d")}</span>
                        </div>
                      </div>
                      
                      {ticket.orderId && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs">
                          <ShoppingBag className="h-3 w-3" />
                          <span className="text-muted-foreground">Order: {ticket.orderId}</span>
                        </div>
                      )}
                      
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        {ticket.category === "Product Availability" && <FileQuestion className="h-3 w-3 text-blue-500" />}
                        {ticket.category === "Damaged Order" && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                        {ticket.category === "Warranty Claim" && <Store className="h-3 w-3 text-purple-500" />}
                        <span className="text-muted-foreground">{ticket.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <p>No tickets found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Chat Area */}
        <div className="md:col-span-2">
          {selectedTicket ? (
            <Card className="h-[calc(100vh-180px)] flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>Ticket #{selectedTicket.id}</span>
                      {selectedTicket.orderId && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                            Order #{selectedTicket.orderId}
                          </span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={selectedTicket.status === 'open' ? 'default' : selectedTicket.status === 'closed' ? 'secondary' : 'outline'}>
                    {selectedTicket.status === 'open' ? 'Active' : selectedTicket.status === 'closed' ? 'Resolved' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'customer' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === 'support' && (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/support-avatar.png" />
                              <AvatarFallback>CS</AvatarFallback>
                            </Avatar>
                          )}
                          <span className="text-xs font-medium">
                            {message.sender === 'customer' ? 'You' : 'Store Support'}
                          </span>
                          <span className="text-xs opacity-70">
                            {format(new Date(message.timestamp), "MMM d, h:mm a")}
                          </span>
                        </div>
                        
                        <p className="text-sm">{message.content}</p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {message.attachments.map((attachment, index) => (
                              <div 
                                key={index}
                                className="bg-background/20 rounded p-2 text-xs flex items-center justify-center"
                              >
                                {attachment}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <CardFooter className="border-t p-3">
                {selectedTicket.status !== 'closed' ? (
                  <div className="flex w-full gap-2">
                    <Input 
                      placeholder="Type your message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <SendHorizonal className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full text-center">
                    <p className="text-sm text-muted-foreground">This ticket has been resolved</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Reopen ticket
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-180px)] flex flex-col justify-center items-center">
              <div className="text-center p-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium text-lg">No conversation selected</h3>
                <p className="text-muted-foreground mt-2">
                  Select a ticket from the list or create a new support ticket
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowNewTicketForm(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Ticket
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}