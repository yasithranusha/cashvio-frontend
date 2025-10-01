"use client";

import { TEmployee } from "@/types/employee";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@workspace/ui/components/alert-dialog";
import { deleteEmployee } from "@/actions/employee";
import { toast } from "sonner";
import { useTransition } from "react";

interface DeleteConfirmProps {
  employee: TEmployee;
  onSuccess: () => void;
}

export default function EmployeeDeleteDialog({
  employee,
  onSuccess,
}: DeleteConfirmProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const result = await deleteEmployee(employee.id);

            if (result.success) {
              resolve(result);
              onSuccess();
            } else {
              reject(new Error(result.error || "Failed to delete employee"));
            }
          } catch (error) {
            reject(
              error instanceof Error
                ? error
                : new Error("Failed to delete employee")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: "Deleting employee...",
      success: "Employee deleted successfully",
      error: (err) => `${err.message}`,
    });
  };

  // Add null check to prevent the error
  if (!employee) {
    return null;
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the
          employee{" "}
          <span className="font-bold">
            {employee.firstName} {employee.lastName}
          </span>{" "}
          with email address <span className="font-bold">{employee.email}</span>
          . All associated records and access will be removed.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onSuccess}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          disabled={isPending}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Delete Employee
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
