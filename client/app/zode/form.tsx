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
import { CalendarIcon, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// @ts-expect-error - 'success' is not part of ToastVariant, but we want to support it
const formSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  department: z.string().nonempty("Department is required"),
  role: z.string().min(1, "Role is required"),
  date_of_joining: z.string().nonempty("Date of Joining is required"),
});

type FormData = z.infer<typeof formSchema>;

type ToastVariant = "default" | "destructive" | "success"; // Add 'success'
export default function Form() {
  const { toast } = useToast();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:6969/users/add_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "🎉 Success!",
          description: "Form submitted successfully. Your data has been saved.",
          variant: "success" as ToastVariant,
          className:'text-black'
        });
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md bg-neutral-900 p-6 rounded-lg shadow-lg"
      >
        {/* First and Last Name */}
        <div className="grid grid-cols-2 gap-4">
          {["first_name", "last_name"].map((field, idx) => (
            <div key={idx}>
              <label htmlFor={field} className="block text-sm font-medium text-white">
                {field.split("_").join(" ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
              <Input
                {...register(field as keyof FormData)}
                placeholder={field.split("_").join(" ")}
                className="bg-transparent text-white border border-neutral-700"
              />
              {errors[field] && (
                <p className="text-red-500 text-xs mt-1">{errors[field as keyof FormData]?.message}</p>
              )}
            </div>
          ))}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Email
          </label>
          <Input
            {...register("email")}
            placeholder="Email"
            className="bg-transparent text-white border border-neutral-700"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-white">
            Phone Number
          </label>
          <Input
            {...register("phone_number")}
            placeholder="Phone Number"
            className="bg-transparent text-white border border-neutral-700"
          />
          {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>}
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-white">
            Department
          </label>
          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="w-full bg-transparent text-white border border-neutral-700">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {["HR", "Engineering", "Marketing"].map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-white">
            Role
          </label>
          <Input
            {...register("role")}
            placeholder="Role"
            className="bg-transparent text-white border border-neutral-700"
          />
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
        </div>

        {/* Date of Joining */}
        <div>
          <label htmlFor="date_of_joining" className="block text-sm font-medium text-white">
            Date of Joining
          </label>
          <Controller
            control={control}
            name="date_of_joining"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent text-white border border-neutral-700"
                  >
                    {field.value ? format(new Date(field.value), "yyyy-MM-dd") : "Pick a date"}
                    <CalendarIcon className="ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }
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
          aria-busy={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader className="animate-spin" size={16} />
              <span>Submitting...</span>
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
}
