"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGetDepartmentById } from "@/api-config/queries/department";
import { DetailsView } from "@/components/details/detail-view";
import { DepartmentDetailsRender } from "./components/department-detail-render";
import Modal from "@/components/modal";

interface DepartmentDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess?: () => void;
  departmentId: string | null;
}

export default function DetailsDepartment({
  open,
  onOpenChange,
  hideDefaultTrigger,
  onSuccess,
  departmentId,
}: DepartmentDetailsProps) {
  const {
    data: department,
    isLoading: isDepartmentLoading,
    isError,
  } = useGetDepartmentById(departmentId);

  return (
    <Modal
      title="Department Details"
      description="Details for a department"
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Details Department
        </Button>
      }
      open={open}
      onOpenChange={onOpenChange}
      hideDefaultTrigger={hideDefaultTrigger}
    >
      <DetailsView
        id={departmentId}
        data={department?.data}
        isLoading={isDepartmentLoading}
        isError={isError}
        render={(data) => <DepartmentDetailsRender data={data} />}
      />
    </Modal>
  );
}
