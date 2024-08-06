import { useState } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function Meeting() {
  const [selectedTime, setSelectedTime] = useState("23:55"); // 24-hour format without seconds
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [email, setEmail] = useState("");
  
  const handleBookMeeting = async () => {
      if (!selectedDate) {
          alert("Please select a date.");
          return;
        }
        
        const dateTime = `${selectedDate.toISOString().split("T")[0]}T${selectedTime}:00`;
        const duration = 25; // fixed duration
        console.log(dateTime, duration , email);
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PORT}/api/create-meeting`, {
        dateTime,
        duration,
        email,
      });
      alert(`Meeting link: ${response.data.meetingLink}`);
    } catch (error) {
      console.error(error);
      alert("Error creating meeting");
    }
  };
  

  return (
    <div className="flex container max-w-6xl h-screen">
      <div className="flex flex-col items-center justify-center gap-6 bg-muted p-8 sm:p-12 md:p-16">
        <Avatar className="h-24 w-24 border">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>DV</AvatarFallback>
        </Avatar>
        <div className="grid gap-1 text-center">
          <h3 className="text-2xl font-semibold">Devdeep</h3>
          <p className="text-muted-foreground">Book a call to discuss your project requirements.</p>
        </div>
        <div className="grid w-full gap-4">
          <div className="flex items-center gap-2">
            <Checkbox id="confirmation" defaultChecked />
            <Label htmlFor="confirmation">Requires confirmation</Label>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" defaultValue="25 mins" readOnly />
            </div>
            <div className="flex-1">
              <Label htmlFor="platform">Platform</Label>
              <Select defaultValue="google-meet">
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google-meet">Google Meet</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="microsoft-teams">Microsoft Teams</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="UTC">
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
                <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                <SelectItem value="CET">Central European Time (CET)</SelectItem>
                <SelectItem value="IST">India Standard Time (IST)</SelectItem>
                <SelectItem value="JST">Japan Standard Time (JST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-1">
          <Label htmlFor="email">Your Email</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
        </div>
        <Button onClick={handleBookMeeting}>Book Meeting</Button>
      </div>
      <div className="flex-1 bg-background p-8 sm:p-12 md:p-16">
        <Calendar
          initialFocus
          mode="single"
          numberOfMonths={1}
          className="[&_td]:w-12 [&_td]:h-12 [&_th]:w-12 [&_th]:h-12 [&>div]:space-x-0 [&>div]:gap-4"
          onSelect={(date: any | null) => setSelectedDate(date)}
        />
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Selected Time and Date</h4>
          <div className="text-2xl">{selectedTime}</div>
          <div className="text-2xl">{selectedDate?.toLocaleDateString()}</div>
        </div>
        </div>
        <div className="flex-1 bg-background p-8 sm:p-12 md:p-16">
        <div className="mt-4 grid gap-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Available times</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                12h
              </Button>
              <Button variant="outline" size="sm">
                24h
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedTime("09:00")}>
              9:00 AM
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedTime("09:30")}>
              9:30 AM
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedTime("10:00")}>
              10:00 AM
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedTime("10:30")}>
              10:30 AM
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedTime("11:00")}>
              11:00 AM
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedTime("11:30")}>
              11:30 AM
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedTime("12:00")}>
              12:00 PM
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedTime("12:30")}>
              12:30 PM
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedTime("13:00")}>
              1:00 PM
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
