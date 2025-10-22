"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGetUserById } from "@/api-config/queries/user";
import { useMessage } from "@/app/contexts/MessageContext";
import { DetailsView } from "@/components/details/detail-view";
import { UserDetailsRenderer } from "./components/user-detail-render";
import Modal from "@/components/modal";

interface UserDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess?: () => void;
  userId: string | null;
}

export default function DetailsUser({
  open,
  onOpenChange,
  hideDefaultTrigger,
  onSuccess,
  userId,
}: UserDetailsProps) {
  const message = useMessage();

  const {
    data: user,
    isLoading: isUserLoading,
    isError,
  } = useGetUserById(userId);

  return (
    <Modal
      title="User Details"
      description="Details for a user"
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Details User
        </Button>
      }
      open={open}
      onOpenChange={onOpenChange}
      hideDefaultTrigger={hideDefaultTrigger}
    >
      <DetailsView
        id={userId}
        data={user?.data}
        isLoading={isUserLoading}
        isError={isError}
        render={(data) => <UserDetailsRenderer data={data} />}
      />
    </Modal>
  );
}
