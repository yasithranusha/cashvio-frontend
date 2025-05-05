"use client";

import { useState } from "react";
import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { format } from "date-fns";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Edit, 
  MoreHorizontal, 
  PlusCircle,
  Trash2, 
  UserPlus 
} from "lucide-react";

// Define user role type
type UserRole = "CASHIER" | "MANAGER";

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  lastLogin?: Date;
};

// Form validation schema
const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.enum(["CASHIER", "MANAGER"], {
    required_error: "Please select a role.",
  }),
});

// Update the UserCreateDialog component to include role descriptions

const UserCreateDialog = ({ 
  open, 
  onOpenChange, 
  onUserCreated 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onUserCreated: (user: User) => void; 
}) => {
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CASHIER",
    },
  });

  function onSubmit(data: z.infer<typeof userFormSchema>) {
    // Create a new user with the form data
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      status: "ACTIVE",
      createdAt: new Date(),
    };

    // Pass the new user back to the parent component
    onUserCreated(newUser);
    
    // Reset the form and close the dialog
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. They will receive an email to set their password.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASHIER">Cashier</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-2">
                    {field.value === "CASHIER" ? (
                      <div className="text-xs text-muted-foreground rounded-md border px-3 py-2">
                        <strong>Cashier</strong>: Can only process orders and access the point of sale system. Cannot view inventory, cashflow, or user management.
                      </div>
                    ) : field.value === "MANAGER" ? (
                      <div className="text-xs text-muted-foreground rounded-md border px-3 py-2">
                        <strong>Manager</strong>: Full access to all features including orders, inventory management, cashflow reports, and user management.
                      </div>
                    ) : null}
                  </div>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
// Role Badge Component
const RoleBadge = ({ role }: { role: UserRole }) => {
  if (role === "MANAGER") {
    return <Badge variant="default">Manager</Badge>;
  }
  return <Badge variant="outline">Cashier</Badge>;
};

// Status Badge Component
const StatusBadge = ({ status }: { status: "ACTIVE" | "INACTIVE" }) => {
  if (status === "ACTIVE") {
    return <Badge className="bg-emerald-500">Active</Badge>;
  }
  return <Badge variant="secondary">Inactive</Badge>;
};

// Generate mock users data
const generateMockUsers = (): User[] => {
  return [
    {
      id: "user-1",
      name: "Amal Perera",
      email: "amal.perera@gmail.com",
      role: "MANAGER",
      status: "ACTIVE",
      createdAt: new Date(2024, 11, 15),
      lastLogin: new Date(2025, 4, 3, 9, 15),
    },
    {
      id: "user-2",
      name: "Kamala Fernando",
      email: "kamala.fernando@gmail.com",
      role: "CASHIER",
      status: "ACTIVE",
      createdAt: new Date(2025, 0, 10),
      lastLogin: new Date(2025, 4, 4, 8, 30),
    },
    {
      id: "user-3",
      name: "Nimal de Silva",
      email: "nimal.silva@gmail.com",
      role: "CASHIER",
      status: "ACTIVE",
      createdAt: new Date(2025, 1, 5),
      lastLogin: new Date(2025, 4, 4, 12, 45),
    },
    {
      id: "user-4",
      name: "Sunil Bandara",
      email: "sunil.bandara@gmail.com",
      role: "MANAGER",
      status: "INACTIVE",
      createdAt: new Date(2024, 9, 20),
      lastLogin: new Date(2025, 3, 10, 15, 20),
    },
    {
      id: "user-5",
      name: "Lakshmi Jayawardena",
      email: "lakshmi.j@gmail.com",
      role: "CASHIER",
      status: "ACTIVE",
      createdAt: new Date(2025, 2, 20),
      lastLogin: new Date(2025, 4, 4, 10, 10),
    },
  ];
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(generateMockUsers);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleUserCreated = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  const handleUserStatusChange = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
          : user
      )
    );
  };

  const handleUserDelete = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => format(row.original.createdAt, "MMM dd, yyyy"),
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => 
        row.original.lastLogin 
          ? format(row.original.lastLogin, "MMM dd, yyyy h:mm a")
          : "Never",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUserStatusChange(row.original.id)}
              >
                {row.original.status === "ACTIVE" ? (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deactivate User
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Activate User
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleUserDelete(row.original.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const roleFilterOptions = [
    {
      label: "Cashier",
      value: "CASHIER",
    },
    {
      label: "Manager",
      value: "MANAGER",
    },
  ];

  const statusFilterOptions = [
    {
      label: "Active",
      value: "ACTIVE",
    },
    {
      label: "Inactive",
      value: "INACTIVE",
    },
  ];

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={users}
          searchColumn={["name", "email"]}
          searchPlaceholder="Search users..."
          filters={[
            {
              filterKey: "role",
              title: "Role",
              options: roleFilterOptions,
            },
            {
              filterKey: "status",
              title: "Status",
              options: statusFilterOptions,
            },
          ]}
        />

        <UserCreateDialog 
          open={createDialogOpen} 
          onOpenChange={setCreateDialogOpen}
          onUserCreated={handleUserCreated}
        />
      </div>
    </div>
  );
}