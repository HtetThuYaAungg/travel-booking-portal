"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGetHotelBookingById } from "@/api-config/queries/hotel-booking";
import { DetailsView } from "@/components/details/detail-view";
import Modal from "@/components/modal";
import { HotelBookingDetailRender } from "./components/hotel-booking-detail-render";

interface HotelBookingDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess?: () => void;
  hotelBookingId: string | null;
}

export default function DetailsHotelBooking({
  open,
  onOpenChange,
  hideDefaultTrigger,
  hotelBookingId,
}: HotelBookingDetailsProps) {

  const {
    data: hotelBooking,
    isLoading: isHotelBookingLoading,
    isError,
  } = useGetHotelBookingById(hotelBookingId);

  return (
    <Modal
      title="Hotel Booking Details"
      description="Details for a hotel booking"
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Details Hotel Booking
        </Button>
      }
      open={open}
      onOpenChange={onOpenChange}
      hideDefaultTrigger={hideDefaultTrigger}
    >
      <DetailsView
        id={hotelBookingId}
        data={hotelBooking?.data}
        isLoading={isHotelBookingLoading}
        isError={isError}
        render={(data) => <HotelBookingDetailRender data={data} />}
      />
    </Modal>
  );
}
