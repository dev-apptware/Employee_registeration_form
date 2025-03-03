import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import { submitEmployeeData, getAllEmployees } from "@/lib/api";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const SKILLS_OPTIONS = [
  "JAVA",
  "PYTHON",
  "JAVASCRIPT",
  "REACT",
  "NODE.JS",
  "DEVOPS",
  "AWS",
  "DOCKER",
];

const DEPARTMENTS = [
  "HR",
  "SALES",
  "DESIGN",
  "ACCOUNTS",
  "MARKETING",
  "OPERATIONS",
  "TECHNOLOGY",
];

export default function EmployeeForm() {
  const { toast } = useToast();
  const [existingEmployees, setExistingEmployees] = useState([]);
  const [manualManagerId, setManualManagerId] = useState(true);
  const [, setLocation] = useLocation();

  const form = useForm({
    defaultValues: {
      primarySkills: [],
      secondarySkills: [],
    },
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employees = await getAllEmployees();
        setExistingEmployees(employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const validateForm = (data) => {
    const errors = {};

    if (!data.officeEmail.endsWith('@apptware.com')) {
      errors.officeEmail = 'Office email must use the @apptware.com domain';
    }

    if (!/^\d{10}$/.test(data.contactNumber)) {
      errors.contactNumber = 'Contact number must be exactly 10 digits';
    }

    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }
  };

  const onSubmit = async (data) => {
    try {
      validateForm(data);
      await submitEmployeeData(data);

      setLocation("/thank-you");

    } catch (error) {
      let errorMessage = error.message;
      try {
        const parsedErrors = JSON.parse(error.message);
        errorMessage = Object.values(parsedErrors)[0];
      } catch (e) {
        // Use the original error message if it's not a validation error
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Employee Registration Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="officeEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@apptware.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PP")
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

                <FormField
                  control={form.control}
                  name="dateOfJoining"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Joining</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PP")
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
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalYrExp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.5"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primarySkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Skills</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={SKILLS_OPTIONS}
                          selectedValues={field.value}
                          onChange={field.onChange}
                          placeholder="Select primary skills"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondarySkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Skills</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={SKILLS_OPTIONS}
                          selectedValues={field.value}
                          onChange={field.onChange}
                          placeholder="Select secondary skills"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant={manualManagerId ? "default" : "outline"}
                      onClick={() => setManualManagerId(true)}
                    >
                      Enter Manager ID
                    </Button>
                    <Button
                      type="button"
                      variant={!manualManagerId ? "default" : "outline"}
                      onClick={() => setManualManagerId(false)}
                    >
                      Select Manager
                    </Button>
                  </div>

                  {manualManagerId ? (
                    <FormField
                      control={form.control}
                      name="reportingManager"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reporting Manager ID</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                              placeholder="Enter manager ID"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="reportingManager"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Reporting Manager</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value, 10))}
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a manager" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {existingEmployees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                  {employee.name} (ID: {employee.id})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}