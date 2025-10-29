"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGetFlightBookingById } from "@/api-config/queries/flight-booking";
import { DetailsView } from "@/components/details/detail-view";
import Modal from "@/components/modal";
import { FlightBookingDetailRender } from "./components/flight-booking-detail-render";

interface FlightBookingDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess?: () => void;
  flightBookingId: string | null;
}

export default function DetailsFlightBooking({
  open,
  onOpenChange,
  hideDefaultTrigger,
  flightBookingId,
}: FlightBookingDetailsProps) {

  const {
    data: flightBooking,
    isLoading: isFlightBookingLoading,
    isError,
  } = useGetFlightBookingById(flightBookingId);

  return (
    <Modal
      title="Flight Booking Details"
      description="Details for a flight booking"
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Details Flight Booking
        </Button>
      }
      open={open}
      onOpenChange={onOpenChange}
      hideDefaultTrigger={hideDefaultTrigger}
    >
      <DetailsView
        id={flightBookingId}
        data={flightBooking?.data}
        isLoading={isFlightBookingLoading}
        isError={isError}
        render={(data) => <FlightBookingDetailRender data={data} />}
      />
    </Modal>
  );
}

