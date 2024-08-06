"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { verifyTokenAndReturnCookies } from "@/lib/cookie";
import {
  ChartConfig as ChartConfigType,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface Expense {
  createdAt: string | number | Date;
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
  userId: string;
}

interface NewExpense {
  name: string;
  amount: string;
  category: string;
  date: string;
}

const chartConfig: ChartConfigType = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

export default function Calculator() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<NewExpense>({
    name: "",
    amount: "",
    category: "",
    date: "",
  });
  const [filterDate, setFilterDate] = useState<{ startDate: Date; endDate: Date }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const user = await verifyTokenAndReturnCookies();
      const userId = user?.userId;
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/expenses/${userId}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleAddExpense = async () => {
    try {
      const user = await verifyTokenAndReturnCookies();
      const userId = user?.userId;

      const data = {
        userId,
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_PORT}/expenses`, data);
      console.log(response.data.message);
      setNewExpense({ name: "", amount: "", category: "", date: "" });
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_PORT}/expenses/${id}`);
      console.log(response.data.message);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEditExpense = (id: number) => {
    const expense = expenses.find((exp) => exp.id === id);
    if (expense) {
      setNewExpense({
        name: expense.name,
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date,
      });
    }
  };

  const totalExpenses = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.createdAt);
    return expenseDate >= filterDate.startDate && expenseDate <= filterDate.endDate;
  });

  const expensesByDate = filteredExpenses.reduce((acc: { [key: string]: { date: string; amount: number } }, expense) => {
    const expenseDate = new Date(expense.date);
    const dateString = expenseDate.toISOString().split("T")[0];
    if (!acc[dateString]) acc[dateString] = { date: dateString, amount: 0 };
    acc[dateString].amount += expense.amount;
    return acc;
  }, {});

  const chartData = Object.values(expensesByDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: entry.date,
      amount: entry.amount,
    }));

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Expense</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter expense name"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter expense amount"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Rent", "Groceries", "Electricity Bill", "Dining Out", "Car Payment"].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-col items-start w-full h-auto">
                        <span className="font-semibold uppercase text-[0.65rem]">Date</span>
                        <span className="font-normal">
                          {newExpense.date ? new Date(newExpense.date).toLocaleDateString() : "Select date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 max-w-[276px]">
                      <Calendar
                        mode="single"
                        selected={newExpense.date ? new Date(newExpense.date) : undefined}
                        onSelect={(date) =>
                          setNewExpense({
                            ...newExpense,
                            date: date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10) : "",
                          })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddExpense}>Add Expense</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expense Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg p-4">
                  <h3 className="text-lg font-bold">Total Expenses</h3>
                  <p className="text-4xl font-bold">${totalExpenses.toFixed(2)}</p>
                </div>
                <div className="rounded-lg p-4">
                  <h3 className="text-lg font-bold">Filter by Date</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-col items-start w-full h-auto">
                        <span className="font-semibold uppercase text-[0.65rem]">Date</span>
                        <span className="font-normal">
                          {filterDate.startDate.toLocaleDateString()} -{filterDate.endDate.toLocaleDateString()}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 max-w-[276px]">
                      <Calendar
                        mode="range"
                        selected={{ from: filterDate.startDate, to: filterDate.endDate }}
                        onSelect={(range) => {
                          if (range?.from && range?.to) {
                            setFilterDate({ startDate: range.from, endDate: range.to });
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
            <Card className="flex-1 mt-6">
        <CardHeader>
          <CardTitle>Expense Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart width={600} height={400} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
          </Card>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Expense List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.name}</TableCell>
                    <TableCell>${expense.amount}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" onClick={() => handleEditExpense(expense.id)}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeleteExpense(expense.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    
    </div>
  );
}

