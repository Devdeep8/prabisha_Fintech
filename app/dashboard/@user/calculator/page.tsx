'use client'
import BreadCrumb from '@/components/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import ExpenseCalculator from '@/components/calculator';
export default function Page() {
  // Define initial state for user data
 
  const breadcrumbItems = [{ title: `Calculator`, link: `/dashboard/calculator` }];
  
  
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        {/* Add your calculator component here */}
<ExpenseCalculator />
      </div>
    </ScrollArea>
  );
}
