'use client'
import { useState } from 'react';
import { useToast } from '../ui/use-toast';
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      if (step === 1) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            Securityquestion : securityAnswer
          })
        });
        const data = await response.json();
        if (response.ok) {
          toast({
            title: "Email Sent",
            description: "An email has been sent to reset your password.",
            variant: "success",
          });
          setStep(2); // Move to OTP verification step
        } else {
          toast({
            title: "Error",
            description: data.message || "Error requesting OTP",
            variant: "destructive",
          });
        }
      } else if (step === 2) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, otp })
        });
        const data = await response.json();
        if (response.ok) {
          setStep(3); // Move to password reset step
        } else {
          toast({
            title: "Error",
            description: data.message || "Invalid OTP",
            variant: "destructive",
          });
        }
      } else if (step === 3) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, newPassword })
        });
        const data = await response.json();
        if (response.ok) {
          toast({
            title: "Password Reset",
            description: "Your password has been successfully reset.",
            variant: "success",
          });
          setStep(4); // Move to success step
        } else {
          toast({
            title: "Error",
            description: data.message || "Error resetting password",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full mx-auto shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded-lg"
              />
              <Input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Security Question Answer"
                className="w-full p-2 border rounded-lg"
              />
            </>
          )}
          {step === 2 && (
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="w-full p-2 border rounded-lg"
            />
          )}
          {step === 3 && (
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-2 border rounded-lg"
            />
          )}
          <Button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
            {step === 1 && "Request OTP"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </Button>
          {step === 4 && (
            <p className="text-center">
              Password reset successfully! You can now log in with your new password.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
