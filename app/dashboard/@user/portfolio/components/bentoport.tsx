/**
 * v0 by Vercel.
 * @see https://v0.dev/t/tkGqVAhBftb
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { JSX, SVGProps } from "react"


export default function BentoPort(className : any) {
  const router = useRouter();
   return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 ${className}`}>
      <div className="group relative overflow-hidden rounded-lg bg-muted p-4 transition-all hover:bg-accent hover:text-accent-foreground">
        <div className="flex items-center justify-center">
          <StoreIcon className="h-10 w-10" />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">Stocks</h3>
          <p className="text-sm text-muted-foreground">View your stock portfolio</p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="text-2xl font-bold">$125,000</div>
          <div className="text-sm text-primary-foreground">+12% this month</div>
          <Button onClick={() => router.push('/dashboard/portfolio/stocks')} variant="secondary" size="sm">
            Manage
          </Button>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-lg bg-muted p-4 transition-all hover:bg-accent hover:text-accent-foreground">
        <div className="flex items-center justify-center">
          <BanknoteIcon className="h-10 w-10" />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">Bank</h3>
          <p className="text-sm text-muted-foreground">View your bank accounts</p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 blu opacity-0 transition-opacity group-hover:opacity-100">
          <div className="text-2xl font-bold text-accent-foreground">$45,000</div>
          <div className="text-sm text-accent-foreground">+5% this month</div>
          <Button variant="secondary" size="sm">
            Manage
          </Button>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-lg bg-muted p-4 transition-all hover:bg-accent hover:text-accent-foreground">
        <div className="flex items-center justify-center">
          <HomeIcon className="h-10 w-10" />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">Property</h3>
          <p className="text-sm text-muted-foreground">View your real estate</p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
          <div className="text-2xl font-bold text-accent-foreground">$350,000</div>
          <div className="text-sm text-accent-foreground">+3% this month</div>
          <Button variant="secondary" size="sm">
            Manage
          </Button>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-lg bg-muted p-4 transition-all hover:bg-accent hover:text-accent-foreground">
        <div className="flex items-center justify-center">
          <PieChartIcon className="h-10 w-10" />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">Mutual Funds</h3>
          <p className="text-sm text-muted-foreground">View your mutual fund investments</p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
          <div className="text-2xl font-bold text-accent-foreground">$75,000</div>
          <div className="text-sm text-accent-foreground">+8% this month</div>
          <Button variant="secondary" size="sm">
            Manage
          </Button>
        </div>
      </div>
      <div className="group relative overflow-hidden col-span-2 rounded-lg bg-muted p-4 transition-all hover:bg-accent hover:text-accent-foreground">
        <div className="flex items-center justify-center">
          <BitcoinIcon className="h-10 w-10" />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">Cryptocurrency</h3>
          <p className="text-sm text-muted-foreground">View your crypto portfolio</p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
          <div className="text-2xl font-bold text-accent-foreground">$25,000</div>
          <div className="text-sm text-accent-foreground">+15% this month</div>
          <Button variant="secondary" size="sm">
            Manage
          </Button>
        </div>
      </div>
    </div>
  );
}

function BanknoteIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  )
}

function BitcoinIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
    </svg>
  )
}

function HomeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function PieChartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}

function StoreIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  )
}