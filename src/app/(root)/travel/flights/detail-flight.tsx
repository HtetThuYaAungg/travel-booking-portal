"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGetFlightById } from "@/api-config/queries/flight";
import { useMessage } from "@/app/contexts/MessageContext";
import { DetailsView } from "@/components/details/detail-view";
import { FlightDetailRender } from "./components/flight-detail-render";
import Modal from "@/components/modal";

interface FlightDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess?: () => void;
  flightId: string | null;
}

export default function DetailsFlight({
  open,
  onOpenChange,
  hideDefaultTrigger,
  onSuccess,
  flightId,
}: FlightDetailsProps) {
  const message = useMessage();

  const {
    data: flight,
    isLoading: isFlightLoading,
    isError,
  } = useGetFlightById(flightId);

  return (
    <Modal
      title="Flight Details"
      description="Details for a flight"
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Details Flight
        </Button>
      }
      open={open}
      onOpenChange={onOpenChange}
      hideDefaultTrigger={hideDefaultTrigger}
    >
      <DetailsView
        id={flightId}
        data={flight?.data}
        isLoading={isFlightLoading}
        isError={isError}
        render={(data) => <FlightDetailRender data={data} />}
      />
    </Modal>
  );
}

