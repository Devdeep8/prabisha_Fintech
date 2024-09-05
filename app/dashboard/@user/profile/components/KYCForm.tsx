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
  handleNumberChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handlePreviousStep: () => void;
  onSubmitProfile: () => void;
}

export default function KYCForm({
  loading,
  kycStatus,
  handleFileUpload,
  handleFileChange,
  handleNumberChange,
  handlePreviousStep,
  onSubmitProfile,
}: KYCFormProps) {
  const { watch } = useFormContext();
  const defaultValues = watch("kyc") || [];

  return (
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
              <Input
                type="file"
                onChange={(e) => handleFileChange(index, e)}
                disabled={loading}
                className="flex-grow"
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => handleFileUpload(index)}
                className="whitespace-nowrap"
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

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button type="submit" onClick={onSubmitProfile} disabled={loading}>
          Submit
        </Button>
      </div>
    </div>
  );
}