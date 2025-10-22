"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGetPermissionById } from "@/api-config/queries/permission";
import { DetailsView } from "@/components/details/detail-view";
import Modal from "@/components/modal";
import { PermissionDetailsRender } from "./components/permission-detail-render";

interface PermissionDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess?: () => void;
  permissionId: string | null;
}

export default function DetailsPermission({
  open,
  onOpenChange,
  hideDefaultTrigger,
  onSuccess,
  permissionId,
}: PermissionDetailsProps) {
  const {
    data: permission,
    isLoading: isPermissionLoading,
    isError,
  } = useGetPermissionById(permissionId);

  return (
    <Modal
      title="Permission Details"
      description="Details for a permission"
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Details Permission
        </Button>
      }
      open={open}
      onOpenChange={onOpenChange}
      hideDefaultTrigger={hideDefaultTrigger}
    >
      <DetailsView
        id={permissionId}
        data={permission?.data}
        isLoading={isPermissionLoading}
        isError={isError}
        render={(data) => <PermissionDetailsRender data={data} />}
      />
    </Modal>
  );
}
