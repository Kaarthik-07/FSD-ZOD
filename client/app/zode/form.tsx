'use client';

import React, { useState } from "react";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast"
// Zod schema for form validation
const formSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  department: z.string().nonempty("Department is required"),
  role: z.string().min(1, "Role is required"),
  date_of_joining: z.string().nonempty("Birthdate is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function Form() {
  const { toast } = useToast(); // Access the toast function from Shadcn
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false); // Loading state

const onSubmit = async (data: FormData) => {
  setLoading(true); // Start loading
  try {
    const response = await fetch('http://localhost:6969/users/add_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

      console.log(data);
    if (response.ok) {
      toast({
        title: "🎉 Success!",
        description: "Form submitted successfully. Your data has been saved.",
        variant: "success",
        className:'text-white'
      });
    } else {
      toast({
        title: "🚨 Error",
        description: "Something went wrong while submitting the form.",
        variant: "destructive",
      });
    }
  }
catch (error) {
  console.error('Error submitting form:', error); // Optional logging for debugging
  toast({
    title: "❌ Network Error",
    description: "Failed to submit form. Please check your internet connection.",
    variant: "destructive",
  });
}
  } finally {
    setLoading(false); // Stop loading
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6 w-full max-w-md bg-neutral-900 p-6 rounded-lg shadow-lg"
      >
        
        {/* First Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-white">First Name</label>
            <Input
              {...register("first_name")}
              placeholder="First Name"
              className="bg-transparent text-white border border-neutral-700"
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-white">Last Name</label>
            <Input
              {...register("last_name")}
              placeholder="Last Name"
              className="bg-transparent text-white border border-neutral-700"
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
          <Input
            {...register("email")}
            placeholder="Email"
            className="bg-transparent text-white border border-neutral-700"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-white">Phone Number</label>
          <Input
            {...register("phone_number")}
            placeholder="Phone Number"
            className="bg-transparent text-white border border-neutral-700"
          />
          {errors.phone_number && (
            <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-white">Department</label>
          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="w-full bg-transparent text-white border border-neutral-700">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.department && (
            <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-white">Role</label>
          <Input
            {...register("role")}
            placeholder="Role"
            className="bg-transparent text-white border border-neutral-700"
          />
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* date_of_joining */}
        <div>
          <label htmlFor="date_of_joining" className="block text-sm font-medium text-white">Birthdate</label>

<Controller
  control={control}
  name="date_of_joining"
  render={({ field }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full bg-transparent text-white border border-neutral-700">
          {field.value ? format(new Date(field.value), "yyyy-MM-dd") : "Pick a date"}
          <CalendarIcon className="ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={field.value ? new Date(field.value) : undefined}
          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} // Change format here
        />
      </PopoverContent>
    </Popover>
  )}
/>

          {errors.date_of_joining && (
            <p className="text-red-500 text-xs mt-1">{errors.date_of_joining.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-white hover:bg-white/50 text-black" 
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
