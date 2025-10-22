"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Eye, EyeOff, Mail, PlusCircle, Lock } from "lucide-react";
import userCreateSchema, {
  UserFormUnionValues,
  UserFormValues,
} from "./schema/create-user";
import { useEffect, useState } from "react";
import { useGetAllCommonDepartmentList } from "@/api-config/queries/department";
import { useGetAllCommonRoleList } from "@/api-config/queries/role";
import {
  useCreateUser,
  useGetUserById,
  useUpdateUser,
} from "@/api-config/queries/user";
import { useMessage } from "@/app/contexts/MessageContext";
import { UserEditFormValues, userEditSchema } from "./schema/edit-user";
import Modal from "@/components/modal";
import BottomBtns from "@/components/modal_bottom_btns";
import { TextInput } from "@/components/form-inputs/text-input";
import { SelectBox } from "@/components/form-inputs/select-box";
import { UserTypeOptions } from "@/lib/constants";
import UserFormSkeleton from "./components/user-form-skeleton";

interface UserCreationFormProps {
  // External control props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess: () => void;
  editedDataId?: string | null;
}

const defaultValues: UserFormValues = {
  email: "",
  staff_id: "",
  full_name: "",
  password: "",
  confirm_password: "",
  department_code: "",
  role_code: "",
  user_type: "",
};
const defaultEditValues: UserEditFormValues = {
  email: "",
  staff_id: "",
  full_name: "",
  password: "",
  confirm_password: "",
  department_code: "",
  role_code: "",
  user_type: "",
};

export default function CreateUser({
  open,
  onOpenChange,
  hideDefaultTrigger,
  onSuccess,
  editedDataId,
}: UserCreationFormProps) {
  const message = useMessage();
  const formId = "user-form";
  //state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //queries
  const {
    data: commonDepartmentList,
    isLoading: isLoadingCommonDepartmentList,
  } = useGetAllCommonDepartmentList();
  const { data: commonRoleList, isLoading: isLoadingCommonRoleList } =
    useGetAllCommonRoleList();
  const { mutateAsync: mutateAsyncCreateUser, isPending: isPendingCreateUser } =
    useCreateUser();
  const { mutateAsync: mutateAsyncUpdateUser, isPending: isPendingUpdateUser } =
    useUpdateUser();

  const {
    data: editedData,
    isLoading: isLoadingEditedData,
    isFetching: isFetchingEditedData,
  } = useGetUserById(editedDataId || null);

  const currentSchema = editedDataId ? userEditSchema : userCreateSchema;

  const form = useForm<UserFormUnionValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: editedDataId ? defaultEditValues : defaultValues,
  });

  // Handle form submission
  const onSubmitCreateUser = async (data: UserFormUnionValues) => {
    const loadingId = message.loading(
      data.id ? "Editing..." : "Registering...",
      0
    );
    const isEdit = Boolean(data.id);
    try {
      await (isEdit
        ? mutateAsyncUpdateUser(data)
        : mutateAsyncCreateUser({
            ...data,
            password: data.password || "",
            confirm_password: data.confirm_password || "",
          }));
      message.remove(loadingId);
      message.success(
        isEdit ? "Update user successful!" : "Create user successful!"
      );
      form.reset();
      onSuccess();
    } catch (error: any) {
      message.remove(loadingId);
      message.error(error?.response.data.message);
    }
  };

  const departmentOptions = commonDepartmentList?.data.map((dept) => ({
    value: dept.department_code,
    label: dept.department_name,
  }));
  const roleOptions = commonRoleList?.data.map((role) => ({
    value: role.role_code,
    label: role.role_name,
  }));

  useEffect(() => {
    if (editedData && !isLoadingEditedData && !isFetchingEditedData) {
      form.reset({
        ...editedData.data,
        department_code: editedData.data.department.department_code,
        role_code: editedData.data.role.role_code,
      });
    } else if (!editedData && !isLoadingEditedData && !isFetchingEditedData) {
      form.reset(defaultValues);
    }
  }, [editedData, isLoadingEditedData, isFetchingEditedData, form]);

  return (
    <Modal
      title={`${editedDataId  ? "Edit User" : "New User Registration"}`}
      description={`${
        editedDataId
          ? "Edit existing user ..."
          : "Create new user for the telco admin portal"
      }`}
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Create User
        </Button>
      }
      width="lg"
      onClose={() => form.reset()}
      open={open}
      onOpenChange={onSuccess}
      hideDefaultTrigger={hideDefaultTrigger}
      bottomButton={
        <BottomBtns
          isPending={isPendingCreateUser || isPendingUpdateUser}
          formId={formId}
          form={form}
          editedData={!!editedDataId}
          handleReset={onSuccess}
          resetText="Cancel"
        />
      }
    >
      <Form {...form}>
        {isLoadingEditedData || isFetchingEditedData || isLoadingCommonDepartmentList || isLoadingCommonRoleList ? (
          <UserFormSkeleton />
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmitCreateUser)}
            className="space-y-3 py-2"
            id={formId}
          >
            <TextInput
              label="Email"
              name="email"
              placeholder="mgmg@gmail.com"
              form={form}
              icon={<Mail className="h-4 w-4" />}
              withAsterisk
            />

            <TextInput
              label="Staff-ID"
              name="staff_id"
              placeholder="Enter user staff-Id"
              form={form}
              withAsterisk
            />

            <TextInput
              label="Full Name"
              name="full_name"
              placeholder="Enter user name"
              form={form}
              withAsterisk
            />

            <SelectBox
              control={form.control}
              name="user_type"
              label="Type"
              options={UserTypeOptions || []}
              searchable={true}
              placeholder="Select User Type"
              emptyMessage="No user type found"
              withAsterisk
            />

            <SelectBox
              control={form.control}
              name="department_code"
              label="Department"
              options={departmentOptions || []}
              searchable={true}
              placeholder="Select department"
              emptyMessage="No departments found"
              withAsterisk
            />

            <SelectBox
              control={form.control}
              name="role_code"
              label="Role"
              options={roleOptions || []}
              searchable={true}
              placeholder="Select role"
              emptyMessage="No Roles found"
              withAsterisk
            />

            <TextInput
              label="Password"
              name="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              form={form}
              icon={<Lock className="h-4 w-4" />}
              rightBtn={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              }
              withAsterisk
            />

            <TextInput
              label="Confirm Password"
              name="confirm_password"
              placeholder="••••••••"
              type={showConfirmPassword ? "text" : "password"}
              form={form}
              icon={<Lock className="h-4 w-4" />}
              rightBtn={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className=" text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"}
                  </span>
                </Button>
              }
              withAsterisk
            />
          </form>
        )}
      </Form>
    </Modal>
  );
}
