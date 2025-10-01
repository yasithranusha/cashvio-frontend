"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useState, Dispatch, SetStateAction } from "react";
import EmployeeForm from "@/components/employee/dialog/employee-form";
import { TEmployee } from "@/types/employee";
import { Plus } from "lucide-react";

interface EmployeeDialogProps {
  employee?: TEmployee;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  shopId?: string;
}

export function EmployeeDialog({
  employee,
  setOpen,
  shopId,
}: EmployeeDialogProps) {
  const [localOpen, setLocalOpen] = useState(false);

  const open = setOpen ? undefined : localOpen;
  const handleOpenChange = setOpen || setLocalOpen;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!setOpen && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {employee ? "Edit Employee" : "Add Employee"}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employee
              ? `Update Employee ${employee.firstName} ${employee.lastName}`
              : "Add Employee"}
          </DialogTitle>
          <DialogDescription>
            {employee
              ? `Update ${employee.firstName} ${employee.lastName}'s details`
              : "Fill in the details to add a new employee"}
          </DialogDescription>
        </DialogHeader>
        {employee ? (
          <EmployeeForm
            initialData={employee}
            onSuccess={() => handleOpenChange(false)}
            shopId={shopId}
          />
        ) : (
          <EmployeeForm
            onSuccess={() => handleOpenChange(false)}
            shopId={shopId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
