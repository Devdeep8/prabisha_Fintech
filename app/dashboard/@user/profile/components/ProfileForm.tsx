import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import countryList from "react-select-country-list";
import { State, City } from "country-state-city";
import { useFormContext } from "react-hook-form";

interface ProfileFormProps {
  loading: boolean;
  handleCountryChange: (value: any) => void;
  handleStateChange: (value: any) => void;
  handleNextStep: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  loading,
  handleCountryChange,
  handleStateChange,
  handleNextStep,
}) => {
  const { control, setValue, watch } = useFormContext();
  const countries = countryList().getData();
  const states = watch("states") || [];
  const cities = watch("cities") || [];

  return (
    <div className="gap-8 md:grid md:grid-cols-3">
      <FormField
        control={control}
        name="firstname"
        render={({ field }) => (
          <FormItem>
            <Input
              disabled={loading}
              placeholder="First Name"
              {...field}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="lastname"
        render={({ field }) => (
          <FormItem>
            <Input
              disabled={loading}
              placeholder="Last Name"
              {...field}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <Input
              disabled
              placeholder="example@gmail.com"
              {...field}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="contactno"
        render={({ field }) => (
          <FormItem>
            <Input
              type="number"
              placeholder="Enter your contact number"
              disabled={loading}
              {...field}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <Select
              options={countries}
              onChange={handleCountryChange}
              isDisabled={loading}
              placeholder="Select a country"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <Select
              options={states}
              onChange={handleStateChange}
              isDisabled={loading || !states.length}
              placeholder="Select a state"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <Select
              options={cities}
              onChange={(value) => setValue("city", value || "")}
              isDisabled={loading || !cities.length}
              placeholder="Select a city"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={handleNextStep}>
        Next
      </Button>
    </div>
  );
};

export default ProfileForm;
