"use client";
import LoadingSwap from "@/components/LoadingSwap";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import React, { ComponentPropsWithRef, useTransition } from "react";
import { toast } from "sonner";

export default function ActionButton({
  action,
  requireAreYouSure = false,
  areYouSureDescription = "This action cannot be undone",
  ...props
}: Omit<ComponentPropsWithRef<typeof Button>, "onClick"> & {
  action: () => Promise<{ error: boolean; message?: string }>;
  requireAreYouSure?: boolean;
  areYouSureDescription?: string;
}) {
  const [isLoading, startTransaction] = useTransition();

  function performAction() {
    startTransaction(async () => {
      const data = await action();
      if (data.error) {
        toast.error(data.message ?? "Error");
      }
    });
  }
  if (requireAreYouSure) {
    return (
      <AlertDialog open={isLoading ? true : undefined}>
        <AlertDialogTrigger asChild>
          <Button {...props}></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure</AlertDialogTitle>
            <AlertDialogDescription>
              {areYouSureDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <DialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={performAction}>
              <LoadingSwap isLoading={isLoading}>Yes</LoadingSwap>
            </AlertDialogAction>
          </DialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <Button {...props} disabled={isLoading} onClick={performAction}>
      <LoadingSwap
        isLoading={isLoading}
        className="inline-flex items-center gap-2"
      >
        {props.children}
      </LoadingSwap>
    </Button>
  );
}
