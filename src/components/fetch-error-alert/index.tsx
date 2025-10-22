import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
}

const FetchErrorAlert = ({
  title,
  description,
  icon = <AlertCircle className="h-4 w-4" />,
  variant = "destructive",
}: Props) => {
  return (
    <>
      <Alert variant={variant}>
        {icon}
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </>
  );
};

export default FetchErrorAlert;
