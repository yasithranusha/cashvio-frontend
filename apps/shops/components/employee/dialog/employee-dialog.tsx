"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import EmployeeForm from "@/components/employee/dialog/employee-form";
import { TEmployee } from "@/types/employee";
import { Plus, X, AlertTriangle } from "lucide-react";

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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const open = setOpen ? undefined : localOpen;
  const handleOpenChange = setOpen || setLocalOpen;

  // Reset unsaved changes state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setHasUnsavedChanges(false);
    }
  }, [open]);

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges) {
      setShowConfirmClose(true);
    } else {
      handleOpenChange(false);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmClose(false);
    setHasUnsavedChanges(false);
    handleOpenChange(false);
  };

  const handleFormSuccess = () => {
    setHasUnsavedChanges(false);
    handleOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {!setOpen && (
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              {employee ? "Edit Employee" : "Add Employee"}
            </Button>
          </DialogTrigger>
        )}
        <DialogContent
          className="sm:max-w-[700px] max-h-[95vh] overflow-hidden flex flex-col"
          onEscapeKeyDown={handleCloseAttempt}
          onPointerDownOutside={handleCloseAttempt}
        >
          <DialogHeader className="flex-shrink-0 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {employee ? `Edit Employee` : "Add New Employee"}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {employee
                    ? `Update ${employee.firstName} ${employee.lastName}'s information`
                    : "Create a new employee profile with their details"}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseAttempt}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1">
            {employee ? (
              <EmployeeForm
                initialData={employee}
                onSuccess={handleFormSuccess}
                shopId={shopId}
                onChange={() => setHasUnsavedChanges(true)}
              />
            ) : (
              <EmployeeForm
                onSuccess={handleFormSuccess}
                shopId={shopId}
                onChange={() => setHasUnsavedChanges(true)}
              />
            )}
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t bg-muted/30 -mx-6 -mb-6 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-muted-foreground">
                {hasUnsavedChanges && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    You have unsaved changes
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCloseAttempt}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for unsaved changes */}
      <AlertDialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Unsaved Changes
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you close this
              dialog. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmClose(false)}>
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClose}
              className="bg-destructive hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
