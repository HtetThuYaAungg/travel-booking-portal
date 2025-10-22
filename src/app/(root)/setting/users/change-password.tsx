"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, PlusCircle, Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

import { useMessage } from "@/app/contexts/MessageContext";
import Modal from "@/components/modal";
import BottomBtns from "@/components/modal_bottom_btns";
import { useForgetPassword } from "@/api-config/queries/user";
import changePasswordSchema, {
  ChangePasswordFormValues,
} from "./schema/change-password";
import { TextInput } from "@/components/form-inputs/text-input";
import { useState } from "react";

interface ChangePasswordFormProps {
  // External control props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess?: () => void;
}

export default function ChangePassword({
  open,
  onOpenChange,
  hideDefaultTrigger,
  onSuccess,
}: ChangePasswordFormProps) {
  const formId = "forget-password-form";
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const message = useMessage();

  const defaultValues: ChangePasswordFormValues = {
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  };

  const {
    mutateAsync: mutateAsyncForgetPassword,
    isPending: isPendingForgetPassword,
  } = useForgetPassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: defaultValues,
  });

  const handleClose = async () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const loadingId = message.loading("Reseting ...", 0);
    try {
      await mutateAsyncForgetPassword(data);
      message.remove(loadingId);
      message.success("Success reset password!");
      handleClose();
      form.reset();
    } catch (error: any) {
      message.remove(loadingId);
      message.error(error?.response.data.message);
    }
  };

  return (
    <Modal
      title={"Change Password"}
      description={"Create new password."}
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Change Password
        </Button>
      }
      width="lg"
      onClose={() => form.reset()}
      open={open}
      onOpenChange={onOpenChange}
      hideDefaultTrigger={hideDefaultTrigger}
      bottomButton={
        <BottomBtns
          isPending={isPendingForgetPassword}
          formId={formId}
          form={form}
        />
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id={formId}
          className="space-y-3 py-2"
        >
          <TextInput
            label="Current Password"
            name="current_password"
            placeholder="••••••••"
            type={showOldPassword ? "text" : "password"}
            form={form}
            icon={<Lock className="h-4 w-4" />}
            rightBtn={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowOldPassword(!showOldPassword)}
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showNewPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            }
            withAsterisk
          />

          <TextInput
            label="New Password"
            name="new_password"
            placeholder="••••••••"
            type={showNewPassword ? "text" : "password"}
            form={form}
            icon={<Lock className="h-4 w-4" />}
            rightBtn={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showNewPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            }
            withAsterisk
          />

          <TextInput
            label="Confirm Password"
            name="confirm_new_password"
            placeholder="••••••••"
            type={showConfirmedPassword ? "text" : "password"}
            form={form}
            icon={<Lock className="h-4 w-4" />}
            rightBtn={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className=" text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
                tabIndex={-1}
              >
                {showConfirmedPassword ? (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {showConfirmedPassword
                    ? "Hide confirm password"
                    : "Show confirm password"}
                </span>
              </Button>
            }
            withAsterisk
          />
        </form>
      </Form>
    </Modal>
  );
}
