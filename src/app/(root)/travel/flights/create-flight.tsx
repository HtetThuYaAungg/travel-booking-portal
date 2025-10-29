"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PlusCircle } from "lucide-react";

import { useMessage } from "@/app/contexts/MessageContext";
import Modal from "@/components/modal";
import BottomBtns from "@/components/modal_bottom_btns";
import { TextInput } from "@/components/form-inputs/text-input";
import { SelectBox } from "@/components/form-inputs/select-box";
import flightCreateSchema, { FlightFormValues } from "./schema/create-flight";
import { useGetFlightById } from "@/api-config/queries/flight";
import { useCreateFlight } from "@/api-config/queries/flight";
import { useUpdateFlight } from "@/api-config/queries/flight";
import { NumberInput } from "@/components/form-inputs/number-input";
import { CheckBox } from "@/components/form-inputs/check-box";
import { useEffect } from "react";

interface FlightCreationFormProps {
  // External control props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
  onSuccess: () => void;
  editedDataId?: string | null;
}

const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "JPY", label: "JPY" },
  { value: "CAD", label: "CAD" },
  { value: "AUD", label: "AUD" },
];

const classTypeOptions = [
  { value: "Economy", label: "Economy" },
  { value: "Business", label: "Business" },
  { value: "First", label: "First" },
  { value: "Premium Economy", label: "Premium Economy" },
];

const defaultValues: FlightFormValues = {
  flight_number: "",
  airline_name: "",
  airline_code: "",
  aircraft_type: "",
  departure_airport_code: "",
  departure_airport_name: "",
  departure_city: "",
  departure_country: "",
  arrival_airport_code: "",
  arrival_airport_name: "",
  arrival_city: "",
  arrival_country: "",
  departure_time: "",
  arrival_time: "",
  duration_minutes: 0,
  base_price: 0,
  currency: "USD",
  available_seats: 0,
  total_seats: 100,
  class_type: "Economy",
  has_wifi: false,
  has_meal: false,
  has_entertainment: false,
  has_luggage: true,
  is_domestic: true,
};

