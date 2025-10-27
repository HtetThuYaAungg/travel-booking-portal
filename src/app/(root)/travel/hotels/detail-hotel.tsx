"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGetHotelById } from "@/api-config/queries/hotel";
import { useMessage } from "@/app/contexts/MessageContext";
import { DetailsView } from "@/components/details/detail-view";
import { HotelDetailRender } from "./components/hotel-detail-render";
import Modal from "@/components/modal";

interface HotelDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess?: () => void;
  hotelId: string | null;
}

export default function DetailsHotel({
  open,
  onOpenChange,
  hideDefaultTrigger,
  onSuccess,
  hotelId,
}: HotelDetailsProps) {
  const message = useMessage();

  const {
    data: hotel,
    isLoading: isHotelLoading,
    isError,
  } = useGetHotelById(hotelId);

  return (
    <Modal
      title="Hotel Details"
      description="Details for a hotel"
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Details Hotel
        </Button>
      }
      open={open}
      onOpenChange={onOpenChange}
      hideDefaultTrigger={hideDefaultTrigger}
    >
      <DetailsView
        id={hotelId}
        data={hotel?.data}
        isLoading={isHotelLoading}
        isError={isError}
        render={(data) => <HotelDetailRender data={data} />}
      />
    </Modal>
  );
}
