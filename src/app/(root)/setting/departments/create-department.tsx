"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import departmentCreateSchema, {
  DepartmentFormValues,
} from "./schema/create-department";
import { useMessage } from "@/app/contexts/MessageContext";
import {
  useCreateDepartment,
  useGetDepartmentById,
  useUpdateDepartment,
} from "@/api-config/queries/department";
import Modal from "@/components/modal";
import BottomBtns from "@/components/modal_bottom_btns";
import { TextInput } from "@/components/form-inputs/text-input";
import DepartmentFormSkeleton from "./components/department-form-skeleton";

interface DepartmentCreationFormProps {
  // External control props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess: () => void;
  editedDataId?: string | null;
}

const defaultValues: DepartmentFormValues = {
  department_name: "",
  department_code: "",
};

export default function CreateDepartment({
  open,
  onOpenChange,
  hideDefaultTrigger,
  onSuccess,
  editedDataId,
}: DepartmentCreationFormProps) {
  const message = useMessage();
  const formId = "department-form";

  const {
    mutateAsync: mutateAsyncCreateDepartment,
    isPending: isPendingCreateDepartment,
  } = useCreateDepartment();
  const {
    mutateAsync: mutateAsyncUpdateDepartment,
    isPending: isPendingUpdateDepartment,
  } = useUpdateDepartment();

  const {
    data: editedData,
    isLoading: isLoadingEditedData,
    isFetching: isFetchingEditedData,
  } = useGetDepartmentById(editedDataId || null);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentCreateSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: DepartmentFormValues) => {
    const loadingId = message.loading(
      data.id ? "Editing..." : "Creating...",
      0
    );
    const isEdit = Boolean(data.id);
    try {
      await (isEdit
        ? mutateAsyncUpdateDepartment(data)
        : mutateAsyncCreateDepartment(data));
      message.remove(loadingId);
      message.success(
        isEdit
          ? "Update department successful!"
          : "Create department successful!"
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
      title={`${editedDataId ? "Edit Department" : "Create New Department"}`}
      description={`${
        editedDataId
          ? "Edit existing department ..."
          : "Create new department for the admin portal"
      }`}
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Create Department
        </Button>
      }
      width="lg"
      onClose={() => form.reset()}
      open={open}
      onOpenChange={onSuccess}
      hideDefaultTrigger={hideDefaultTrigger}
      bottomButton={
        <BottomBtns
          isPending={isPendingCreateDepartment || isPendingUpdateDepartment}
          formId={formId}
          form={form}
          editedData={!!editedDataId}
          cancelText="Clear All"
        />
      }
    >
      <Form {...form}>
        {isLoadingEditedData || isFetchingEditedData ? (
          <DepartmentFormSkeleton />
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 py-2"
            id={formId}
          >
            <TextInput
              label="Department Code"
              name="department_code"
              placeholder="Enter department code"
              form={form}
              withAsterisk
            />
            <TextInput
              label="Department Name"
              name="department_name"
              placeholder="Enter department name"
              form={form}
              withAsterisk
            />
          </form>
        )}
      </Form>
    </Modal>
  );
}
