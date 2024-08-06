import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { DataTable } from "../components/DataTable";
import { columns } from "../components/columns";
import StockForm from "../components/StockForm";
import { DEFAULT_SCREENER } from "@/lib/yahoo-finance/constants";
import { fetchScreenerStocks } from "@/utils/stockData";
import axios from "axios";
import { cookies } from 'next/headers'; // Use next/headers for cookie management

interface ScreenerQuote {
  symbol: string;
  // Add other fields as needed
}

interface ScreenerResult {
  quotes: ScreenerQuote[];
}

interface StockData {
  symbol: string;
  // Add other fields as needed
}

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    screener?: string;
  };
}) => {
  const breadcrumbItems = [
    { title: "Portfolio", link: "/dashboard/portfolio" },
    { title: "Stocks", link: "/dashboard/portfolio/stocks" },
  ];

  const screener = searchParams?.screener || DEFAULT_SCREENER;

  let mergedData: any[] = [];
  try {
    // Get cookies and extract the token
    const cookieStore = cookies(); // Use cookies() to get cookies in server component
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("Token not found or invalid");
    }

    // Decode the token (consider using a library for this purpose)
    const decodedToken: any = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = decodedToken.userId;

    // Fetch stocks from the database for the current user
    const resStocks = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/stocks/${userId}`);
    const stockData: StockData[] = resStocks.data;

    // Fetch screener data
    const screenerDataResults: ScreenerResult = await fetchScreenerStocks(screener);

    // Merge data: find matching stocks in screener data and stockData
    mergedData = stockData
      .map((stock: StockData) => {
        const screenerStock = screenerDataResults.quotes.find((s: ScreenerQuote) => s.symbol === stock.symbol);
        return screenerStock ? { ...stock, ...screenerStock } : null;
      })
      .filter((stock: any) => stock !== null);

  } catch (error: any) {
    console.log(error);
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div>
          <DataTable columns={columns} data={mergedData} formComponent={StockForm} />
        </div>
      </div>
    </ScrollArea>
  );
};

export default Page;
