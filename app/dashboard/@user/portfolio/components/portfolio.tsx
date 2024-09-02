"use client"

import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { verificationByPan } from "@/utils/verifypan"
import { verifyTokenAndReturnCookies } from "@/lib/cookie"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Loader2 } from "lucide-react"
import BentoPort from "./bentoport"

// Mock data for the pie chart
const investmentData = [
  { name: "Stocks", value: 45000 },
  { name: "Mutual Funds", value: 30000 },
  { name: "Property", value: 100000 },
  { name: "Crypto", value: 15000 },
  { name: "Bank Deposits", value: 25000 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const TotalPortfolioValue = ({ value }: { value: number }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Total Portfolio Value</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-4xl font-bold">${value.toLocaleString()}</p>
    </CardContent>
  </Card>
)

const InvestmentDistribution = () => (
  <Card>
    <CardHeader>
      <CardTitle>Investment Distribution</CardTitle>
      <CardDescription>Breakdown of your investments</CardDescription>
    </CardHeader>
    <CardContent className="h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={investmentData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {investmentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

const PortfolioContent = () => {
  const totalValue = investmentData.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <div className="space-y-6">
      <TotalPortfolioValue value={totalValue} />
      <InvestmentDistribution />
    </div>
  )
}

export default function Portfolio() {
  const [isPanVerified, setIsPanVerified] = useState(false)
  const [userId, setUserId] = useState<string | undefined>()
  const { toast } = useToast()

  useEffect(() => {
    const verifyPanAndFetchData = async () => {
      try {
        const user = await verifyTokenAndReturnCookies()
        const userId = user?.userId
        setUserId(userId)
        const panVerificationResult = await verificationByPan(userId)
        if (panVerificationResult.length > 0) {
          setIsPanVerified(true)
          
        } else {
          toast({
            title: "Verification Failed",
            description: "Your PAN could not be verified.",
            variant: "destructive",
            action: <ToastAction altText="Verify PAN">Verify PAN</ToastAction>,
          })
        }
      } catch (error) {
        console.error("Error during PAN verification:", error)
        toast({
          title: "Error",
          description: "An error occurred while verifying PAN.",
          variant: "destructive",
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        })
      }
    }

    verifyPanAndFetchData()
  }, [toast])

  return (
    <ToastProvider>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Portfolio</h1>
        {!isPanVerified ? (
          <Card>
            <CardHeader>
              <CardTitle>PAN Verification Required</CardTitle>
              <CardDescription>Please verify your PAN to view your portfolio.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>PAN verification is pending. Please verify your PAN to access your portfolio data.</p>
              {/* Add a form or button here to initiate PAN verification */}
            </CardContent>
          </Card>
        ) : (
          <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
            <PortfolioContent />
            <div className="my-2">
            <BentoPort/>
            </div>
          </Suspense>
        )}
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}