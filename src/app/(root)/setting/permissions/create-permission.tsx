"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import permissionCreateSchema, {
  PermissionFormValues,
} from "./schema/create-permission";
import { useMessage } from "@/app/contexts/MessageContext";
import {
  useCreatePermission,
  useGetPermissionById,
  useUpdatePermission,
} from "@/api-config/queries/permission";
import Modal from "@/components/modal";
import BottomBtns from "@/components/modal_bottom_btns";
import { TextInput } from "@/components/form-inputs/text-input";
import PermissionFormSkeleton from "./components/permission-form-skeleton";
import { TextareaInput } from '@/components/form-inputs/text-area-input';
import { action } from "@/lib/constants";
import { SelectBox } from "@/components/form-inputs/select-box";

interface PermissionCreationFormProps {
  // External control props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess: () => void;
  editedDataId?: string | null;
}

const defaultValues: PermissionFormValues = {
  description: "",
  module: "",
  action: "",
};

export default function CreatePermission({
  open,
  onOpenChange,
  hideDefaultTrigger,
  onSuccess,
  editedDataId,
}: PermissionCreationFormProps) {
  const message = useMessage();
  const formId = "permission-form";

  const {
    mutateAsync: mutateAsyncCreatePermission,
    isPending: isPendingCreatePermission,
  } = useCreatePermission();
  const {
    mutateAsync: mutateAsyncUpdatePermission,
    isPending: isPendingUpdatePermission,
  } = useUpdatePermission();

  const {
    data: editedData,
    isLoading: isLoadingEditedData,
    isFetching: isFetchingEditedData,
  } = useGetPermissionById(editedDataId || null);

  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionCreateSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: PermissionFormValues) => {
    const loadingId = message.loading(
      data.id ? "Editing..." : "Creating...",
      0
    );
    const isEdit = Boolean(data.id);
    try {
      await (isEdit
        ? mutateAsyncUpdatePermission(data)
        : mutateAsyncCreatePermission(data));
      message.remove(loadingId);
      message.success(
        isEdit
          ? "Update permission successful!"
          : "Create permission successful!"
      );
      form.reset();
      onSuccess();
    } catch (error: any) {
      message.remove(loadingId);
      message.error(error?.response.data.message);
    }
  };

  useEffect(() => {
    if (editedData && !isLoadingEditedData && !isFetchingEditedData) {
      form.reset(editedData.data);
    } else if (!editedData && !isLoadingEditedData && !isFetchingEditedData) {
      form.reset(defaultValues);
    }
  }, [editedData, isLoadingEditedData, isFetchingEditedData, form]);

  return (
    <Modal
      title={`${editedDataId ? "Edit Permission" : "Create New Permission"}`}
      description={`${
        editedDataId
          ? "Edit existing permission ..."
          : "Create new permission for the admin portal"
      }`}
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Create Permission
        </Button>
      }
      width="lg"
      onClose={() => form.reset()}
      open={open}
      onOpenChange={onSuccess}
      hideDefaultTrigger={hideDefaultTrigger}
      bottomButton={
        <BottomBtns
          isPending={isPendingCreatePermission || isPendingUpdatePermission}
          formId={formId}
          form={form}
          editedData={!!editedDataId}
          cancelText="Clear All"
        />
      }
    >
      <Form {...form}>
        {isLoadingEditedData || isFetchingEditedData ? (
          <PermissionFormSkeleton />
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 py-2"
            id={formId}
          >
              <TextInput
                label="Module Name"
                name="module"
                placeholder="Enter module name"
                form={form}
                withAsterisk
              />
              <SelectBox
                label="Action"
                name="action"
                placeholder="Select action"
                control={form.control}
                withAsterisk
                options={action || []}
              />
            <TextareaInput
              label="Description"
              name="description"
              placeholder="Enter permission description (optional)"
              form={form}
            />
          </form>
        )}
      </Form>
    </Modal>
  );
}
