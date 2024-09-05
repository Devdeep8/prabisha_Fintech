import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface KYCFormProps {
  loading: boolean;
  kycStatus: any[];
  handleFileUpload: (index: number) => void;
  handleFileChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
<<<<<<< HEAD
  handleNumberChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
=======
>>>>>>> db3e8ed2ee483f8ab1f4b89cd77a69665dfbdf35
  handlePreviousStep: () => void;
  onSubmitProfile: () => void;
}

<<<<<<< HEAD
export default function KYCForm({
=======
const KYCForm: React.FC<KYCFormProps> = ({
>>>>>>> db3e8ed2ee483f8ab1f4b89cd77a69665dfbdf35
  loading,
  kycStatus,
  handleFileUpload,
  handleFileChange,
<<<<<<< HEAD
  handleNumberChange,
  handlePreviousStep,
  onSubmitProfile,
}: KYCFormProps) {
=======
  handlePreviousStep,
  onSubmitProfile,
}) => {
>>>>>>> db3e8ed2ee483f8ab1f4b89cd77a69665dfbdf35
  const { watch } = useFormContext();
  const defaultValues = watch("kyc") || [];

  return (
<<<<<<< HEAD
    <div className="space-y-6">
      {defaultValues.map((kyc: any, index: number) => (
        <div key={index} className="space-y-2">
          <FormLabel>{kyc.type}</FormLabel>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              placeholder="Enter number"
              onChange={(e) => handleNumberChange(index, e)}
              disabled={loading}
              className="w-24"
            />
            <div className="flex-grow flex items-center space-x-2">
=======
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      {defaultValues.map((kyc: any, index: number) => (
        <div key={index} className="flex items-center space-x-4">
          <FormLabel className="w-32">{kyc.type}</FormLabel>
          <div className="flex items-center flex-grow">
            <div className="flex-grow">
>>>>>>> db3e8ed2ee483f8ab1f4b89cd77a69665dfbdf35
              <Input
                type="file"
                onChange={(e) => handleFileChange(index, e)}
                disabled={loading}
<<<<<<< HEAD
                className="flex-grow"
              />
=======
                className="mb-2 w-full"
                style={{ height: "2.5rem" }}
              />
            </div>
            <div className="px-4">
>>>>>>> db3e8ed2ee483f8ab1f4b89cd77a69665dfbdf35
              <Button
                variant="outline"
                type="button"
                onClick={() => handleFileUpload(index)}
<<<<<<< HEAD
                className="whitespace-nowrap"
=======
                className="h-full min-w-[6rem] max-w-[10rem]"
                style={{ fontSize: "0.75rem" }}
>>>>>>> db3e8ed2ee483f8ab1f4b89cd77a69665dfbdf35
                disabled={
                  loading ||
                  (kycStatus &&
                    kycStatus.some(
                      (status) =>
                        status.document_type === kyc.type &&
                        status.document_type
                    ))
                }
              >
                {kycStatus &&
                kycStatus.some(
                  (status) =>
                    status.document_type === kyc.type && status.document_type
                )
                  ? "Uploaded"
                  : `Upload ${kyc.type}`}
              </Button>
            </div>
          </div>
          <FormMessage />
        </div>
      ))}

<<<<<<< HEAD
      <div className="flex justify-between pt-6">
=======
      <div className="flex justify-between">
>>>>>>> db3e8ed2ee483f8ab1f4b89cd77a69665dfbdf35
        <Button variant="outline" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button type="submit" onClick={onSubmitProfile} disabled={loading}>
          Submit
        </Button>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
};

export default KYCForm;
>>>>>>> db3e8ed2ee483f8ab1f4b89cd77a69665dfbdf35
