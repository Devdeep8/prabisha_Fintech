import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { fetchUserData } from "@/utils/fetchdata";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

interface KYCItem {
  document: File | string | null;
  type: string;
  document_type?: string;
  number?: string;
}

interface ProfileFormValues {
  userId?: string;
  firstname: string;
  lastname: string;
  email: string;
  contactno: string;
  country: string;
  state: string;
  city: string;
  kyc: KYCItem[];
}

interface CreateProfileOneProps {
  initialData?: ProfileFormValues | null;
  categories?: any[];
  params: { username: string };
}

const CreateProfileOne: React.FC<CreateProfileOneProps> = ({
  initialData,
  params,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { username } = params;
  const title = initialData ? "Edit Profile" : "Create Your Profile";
  const description = initialData
    ? "Edit your profile."
    : "To create your resume, we first need some basic information about you.";
  const toastMessage = initialData ? "Profile updated." : "Profile created.";
  const action = initialData ? "Save changes" : "Create";
  const [kycStatus, setKycStatus] = useState<KYCItem[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [kycScore, setKycScore] = useState(0);

  const defaultValues: ProfileFormValues = {
    firstname: "",
    lastname: "",
    email: "",
    contactno: "",
    country: "",
    state: "",
    city: "",
    kyc: [
      { document: null, type: "Aadhaar Card", number: "" },
      { document: null, type: "PAN Card", number: "" },
      { document: null, type: "Bank Passbook", number: "" },
      { document: null, type: "Electricity Bill", number: "" },
      { document: null, type: "Passport", number: "" },
      { document: null, type: "Driving License", number: "" },
      { document: null, type: "Rent Agreement", number: "" },
      { document: null, type: "Birth Certificate", number: "" },
      { document: null, type: "Voter ID", number: "" },
      { document: null, type: "12th Result", number: "" },
    ],
  };

  const form = useForm<ProfileFormValues>({
    defaultValues,
    mode: "onChange",
  });

  const { control, handleSubmit, setValue, reset, watch } = form;

  const handleNextStep = () => setActiveStep((prevStep) => prevStep + 1);
  const handlePreviousStep = () => setActiveStep((prevStep) => prevStep - 1);

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        const userData = await fetchUserData(username);
        if (userData) {
          reset(userData);
          setValue("email", userData.email, { shouldValidate: false });
          setValue("country", userData.country);
        }
      }

      if (initialData?.userId) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_PORT}/api/getKYC/${initialData.userId}`
          );
          const fetchedKycStatus = response.data.results;
          setKycStatus(fetchedKycStatus);

          // Calculate KYC score based on number of uploaded documents
          const totalKYCItems = defaultValues.kyc.length;
          const uploadedCount = fetchedKycStatus.length;
          const score = totalKYCItems === 0 ? 0 : (uploadedCount / totalKYCItems) * 100;
          setKycScore(score);
        } catch (error) {
          console.error("Error fetching KYC status:", error);
        }
      }
    };
    fetchData();
  }, [username, reset, setValue, initialData?.userId]);

  const onSubmitProfile: SubmitHandler<ProfileFormValues> = async (data) => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_PORT}/api/profile/${initialData?.userId}`,
        data
      );
      toast({
        title: "Profile Update",
        description: `Profile has been uploaded successfully.`,
        duration: 5000,
        variant: "success",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the profile.",
        duration: 5000,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (index: number) => {
    const file = watch(`kyc.${index}.document`);
    const number = watch(`kyc.${index}.number`);
    if (file && file instanceof File) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", initialData?.userId || "");
      formData.append("documentType", defaultValues.kyc[index].type);
      formData.append("documentNumber", number || "");

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_PORT}/api/uploadKYC`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const filePath = response.data.path;
        setValue(`kyc.${index}.document`, filePath);
        router.refresh();
        
        toast({
          title: "Document Uploaded",
          description: `${defaultValues.kyc[index].type} has been uploaded successfully.`,
          duration: 5000,
          variant: "success",
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        });
        
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Upload Error",
          description: "An error occurred while uploading the document.",
          duration: 5000,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Upload Error",
        description: "Please select a file to upload.",
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    setValue(`kyc.${index}.document`, file || null);
  };

  const handleNumberChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue(`kyc.${index}.number`, e.target.value);
  };

  const renderKYCSection = (title: string, startIndex: number, endIndex: number) => (
    <>
      <Heading title={title} description="" />
      <div className="grid grid-cols-1 gap-4">
        {defaultValues.kyc.slice(startIndex, endIndex).map((kyc, index) => (
          <div
            key={index + startIndex}
            className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-md bg-white"
          >
            <FormLabel className="w-32 font-medium">
              {kyc.type}
            </FormLabel>
            <div className="flex items-center flex-grow space-x-2">
              <Input
                type="text"
                placeholder={`Enter ${kyc.type} number`}
                onChange={(e) => handleNumberChange(index + startIndex, e)}
                value={watch(`kyc.${index + startIndex}.number`) || ""}
                disabled={loading}
                className="w-48"
              />
              <div className="flex-grow">
              <Input
                  type="file"
                  onChange={(e) => handleFileChange(index + startIndex, e)}
                  disabled={loading}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleFileUpload(index + startIndex)}
                className="h-full w-[6rem] text-sm flex items-center justify-center"
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
                    status.document_type === kyc.type &&
                    status.document_type
                )
                  ? "✅ Uploaded"
                  : "⬆️ Upload"}
              </Button>
            </div>
            <FormMessage />
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmitProfile)}
          className="w-full space-y-8"
        >
          {activeStep === 0 && (
            <div className="gap-8 md:grid md:grid-cols-3">
              {/* Basic Information Fields */}
              {/* ... (Keep the existing basic information fields) */}
            </div>
          )}
         
          <div className="space-y-8">
            <div className="flex flex-col items-center">
             
              <p className="text-sm text-gray-600 mt-2">
                KYC Score: <span className="font-semibold">{kycScore}</span>
                /100
              </p>
            </div>

            {renderKYCSection("Important Documents", 0, 2)}
            <Separator />
            {renderKYCSection("Financial Info & Address Verification", 2, 7)}
            <Separator />
            {renderKYCSection("DOB Verification Documents", 7, 10)}
          </div>
        </form>
      </Form>
    </>
  );
};

export default CreateProfileOne;
