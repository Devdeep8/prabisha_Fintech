"use client";

import { useEffect, useState, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verificationByPan } from "@/utils/verifypan";
import { verifyTokenAndReturnCookies } from "@/lib/cookie";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { useToast } from "../../../../../components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import BentoPort from "./bentoport";





export default function Portfolio() {
  const [isPanVerified, setIsPanVerified] = useState(false);
  const [userId, setUserId] = useState(); // Replace with actual user ID
  const { toast } = useToast();

  useEffect(() => {
    const verifyPanAndFetchData = async () => {
      try {
        const user = await verifyTokenAndReturnCookies();
        const userId = user?.userId;
        const panVerificationResult = await verificationByPan(userId);
        if (panVerificationResult.length > 0) {
          setIsPanVerified(true);
          const date = new Date().toISOString().split("T")[0]; // Current date
          // const sensex = await fetchHistoricalData(
          //   "BSE_INDEX|SENSEX",
          //   "1minute",
          //   date
          // ); // 1-minute interval
          toast({
            title: "Success!",
            description: "PAN verified and Sensex data fetched.",
            variant: "success",
            action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
          });
        } else {
          toast({
            title: "Verification Failed",
            description: "Your PAN could not be verified.",
            variant: "destructive",
            action: (
              <ToastAction altText="Dismiss">Verify PAN Card</ToastAction>
            ),
          });
        }
      } catch (error) {
        console.error("Error during PAN verification or data fetch:", error);
        toast({
          title: "Error",
          description: "An error occurred while verifying PAN or fetching data.",
          variant: "destructive",
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        });
      }
    };

    verifyPanAndFetchData();
  }, [userId, toast]);

  return (
    <ToastProvider>
      <ToastViewport />
      {!isPanVerified && (
        <Card>
          <CardHeader>
            <CardTitle>Sensex Intraday Chart</CardTitle>
            <CardDescription>Current Day</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              PAN verification is pending. Please verify your PAN to view the
              Sensex data.
            </p>
            {/* Form to input user ID */}
          </CardContent>
        </Card>
      )}
      {isPanVerified && (
          <div className="w-full">
            <Suspense fallback={<div>Loading...</div>}>
            <BentoPort />
            </Suspense>
          </div>
      )}
    </ToastProvider>
  );
}