export default function CreateFlight({
  open,
  onOpenChange,
  hideDefaultTrigger,
  onSuccess,
  editedDataId,
}: FlightCreationFormProps) {
  const message = useMessage();
  const formId = "flight-form";

  const {
    data: editedData,
    isLoading: isLoadingEditedData,
    isFetching: isFetchingEditedData,
  } = useGetFlightById(editedDataId || null);

  const {
    mutateAsync: mutateAsyncCreateFlight,
    isPending: isPendingCreateFlight,
  } = useCreateFlight();
  const {
    mutateAsync: mutateAsyncUpdateFlight,
    isPending: isPendingUpdateFlight,
  } = useUpdateFlight();

  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightCreateSchema),
    defaultValues: defaultValues,
  });

  // Handle form submission
  const onSubmitCreateFlight = async (data: FlightFormValues) => {
    const loadingId = message.loading(
      data.id ? "Editing..." : "Registering...",
      0
    );
    const isEdit = Boolean(data.id);
    
    // Transform datetime-local format back to ISO string for API
    const transformDateTimeForAPI = (dateTimeString: string) => {
      if (!dateTimeString) return "";
      // Convert from YYYY-MM-DDTHH:MM to ISO string
      const date = new Date(dateTimeString);
      return date.toISOString();
    };

    try {
      const transformedData = {
        ...data,
        departure_time: transformDateTimeForAPI(data.departure_time),
        arrival_time: transformDateTimeForAPI(data.arrival_time),
      };

      await (isEdit
        ? mutateAsyncUpdateFlight(transformedData)
        : mutateAsyncCreateFlight(transformedData));
      message.remove(loadingId);
      message.success(
        isEdit ? "Update flight successful!" : "Create flight successful!"
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
      // Transform datetime fields to the format expected by datetime-local input
      const formatDateTimeForInput = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        // Format as YYYY-MM-DDTHH:MM for datetime-local input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      form.reset({
        ...editedData.data,
        departure_time: formatDateTimeForInput(editedData.data.departure_time),
        arrival_time: formatDateTimeForInput(editedData.data.arrival_time),
      });
    } else if (!editedData && !isLoadingEditedData && !isFetchingEditedData) {
      form.reset(defaultValues);
    }
  }, [editedData, isLoadingEditedData, isFetchingEditedData, form]);

  console.log(form.formState.errors);

  return (
    <Modal
      title={`${editedDataId ? "Edit Flight" : "New Flight Registration"}`}
      description={`${
        editedDataId
          ? "Edit existing flight ..."
          : "Create new flight for the travel booking portal"
      }`}
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Create Flight
        </Button>
      }
      width="4xl"
      onClose={() => form.reset()}
      open={open}
      onOpenChange={onSuccess}
      hideDefaultTrigger={hideDefaultTrigger}
      bottomButton={
        <BottomBtns
          isPending={isPendingCreateFlight || isPendingUpdateFlight}
          formId={formId}
          form={form}
          editedData={!!editedDataId}
          handleReset={() => form.reset()}
          resetText="Cancel"
        />
      }
    >
      <Form {...form}>
        {isLoadingEditedData ||
        isFetchingEditedData ||
        isPendingCreateFlight ||
        isPendingUpdateFlight ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmitCreateFlight)}
            className="space-y-3 py-2"
            id={formId}
          >
            {/* Basic Flight Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Basic Flight Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  form={form}
                  name="flight_number"
                  label="Flight Number"
                  placeholder="Enter flight number"
                />
                <TextInput
                  form={form}
                  name="airline_name"
                  label="Airline Name"
                  placeholder="Enter airline name"
                />
                <TextInput
                  form={form}
                  name="airline_code"
                  label="Airline Code"
                  placeholder="Enter airline code"
                />
                <TextInput
                  form={form}
                  name="aircraft_type"
                  label="Aircraft Type"
                  placeholder="Enter aircraft type"
                />
                <SelectBox
                  control={form.control}
                  name="class_type"
                  label="Class Type"
                  options={classTypeOptions}
                  placeholder="Select class type"
                />
                <SelectBox
                  control={form.control}
                  name="currency"
                  label="Currency"
                  options={currencyOptions}
                  placeholder="Select currency"
                />
              </div>
            </div>

            {/* Departure Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Departure Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  form={form}
                  name="departure_airport_code"
                  label="Departure Airport Code"
                  placeholder="Enter departure airport code"
                />
                <TextInput
                  form={form}
                  name="departure_airport_name"
                  label="Departure Airport Name"
                  placeholder="Enter departure airport name"
                />
                <TextInput
                  form={form}
                  name="departure_city"
                  label="Departure City"
                  placeholder="Enter departure city"
                />
                <TextInput
                  form={form}
                  name="departure_country"
                  label="Departure Country"
                  placeholder="Enter departure country"
                />
                <TextInput
                  form={form}
                  name="departure_time"
                  label="Departure Time"
                  type="datetime-local"
                />
              </div>
            </div>

            {/* Arrival Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Arrival Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  form={form}
                  name="arrival_airport_code"
                  label="Arrival Airport Code"
                  placeholder="Enter arrival airport code"
                />
                <TextInput
                  form={form}
                  name="arrival_airport_name"
                  label="Arrival Airport Name"
                  placeholder="Enter arrival airport name"
                />
                <TextInput
                  form={form}
                  name="arrival_city"
                  label="Arrival City"
                  placeholder="Enter arrival city"
                />
                <TextInput
                  form={form}
                  name="arrival_country"
                  label="Arrival Country"
                  placeholder="Enter arrival country"
                />
                <TextInput
                  form={form}
                  name="arrival_time"
                  label="Arrival Time"
                  type="datetime-local"
                />
              </div>
            </div>

            {/* Flight Details */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Flight Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberInput
                  form={form}
                  name="duration_minutes"
                  label="Duration (minutes)"
                  min={1}
                />
                <NumberInput
                  form={form}
                  name="base_price"
                  label="Base Price"
                  min={0}
                />
                <NumberInput
                  form={form}
                  name="available_seats"
                  label="Available Seats"
                  min={0}
                />
                <NumberInput
                  form={form}
                  name="total_seats"
                  label="Total Seats"
                  min={1}
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-4">
                <CheckBox
                  form={form}
                  name="has_wifi"
                  label="WiFi"
                  labelSpan={3}
                  inputSpan={2}
                  mainSpan={5}
                />
                <CheckBox
                  form={form}
                  name="has_meal"
                  label="Meal"
                  labelSpan={3}
                  inputSpan={2}
                  mainSpan={5}
                />
                <CheckBox
                  form={form}
                  name="has_entertainment"
                  label="Entertainment"
                  labelSpan={3}
                  inputSpan={2}
                  mainSpan={5}
                />
                <CheckBox
                  form={form}
                  name="has_luggage"
                  label="Luggage"
                  labelSpan={3}
                  inputSpan={2}
                  mainSpan={5}
                />
                <CheckBox
                  form={form}
                  name="is_domestic"
                  label="Domestic Flight"
                  labelSpan={3}
                  inputSpan={2}
                  mainSpan={5}
                />
              </div>
            </div>
          </form>
        )}
      </Form>
    </Modal>
  );
}

