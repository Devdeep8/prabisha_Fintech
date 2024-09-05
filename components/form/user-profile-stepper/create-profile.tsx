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
import { Progress } from "@/components/ui/progress";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import Select from "react-select";
import Stepper from "./Stepper";
import countryList from "react-select-country-list";
import { State, City } from "country-state-city";

interface KYCItem {
  document: File | string | null;
  type: string;
  document_type?: string; // Add this line
}

interface ProfileFormValues {
  userId?: string; // Add this line
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
      { document: null, type: "Aadhaar Card" },
      { document: null, type: "PAN Card" },
      { document: null, type: "Bank Passbook" },
      { document: null, type: "Electricity Bill" },
      { document: null, type: "Passport" },
      { document: null, type: "Driving License" },
      { document: null, type: "Rent Agreement" },
      { document: null, type: "Birth Certificate" },
      { document: null, type: "Voter ID" },
      { document: null, type: "12th Result" },
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
          setKycStatus(response.data.results);
          setKycScore(response.data.results.length * 10);
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
    } finally {
      setLoading(false);
    }
  };

  const countries = countryList().getData();
  const [states, setStates] = useState<
    { label: string; value: string; countryCode: string }[]
  >([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);

  const handleCountryChange = (selectedCountry: any) => {
    setValue("country", selectedCountry.label);
    const statesData = State.getStatesOfCountry(selectedCountry.value).map(
      (state) => ({
        label: state.name,
        value: state.isoCode,
        countryCode: selectedCountry.value,
      })
    );
    setStates(statesData);
    setCities([]);
  };

  const handleStateChange = (selectedState: any) => {
    setValue("state", selectedState.label);
    const citiesData = City.getCitiesOfState(
      selectedState.countryCode,
      selectedState.value
    ).map((city) => ({
      label: city.name,
      value: city.name,
    }));
    setCities(citiesData);
  };

  const handleFileUpload = async (index: number) => {
    const file = watch(`kyc.${index}.document`);
    if (file && file instanceof File) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", initialData?.userId || ""); // Ensure userId is included
      formData.append("documentType", defaultValues.kyc[index].type);

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
        
        // Fetch additional data if needed
        toast({
          title: "Document Uploaded",
          description: `${defaultValues.kyc[index].type} has been uploaded successfully.`,
          duration: 5000,
          variant: "success",
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        });
        
        // Process the response if needed
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      console.error("No file to upload");
    }
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    setValue(`kyc.${index}.document`, file || null);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Stepper
        activeStep={activeStep}
        steps={["Basic Information", "KYC Documents"]}
      />
      <Separator />
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmitProfile)}
          className="w-full space-y-8"
        >
          {activeStep === 0 && (
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
                      onChange={(value) => handleCountryChange(value)}
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
                      onChange={(value) => handleStateChange(value)}
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
                      onChange={(value) => setValue("city", value?.label || "")}
                      isDisabled={loading || !cities.length}
                      placeholder="Select a city"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {activeStep === 1 && (
            <div className="space-y-8">
              {/* Progress Bar */}
              <div className="flex flex-col items-center">
                <Progress
                  value={kycScore}
                  max={100}
                  className="w-full "
                  
                />
                <p className="text-sm text-gray-600 mt-2">
                  KYC Score: <span className="font-semibold">{kycScore}</span>
                  /100
                </p>
              </div>

              {/* Important Documents Section */}
              <Heading title="Important Documents" description="" />
              <div className="grid grid-cols-1 gap-4">
                {defaultValues.kyc.slice(0, 2).map((kyc, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-md bg-white"
                  >
                    <FormLabel className="w-32 font-medium">
                      {kyc.type}
                    </FormLabel>
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
                          className="h-full w-[6rem]  text-sm flex items-center justify-center"
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
                            : `⬆️ Upload `}
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </div>
                ))}
              </div>

              <Separator />

              {/* Financial Info Documents Section */}
              <Heading title="Financial Info & Address Verification " description="" />
              <div className="grid grid-cols-1 gap-4">
                {defaultValues.kyc.slice(2, 7).map((kyc, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-md bg-white"
                  >
                    <FormLabel className="w-32 font-medium">
                      {kyc.type}
                    </FormLabel>
                    <div className="flex items-center flex-grow">
                      <div className="flex-grow">
                        <Input
                          type="file"
                          onChange={(e) => handleFileChange(index + 4, e)}
                          disabled={loading}
                          className="mb-2 w-full"
                          style={{ height: "2.5rem" }}
                        />
                      </div>
                      <div className="px-4">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleFileUpload(index + 4)}
                          className="h-full w-[6rem]  text-sm flex items-center justify-center"
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
                              status.document_type === kyc.type &&
                              status.document_type
                          )
                            ? "✅ Uploaded"
                            : `⬆️ Upload `}
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </div>
                ))}
              </div>

              <Separator />

              {/* DOB Verification Documents Section */}
              <Heading title="DOB Verification Documents" description="" />
              <div className="grid grid-cols-1 gap-4">
                {defaultValues.kyc.slice(7).map((kyc, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-md bg-white"
                  >
                    <FormLabel className="w-32 font-medium">
                      {kyc.type}
                    </FormLabel>
                    <div className="flex items-center flex-grow">
                      <div className="flex-grow">
                        <Input
                          type="file"
                          onChange={(e) => handleFileChange(index + 6, e)}
                          disabled={loading}
                          className="mb-2 w-full"
                          style={{ height: "2.5rem" }}
                        />
                      </div>
                      <div className="px-4">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleFileUpload(index + 6)}
                          className="h-full w-[6rem]  text-sm flex items-center justify-center"
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
                              status.document_type === kyc.type &&
                              status.document_type
                          )
                            ? "✅ Uploaded"
                            : `⬆️ Upload `}
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {activeStep > 0 && (
              <Button variant="outline" onClick={handlePreviousStep}>
                Previous
              </Button>
            )}
            {activeStep < 1 && (
              <Button type="button" onClick={handleNextStep}>
                Next
              </Button>
            )}
            {activeStep === 0 && (
              <Button type="submit" disabled={loading}>
                Submit
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};

export default CreateProfileOne;
