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
  handlePreviousStep: () => void;
  onSubmitProfile: () => void;
}

const KYCForm: React.FC<KYCFormProps> = ({
  loading,
  kycStatus,
  handleFileUpload,
  handleFileChange,
  handlePreviousStep,
  onSubmitProfile,
}) => {
  const { watch } = useFormContext();
  const defaultValues = watch("kyc") || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      {defaultValues.map((kyc: any, index: number) => (
        <div key={index} className="flex items-center space-x-4">
          <FormLabel className="w-32">{kyc.type}</FormLabel>
          <div className="flex items-center flex-grow">
            <div className="flex-grow">
              <Input
                type="file"
                onChange={(e) => handleFileChange(index, e)}
                disabled={loading}
                className="mb-2 w-full"
                style={{ height: "2.5rem" }}
              />
            </div>
            <div className="px-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleFileUpload(index)}
                className="h-full min-w-[6rem] max-w-[10rem]"
                style={{ fontSize: "0.75rem" }}
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

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button type="submit" onClick={onSubmitProfile} disabled={loading}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default KYCForm;
