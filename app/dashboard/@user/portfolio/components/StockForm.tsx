"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { verifyTokenAndReturnCookies } from "@/lib/cookie";
import { cn } from "@/lib/utils";
import {useToast} from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface StockFormProps {
  onClose: () => void;
}

const FormSchema = z.object({
  stockName: z.string().nonempty({ message: "Stock name is required." }),
  stockPrice: z.string().nonempty({ message: "Stock price is required." }),
  date: z.date({ required_error: "A date is required." }),
  quantity: z.string().nonempty({ message: "Quantity is required." }),
  symbol: z.string().nonempty({ message: "Stock symbol is required." }),
});

const StockForm: React.FC<StockFormProps> = ({ onClose }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    const user = await verifyTokenAndReturnCookies();
    const userId = user?.userId;
    console.log(userId); // Replace with actual user ID
    const response = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/stocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, userId }),
    });
    if (response.ok) {
      toast({
        title: "Success!",
        description: "Stock is added to Portfolio.",
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred while adding Stock.",
        variant: "destructive",
      });
    }
    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-lg">
      <CardHeader>
        <CardTitle>Add New Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stockName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                   
                    <FormControl>
                      <Input {...field} className="mt-1 rounded-md" placeholder="Stock Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Input {...field} className="mt-1 rounded-md" placeholder="Stock Symbol" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stockPrice"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Input {...field} className="mt-1 rounded-md" placeholder="Stock Price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="mt-1 rounded-md"
                        placeholder="Quantity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Stock</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StockForm;
