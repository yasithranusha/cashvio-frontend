"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { TEmployee } from "@/types/employee";
import EmployeeForm from "@/components/employee/dialog/employee-form";
import EmployeeDeleteDialog from "@/components/employee/dialog/employee-delete";
import { AlertDialog } from "@workspace/ui/components/alert-dialog";
import { toggleEmployeeStatus } from "@/actions/employee";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/hooks/use-toast";

export default function EmployeeActions({ employee }: { employee: TEmployee }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const router = useRouter();

  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      const result = await toggleEmployeeStatus(
        employee.id,
        !employee.isActive
      );
      if (result.success) {
        toast({
          title: "Success",
          description: `Employee ${employee.isActive ? "deactivated" : "activated"} successfully`,
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update employee status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(employee.id)}
          >
            Copy employee ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsUpdateOpen(true);
              setIsDropdownOpen(false);
            }}
          >
            Edit employee
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleToggleStatus}
            disabled={isToggling}
            className="flex items-center gap-2"
          >
            {employee.isActive ? (
              <>
                <UserX className="h-4 w-4" />
                Deactivate employee
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                Activate employee
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsDeleteOpen(true);
              setIsDropdownOpen(false);
            }}
            className="text-destructive hover:text-destructive"
          >
            Delete employee
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Update Employee {employee.firstName} {employee.lastName}
            </DialogTitle>
            <DialogDescription>
              Update {employee.firstName} {employee.lastName}'s details
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            initialData={employee}
            onSuccess={() => setIsUpdateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <EmployeeDeleteDialog
          employee={employee}
          onSuccess={() => setIsDeleteOpen(false)}
        />
      </AlertDialog>
    </>
  );
}
