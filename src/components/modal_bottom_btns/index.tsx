import {
  Loader,
  PlusCircle,
  SquarePen,
} from "lucide-react";
import { Button } from "../ui/button";
import { UseFormReturn } from "react-hook-form";

interface BottomBtnsProps {
  formId: string;
  editedData?: boolean;
  isPending?: boolean;
  form: UseFormReturn<any>;
  handleReset?: () => void;
  isDisabled?: boolean;
  confirmText?: string;
  cancelText?: string;
  resetText?: string;
}

const BottomBtns = ({
  editedData,
  isPending,
  isDisabled,
  formId,
  form,
  handleReset,
  confirmText,
  cancelText = "Cancel",
  resetText = "Reset",
}: BottomBtnsProps) => {
  return (
    <div className="flex w-full items-center justify-end space-x-2">
      <Button
        type="button"
        onClick={handleReset ? handleReset : () => form.reset()}
        variant={"outline"}
      >
        {editedData ? resetText : cancelText}
      </Button>
      <Button
        type="submit"
        size={"sm"}
        form={formId}
        disabled={isPending || isDisabled}
      >
        {isPending ? (
          <Loader className="animate-spin"/>
        ) : (
          <>
            {editedData ? (
              <SquarePen />
            ) : (
              <PlusCircle />
            )}
          </>
        )}
        {confirmText ||
          (editedData ? "Update" : "Create")}
      </Button>
    </div>
  );
};

export default BottomBtns;
