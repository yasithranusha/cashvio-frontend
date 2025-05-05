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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
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
  CheckCircle2,
  Clock,
  FileQuestion,
  HelpCircle,
  MessageCircle,
  MoreHorizontal,
  Phone,
  PlusCircle,
  Search,
  SendHorizonal,
  ShoppingBag,
  Store,
  User,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

// Types for our data
type SupportTicket = {
  id: string;
  subject: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  status: "open" | "in_progress" | "resolved" | "pending";
  priority: "low" | "medium" | "high";
  orderId?: string;
  category:
    | "Product Availability"
    | "Damaged Order"
    | "Warranty Claim"
    | "Other";
  messages: SupportMessage[];
};

type SupportMessage = {
  id: string;
  content: string;
  timestamp: string;
  sender: "customer" | "staff";
  staffName?: string;
  attachments?: string[];
};

// Mock data
const supportTickets: SupportTicket[] = [
  {
    id: "TKT2025001",
    subject: "Product damaged",
    customer: {
      name: "Anura Perera",
      email: "anura@example.com",
      phone: "071-5623489",
    },
    assignedTo: "Kamala Fernando",
    createdAt: "2025-04-10T14:30:00Z",
    updatedAt: "2025-04-12T09:15:00Z",
    status: "in_progress",
    priority: "high",
    orderId: "INV2025015",
    category: "Damaged Order",
    messages: [
      {
        id: "msg1",
        content:
          "I picked up my order today but when I got home I noticed the phone screen was cracked. Please advise on next steps.",
        timestamp: "2025-04-10T14:30:00Z",
        sender: "customer",
      },
      {
        id: "msg2",
        content:
          "I'm sorry to hear about the damaged product. Could you please upload some photos of the damage so we can process a replacement?",
        timestamp: "2025-04-10T15:20:00Z",
        sender: "staff",
        staffName: "Kamala Fernando",
      },
      {
        id: "msg3",
        content:
          "Here are the photos of the damaged screen. You can see the crack in the corner.",
        timestamp: "2025-04-10T16:05:00Z",
        sender: "customer",
        attachments: ["photo1.jpg", "photo2.jpg"],
      },
      {
        id: "msg4",
        content:
          "Thank you for providing the photos. I've initiated a replacement for you. You can visit our store to exchange the damaged item for a replacement. Would tomorrow work for you?",
        timestamp: "2025-04-10T16:45:00Z",
        sender: "staff",
        staffName: "Kamala Fernando",
      },
      {
        id: "msg5",
        content:
          "Yes, I can come by tomorrow afternoon. What time is best and who should I ask for?",
        timestamp: "2025-04-12T09:15:00Z",
        sender: "customer",
      },
    ],
  },
  {
    id: "TKT2025002",
    subject: "Samsung S23 Ultra availability",
    customer: {
      name: "Dinesh Kumar",
      email: "dinesh@example.com",
      phone: "077-9812345",
    },
    assignedTo: "Nimal de Silva",
    createdAt: "2025-04-15T10:22:00Z",
    updatedAt: "2025-04-15T11:30:00Z",
    status: "resolved",
    priority: "medium",
    category: "Product Availability",
    messages: [
      {
        id: "msg6",
        content:
          "Hi, I'd like to know if you have the Samsung Galaxy S23 Ultra in Cosmic Gray color available for pickup at your store?",
        timestamp: "2025-04-15T10:22:00Z",
        sender: "customer",
      },
      {
        id: "msg7",
        content:
          "Hello! Thank you for your interest. We currently have the Samsung Galaxy S23 Ultra in Cosmic Gray in stock at our main branch. Would you like me to reserve one for you to pick up?",
        timestamp: "2025-04-15T10:35:00Z",
        sender: "staff",
        staffName: "Nimal de Silva",
      },
      {
        id: "msg8",
        content:
          "Great! Yes, please reserve one for me. I'll visit your store this afternoon.",
        timestamp: "2025-04-15T10:45:00Z",
        sender: "customer",
      },
      {
        id: "msg9",
        content:
          "Perfect! I've reserved a Galaxy S30 Ultra in Cosmic Gray under your name. The reservation will be valid until closing time today. Please ask for Mike at the customer service counter when you arrive. Is there anything else I can help with?",
        timestamp: "2025-04-15T11:00:00Z",
        sender: "staff",
        staffName: "Nimal de Silva",
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
    customer: {
      name: "Malini Jayawardena",
      email: "malini@example.com",
      phone: "076-3251890",
    },
    createdAt: "2025-05-02T09:10:00Z",
    updatedAt: "2025-05-02T09:10:00Z",
    status: "open",
    priority: "medium",
    orderId: "INV2024020",
    category: "Warranty Claim",
    messages: [
      {
        id: "msg11",
        content:
          "I'd like to file a warranty claim for my LG refrigerator that I purchased last December. The cooling system has stopped working properly. When can I bring it to the store for inspection?",
        timestamp: "2025-05-02T09:10:00Z",
        sender: "customer",
      },
    ],
  },
  {
    id: "TKT2025004",
    subject: "Delivery time for Philips TV",
    customer: {
      name: "Sunil Bandara",
      email: "sunil@example.com",
      phone: "070-1122334",
    },
    createdAt: "2025-05-04T14:22:00Z",
    updatedAt: "2025-05-04T15:30:00Z",
    status: "pending",
    priority: "low",
    orderId: "INV2025022",
    category: "Other",
    messages: [
      {
        id: "msg12",
        content:
          "I ordered a Philips Smart TV three days ago and selected home delivery. Could you please tell me when I can expect it to be delivered?",
        timestamp: "2025-05-04T14:22:00Z",
        sender: "customer",
      },
      {
        id: "msg13",
        content: "Let me check the status of your order. One moment please.",
        timestamp: "2025-05-04T14:45:00Z",
        sender: "staff",
        staffName: "Amal Perera",
      },
      {
        id: "msg14",
        content:
          "I've checked with our logistics team. Your TV is scheduled for delivery tomorrow between 10 AM and 2 PM. You'll receive an SMS notification before delivery. Is that time range convenient for you?",
        timestamp: "2025-05-04T15:30:00Z",
        sender: "staff",
        staffName: "Amal Perera",
      },
    ],
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "open":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-600 border-blue-200"
        >
          Open
        </Badge>
      );
    case "in_progress":
      return <Badge className="bg-amber-500">In Progress</Badge>;
    case "resolved":
      return <Badge className="bg-emerald-500">Resolved</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  switch (priority) {
    case "high":
      return (
        <Badge
          variant="destructive"
          className="bg-red-50 text-red-600 border-red-200"
        >
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-600 border-amber-200"
        >
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-600 border-green-200"
        >
          Low
        </Badge>
      );
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

// Staff list for assignment
const staffList = [
  { id: "staff1", name: "Kamala Fernando" },
  { id: "staff2", name: "Nimal de Silva" },
  { id: "staff3", name: "Amal Perera" },
  { id: "staff4", name: "Sanduni Gunawardena" },
];

// Category icons
const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "Product Availability":
      return <FileQuestion className="h-3 w-3 text-blue-500" />;
    case "Damaged Order":
      return <AlertTriangle className="h-3 w-3 text-orange-500" />;
    case "Warranty Claim":
      return <Store className="h-3 w-3 text-purple-500" />;
    default:
      return <HelpCircle className="h-3 w-3 text-gray-500" />;
  }
};

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<string>("open");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter tickets based on active tab and search query
  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesTab =
      (activeTab === "open" && ticket.status === "open") ||
      (activeTab === "in_progress" && ticket.status === "in_progress") ||
      (activeTab === "resolved" && ticket.status === "resolved") ||
      (activeTab === "pending" && ticket.status === "pending") ||
      activeTab === "all";

    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.orderId &&
        ticket.orderId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    // In a real app, this would send the message to the backend
    console.log(
      `Sending message for ticket ${selectedTicket.id}: ${newMessage}`
    );

    // For demo purposes, we'll just add it to the UI
    const updatedTicket = {
      ...selectedTicket,
      messages: [
        ...selectedTicket.messages,
        {
          id: `msg${Date.now()}`,
          content: newMessage,
          timestamp: new Date().toISOString(),
          sender: "staff" as const,
          staffName: "You",
        },
      ],
      updatedAt: new Date().toISOString(),
      // If ticket was open, change to in_progress
      status:
        selectedTicket.status === "open"
          ? "in_progress"
          : selectedTicket.status,
      // If ticket wasn't assigned, assign to current user
      assignedTo: selectedTicket.assignedTo || "You",
    };

    setSelectedTicket(updatedTicket);
    setNewMessage("");
  };

  // Handle changing ticket status
  const handleStatusChange = (
    status: "open" | "in_progress" | "resolved" | "pending"
  ) => {
    if (!selectedTicket) return;

    setSelectedTicket({
      ...selectedTicket,
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle assigning ticket to staff
  const handleAssignTicket = (staffName: string) => {
    if (!selectedTicket) return;

    setSelectedTicket({
      ...selectedTicket,
      assignedTo: staffName,
      status:
        selectedTicket.status === "open"
          ? "in_progress"
          : selectedTicket.status,
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle changing priority
  const handlePriorityChange = (priority: "low" | "medium" | "high") => {
    if (!selectedTicket) return;

    setSelectedTicket({
      ...selectedTicket,
      priority,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Customer Support
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and respond to customer inquiries and issues
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets, customers, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>

          <Tabs
            defaultValue="open"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent
              value={activeTab}
              className="mt-4 space-y-2 max-h-[calc(100vh-280px)] overflow-auto"
            >
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={`cursor-pointer ${selectedTicket?.id === ticket.id ? "border-primary" : ""}`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium line-clamp-1">
                          {ticket.subject}
                        </span>
                        <StatusBadge status={ticket.status} />
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="line-clamp-1">
                            {ticket.customer.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {format(new Date(ticket.updatedAt), "MMM d")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        <PriorityBadge priority={ticket.priority} />
                        <span className="text-muted-foreground ml-2">
                          {ticket.messages.length} messages
                        </span>
                      </div>

                      {ticket.orderId && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs">
                          <ShoppingBag className="h-3 w-3" />
                          <span className="text-muted-foreground">
                            Order: {ticket.orderId}
                          </span>
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        <CategoryIcon category={ticket.category} />
                        <span className="text-muted-foreground">
                          {ticket.category}
                        </span>
                      </div>

                      {ticket.assignedTo && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs bg-muted p-1 rounded">
                          <span className="text-muted-foreground">
                            Assigned to: {ticket.assignedTo}
                          </span>
                        </div>
                      )}
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
                    <CardTitle className="text-lg">
                      {selectedTicket.subject}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-2">
                        <span>Ticket #{selectedTicket.id}</span>
                        <StatusBadge status={selectedTicket.status} />
                        <PriorityBadge priority={selectedTicket.priority} />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5" />
                        <span>{selectedTicket.customer.name}</span>
                        {selectedTicket.customer.phone && (
                          <span className="text-xs text-muted-foreground">
                            ({selectedTicket.customer.phone})
                          </span>
                        )}
                      </div>
                      {selectedTicket.orderId && (
                        <div className="flex items-center gap-2 text-sm">
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Order #{selectedTicket.orderId}</span>
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Ticket Options</DropdownMenuLabel>
                      <DropdownMenuItem disabled>
                        View Customer History
                      </DropdownMenuItem>
                      {selectedTicket.orderId && (
                        <DropdownMenuItem>View Order Details</DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Assign To</DropdownMenuLabel>
                      {staffList.map((staff) => (
                        <DropdownMenuItem
                          key={staff.id}
                          onClick={() => handleAssignTicket(staff.name)}
                        >
                          {staff.name}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Set Priority</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handlePriorityChange("high")}
                      >
                        High Priority
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePriorityChange("medium")}
                      >
                        Medium Priority
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePriorityChange("low")}
                      >
                        Low Priority
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "staff" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "staff"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === "customer" ? (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/customer-avatar.png" />
                              <AvatarFallback>
                                {selectedTicket.customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/staff-avatar.png" />
                              <AvatarFallback>ST</AvatarFallback>
                            </Avatar>
                          )}
                          <span className="text-xs font-medium">
                            {message.sender === "customer"
                              ? selectedTicket.customer.name
                              : message.staffName || "Staff"}
                          </span>
                          <span className="text-xs opacity-70">
                            {format(
                              new Date(message.timestamp),
                              "MMM d, h:mm a"
                            )}
                          </span>
                        </div>

                        <p className="text-sm">{message.content}</p>

                        {message.attachments &&
                          message.attachments.length > 0 && (
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

              <CardFooter className="border-t p-3 flex-col gap-3">
                <div className="flex w-full gap-2">
                  <Textarea
                    placeholder="Type your response..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex w-full justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Insert Template
                    </Button>
                    <Button variant="outline" size="sm">
                      Attach File
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {selectedTicket.status !== "resolved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-emerald-600"
                        onClick={() => handleStatusChange("resolved")}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark as Resolved
                      </Button>
                    )}
                    <Button onClick={handleSendMessage}>
                      <SendHorizonal className="mr-2 h-4 w-4" />
                      Send Response
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-180px)] flex flex-col justify-center items-center">
              <div className="text-center p-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium text-lg">
                  No conversation selected
                </h3>
                <p className="text-muted-foreground mt-2">
                  Select a ticket from the list to view customer inquiries
                </p>
                <Button variant="outline" className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Ticket
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
