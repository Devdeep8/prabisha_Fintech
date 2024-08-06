'use client'
import BreadCrumb from '@/components/breadcrumb';
import Portfolio from '@/app/dashboard/@user/portfolio/components/portfolio';
import { ScrollArea } from '@/components/ui/scroll-area';
export default function Page() {
  // Define initial state for user data
 
  const breadcrumbItems = [{ title: `Portfolio`, link: `/dashboard/portfolio` }];
  
  
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        {/* Add your calculator component here */}
        <Portfolio />
      </div>
    </ScrollArea>
  );
}
