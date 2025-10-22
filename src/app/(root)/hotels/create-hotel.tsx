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
import hotelCreateSchema, { HotelFormValues } from "./schema/create-hotel";
import { useGetHotelById } from "@/api-config/queries/hotel";
import { useCreateHotel } from "@/api-config/queries/hotel";
import { useUpdateHotel } from "@/api-config/queries/hotel";
import { HotelFormSkeleton } from "./components/hotel-form-skeleton";
import { NumberInput } from "@/components/form-inputs/number-input";
import { TextareaInput } from "@/components/form-inputs/text-area-input";
import { CheckBox } from "@/components/form-inputs/check-box";
import { useEffect } from "react";

interface HotelCreationFormProps {
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

const defaultValues: HotelFormValues = {
  name: "",
  description: "",
  location: "",
  city: "",
  country: "",
  price: 0,
  currency: "USD",
  rating: 1,
  star_rating: 1,
  amenities: [],
  images: [],
  has_wifi: false,
  has_pool: false,
  has_spa: false,
  has_gym: false,
  has_restaurant: false,
  has_parking: false,
  has_pet_friendly: false,
  phone: "",
  email: "",
  website: "",
  address: "",
  latitude: 0,
  longitude: 0,
};

export default function CreateHotel({
  open,
  onOpenChange,
  hideDefaultTrigger,
  onSuccess,
  editedDataId,
}: HotelCreationFormProps) {
  const message = useMessage();
  const formId = "hotel-form";

  const {
    data: editedData,
    isLoading: isLoadingEditedData,
    isFetching: isFetchingEditedData,
  } = useGetHotelById(editedDataId || null);

  const {
    mutateAsync: mutateAsyncCreateHotel,
    isPending: isPendingCreateHotel,
  } = useCreateHotel();
  const {
    mutateAsync: mutateAsyncUpdateHotel,
    isPending: isPendingUpdateHotel,
  } = useUpdateHotel();

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelCreateSchema),
    defaultValues: defaultValues,
  });

  // Handle form submission
  const onSubmitCreateHotel = async (data: HotelFormValues) => {
    const loadingId = message.loading(
      data.id ? "Editing..." : "Registering...",
      0
    );
    const isEdit = Boolean(data.id);
    try {
      await (isEdit
        ? mutateAsyncUpdateHotel(data)
        : mutateAsyncCreateHotel({
            ...data,
          }));
      message.remove(loadingId);
      message.success(
        isEdit ? "Update hotel successful!" : "Create hotel successful!"
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
      form.reset({
        ...editedData.data,
      });
    } else if (!editedData && !isLoadingEditedData && !isFetchingEditedData) {
      form.reset(defaultValues);
    }
  }, [editedData, isLoadingEditedData, isFetchingEditedData, form]);

  console.log(form.formState.errors);

  return (
    <Modal
      title={`${editedDataId ? "Edit Hotel" : "New Hotel Registration"}`}
      description={`${
        editedDataId
          ? "Edit existing hotel ..."
          : "Create new hotel for the telco admin portal"
      }`}
      triggerButton={
        <Button className="gap-2">
          <PlusCircle className="h-3 w-3" />
          Create Hotel
        </Button>
      }
      width="4xl"
      onClose={() => form.reset()}
      open={open}
      onOpenChange={onSuccess}
      hideDefaultTrigger={hideDefaultTrigger}
      bottomButton={
        <BottomBtns
          isPending={isPendingCreateHotel || isPendingUpdateHotel}
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
        isPendingCreateHotel ||
        isPendingUpdateHotel ? (
          <HotelFormSkeleton />
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmitCreateHotel)}
            className="space-y-3 py-2"
            id={formId}
          >
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                form={form}
                name="name"
                label="Hotel Name"
                placeholder="Enter hotel name"
              />

              <TextInput
                form={form}
                name="location"
                label="Location"
                placeholder="Enter location"
              />
              <TextInput
                form={form}
                name="city"
                label="City"
                placeholder="Enter city"
              />

              <TextInput
                form={form}
                name="country"
                label="Country"
                placeholder="Enter country"
              />

              <TextInput
                form={form}
                name="address"
                label="Address"
                placeholder="Enter address"
              />
              <TextInput
                form={form}
                name="price"
                label="Price"
                placeholder="Enter price"
                type="number"
              />
              <TextInput
                form={form}
                name="phone"
                label="Phone"
                placeholder="Enter phone number"
              />
              <SelectBox
                control={form.control}
                name="currency"
                label="Currency"
                options={currencyOptions}
                placeholder="Select currency"
              />

              <NumberInput
                form={form}
                name="rating"
                label="Rating (1-5)"
                min={1}
                max={5}
              />

              <NumberInput
                form={form}
                name="star_rating"
                label="Star Rating (1-5)"
                min={1}
                max={5}
              />
              <TextInput
                form={form}
                name="email"
                label="Email"
                placeholder="Enter email"
              />

              <TextInput
                form={form}
                name="website"
                label="Website"
                placeholder="Enter website URL"
              />
              <TextInput
                form={form}
                name="latitude"
                label="Latitude"
                type="number"
              />

              <TextInput
                form={form}
                name="longitude"
                label="Longitude"
                type="number"
              />
              <TextareaInput
                form={form}
                name="description"
                label="Description"
                placeholder="Enter description"
                rows={2}
              />
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
                  name="has_pool"
                  label="Pool"
                  labelSpan={3}
                  inputSpan={2}
                  mainSpan={5}
                />
                <CheckBox
                  form={form}
                  name="has_spa"
                  label="Spa"
                  labelSpan={3}
                  inputSpan={2}
                  mainSpan={5}
                />
                <CheckBox
                  form={form}
                  name="has_gym"
                  label="Gym"
                  labelSpan={3}
                  inputSpan={2}
                  mainSpan={5}
                />
                <CheckBox
                  form={form}
                  name="has_restaurant"
                  label="Restaurant"
                  labelSpan={3}
                  inputSpan={2}
                  mainSpan={5}
                />
                <CheckBox
                  form={form}
                  name="has_parking"
                  label="Parking"
                  labelSpan={3}
                  inputSpan={2}
                  mainSpan={5}
                />
                <CheckBox
                  form={form}
                  name="has_pet_friendly"
                  label="Pet Friendly"
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
