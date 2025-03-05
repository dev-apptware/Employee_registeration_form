import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import { SkillSelector, SKILL_CATEGORIES } from "@/components/ui/skill-selector";
import { ManagerSelector } from "@/components/ui/manager-selector";
import { submitEmployeeData, getAllEmployees } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";

const SKILLS_OPTIONS = [

  
  // Frontend Department
  "REACT",
  "JAVASCRIPT",
  "VUE",
  "REACT NATIVE",
  "FLUTTER",
  "ANDROID NATIVE",
  "ANGULAR",
  "TYPESCRIPT",
  "HTML/CSS",
  "TAILWIND",
  "NEXT.JS",
  "REDUX",
  "SCSS",
  "LESS",
  "D3JS",

  
  // Backend Department
  "PYTHON",
  "NODEJS",
  "EXPRESSJS",
  "MONGODB",
  "MYSQL",
  "POSTGRESQL",
  "JAVA",
  "WEB SERVICES (REST, SOAP)",
  "MICROSERVICES",
  "DESIGN PATTERNS",
  "OOPS",
  "SERVERLESS ARCHITECTURE",
  "SPRING FRAMEWORK",
  "SPRING BOOT",
  "JDBC",
  "MAVEN",
  "JUNIT",
  "MOCKITO",
  "DJANGO",
  "FLASK",
  "FASTAPI",
  "WEB SOCKETS",
  "ELASTICSEARCH",
  "ETL",
  "REDIS",
  "RABBITMQ",
  "GRAPHDB (NEO4J)",
  "GRADLE",
  
  // DevOps Department
  "LINUX",
  "GIT",
  "AWS",
  "TERRAFORM",
  "ANSIBLE",
  "DOCKER",
  "KUBERNETES",
  "JENKINS",
  "GITHUB ACTIONS",
  "PROMETHEUS",
  "GRAFANA",
  "AZURE",
  "GCP",
  
  // Artificial Intelligence Department
  "MACHINE LEARNING",
  "DEEP LEARNING",
  "GENERATIVE AI",
  "RAG",
  "VECTORDB",
  "LLM",
  "KNOWLEDGE GRAPHS",
  "AI AGENTS",
  "COMPUTER VISION",
  "NLP",
  "EDA (EXPLORATORY DATA ANALYSIS)",
  
  // Project Delivery Department
  "AGILE (SCRUM, KANBAN)",
  "WATERFALL",
  "JIRA",
  "LINEAR",
  "MS PROJECT",
  "RISK MANAGEMENT",
  "REPORTING & DOCUMENTATION",

  // Design Department
  "PHOTOSHOP",
  "ILLUSTRATOR",
  "INDESIGN",
  "SKETCH",
  "FIGMA",
  "UI/UX DESIGN",
  "GRAPHIC DESIGN",
  "DIGITAL ILLUSTRATION",
  "ANIMATION",
  "VIDEO EDITING",
  "INTERACTION DESIGN",
  "WIREFRAMING",
  "PROTOTYPING",
  "DESIGN SYSTEMS",
  "VISUAL DESIGN",
  "TYPOGRAPHY",
  "ACCESSIBILITY",
  "MOTION UI",
  "BRANDING",
  "FRONTEND HANDOFF",
  "LOTTIE",
  "PRODUCT RESEARCH",

  // Marketing Department
  "DIGITAL MARKETING",
  "SEO",
  "SOCIAL MEDIA MARKETING",
  "CONTENT MARKETING",
  "EMAIL MARKETING",
  "MARKETING ANALYTICS",
  "BRAND MANAGEMENT",
  "CAMPAIGN MANAGEMENT",
  "COPYWRITING",
  "VIDEO PRODUCTION",

  // Sales Department
  "SALES STRATEGY",
  "ACCOUNT MANAGEMENT",
  "LEAD GENERATION",
  "NEGOTIATION",
  "CUSTOMER RELATIONSHIP MANAGEMENT",
  "SALES ANALYTICS",
  "PRODUCT DEMONSTRATION",
  "PUBLIC SPEAKING",
  "PERSUASIVE COMMUNICATION",

  // HR Department
  "RECRUITMENT",
  "Talent Acquisition",
  "EMPLOYEE ENGAGEMENT",
  "PERFORMANCE MANAGEMENT",
  "TRAINING AND DEVELOPMENT",
  "LABOR LAWS",
  "COMPENSATION AND BENEFITS",
  "WORKPLACE SAFETY",
  "DIVERSITY AND INCLUSION",

  // Accounts Department
  "FINANCIAL ANALYSIS",
  "ACCOUNTING SOFTWARE",
  "TAXATION",
  "AUDITING",
  "FINANCIAL REPORTING",
  "BUDGETING",
  "COST ACCOUNTING",
  "FINANCIAL PLANNING",
  "BOOKKEEPING",

  // Operations Department
  "SUPPLY CHAIN MANAGEMENT",
  "PROJECT MANAGEMENT",
  "OPERATIONAL EFFICIENCY",
  "QUALITY CONTROL",
  "LOGISTICS MANAGEMENT",
  "PROCUREMENT",
  "INVENTORY MANAGEMENT",
  "BUSINESS PROCESS IMPROVEMENT",
  "CHANGE MANAGEMENT",


];

const DEPARTMENTS = [
  "HR",
  "SALES",
  "DESIGN",
  "ACCOUNTS",
  "MARKETING",
  "OPERATIONS",
  "FRONTEND",
  "BACKEND",
  "DEVOPS",
  "ARTIFICIAL INTELLIGENCE",
  "PROJECT DELIVERY",
];

// Map departments to skill categories that are relevant
const DEPARTMENT_TO_SKILL_CATEGORIES = {
  'DESIGN': ['DESIGN'],
  'MARKETING': ['MARKETING'],
  'SALES': ['SALES'],
  'HR': ['HR'],
  'ACCOUNTS': ['ACCOUNTS'],
  'OPERATIONS': ['OPERATIONS'],
  'FRONTEND': ['FRONTEND'], // Use the FRONTEND skill category for the FRONTEND department
  'BACKEND': ['BACKEND'], // Use the BACKEND skill category for the BACKEND department
  'DEVOPS': ['DEVOPS'], // Use the DEVOPS skill category for the DEVOPS department
  'ARTIFICIAL INTELLIGENCE': ['AI'], // Use the AI skill category for the ARTIFICIAL INTELLIGENCE department
  'PROJECT DELIVERY': ['PROJECT_DELIVERY'] // Use the PROJECT_DELIVERY skill category for the PROJECT DELIVERY department
};

// Map frontend technical departments to TECHNOLOGY for backend submission
const DEPARTMENT_TO_BACKEND_VALUE = {
  'FRONTEND': 'TECHNOLOGY',
  'BACKEND': 'TECHNOLOGY',
  'DEVOPS': 'TECHNOLOGY',
  'ARTIFICIAL INTELLIGENCE': 'TECHNOLOGY'
};

export default function EmployeeForm() {
  const { toast } = useToast();
  const [existingEmployees, setExistingEmployees] = useState([]);
  const [, setLocation] = useLocation();
  const [currentDepartment, setCurrentDepartment] = useState('');

  const form = useForm({
    defaultValues: {
      name: "",
      contactNumber: "",
      officeEmail: "",
      personalEmail: "",
      employeeId: "",
      totalYrExp: "",
      designation: "",
      department: "",
      primarySkills: [],
      secondarySkills: [],
      reportingManager: "",
      dateOfJoining: null,
      dateOfBirth: null,
    },
    // Add default validation rules
    resolver: async (values) => {
      const errors = {};

      // Validate full name (only letters, spaces, and some special characters)
      if (values.name && !/^[A-Za-z\s.'\-]+$/.test(values.name)) {
        errors.name = {
          type: 'pattern',
          message: 'Name should contain only letters, spaces, and characters like . or \''
        };
      }

      // Validate contact number (exactly 10 digits)
      if (values.contactNumber && !/^\d{10}$/.test(values.contactNumber)) {
        errors.contactNumber = {
          type: 'pattern',
          message: 'Contact number must be exactly 10 digits'
        };
      }

      // Validate employeeId (positive integer)
      if (values.employeeId && (parseInt(values.employeeId) <= 0 || !Number.isInteger(parseFloat(values.employeeId)))) {
        errors.employeeId = {
          type: 'min',
          message: 'Employee ID must be a positive integer'
        };
      }

      // Validate years of experience (positive number)
      if (values.totalYrExp && parseFloat(values.totalYrExp) < 0) {
        errors.totalYrExp = {
          type: 'min',
          message: 'Years of experience cannot be negative'
        };
      }

      // Validate designation (only letters, spaces, and some special characters)
      if (values.designation && !/^[A-Za-z\s.'\-]+$/.test(values.designation)) {
        errors.designation = {
          type: 'pattern',
          message: 'Designation should contain only letters, spaces, and characters like . or \''
        };
      }

      // Validate reporting manager ID if provided
      if (values.reportingManager && (parseInt(values.reportingManager) <= 0 || !Number.isInteger(parseFloat(values.reportingManager)))) {
        errors.reportingManager = {
          type: 'min',
          message: 'Manager ID must be a positive integer'
        };
      }

      return {
        values,
        errors
      };
    }
  });

  const primarySkills = form.watch('primarySkills') || [];
  const secondarySkills = form.watch('secondarySkills') || [];
  const department = form.watch('department');

  // Update current department when it changes
  useEffect(() => {
    if (department) {
      setCurrentDepartment(department);
    }
  }, [department]);

  // Determine relevant skill categories based on department
  const relevantSkillCategories = useMemo(() => {
    // If no department is selected yet, show all categories
    if (!currentDepartment) return Object.keys(SKILL_CATEGORIES);

    // Return categories for the selected department
    return DEPARTMENT_TO_SKILL_CATEGORIES[currentDepartment] || Object.keys(SKILL_CATEGORIES);
  }, [currentDepartment]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employees = await getAllEmployees();
        console.log('Employees for dropdown:', employees);
        setExistingEmployees(employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load existing employees. Manager selection may be unavailable."
        });
      }
    };
    fetchEmployees();
  }, [toast]);

  const validateForm = (data) => {
    const errors = {};

    // Validate office email domain
    if (!data.officeEmail.endsWith('@apptware.com')) {
      errors.officeEmail = 'Office email must use the @apptware.com domain';
    }

    // Validate contact number format
    if (!/^\d{10}$/.test(data.contactNumber)) {
      errors.contactNumber = 'Contact number must be exactly 10 digits';
    }

    // Validate name format
    if (!/^[A-Za-z\s.'\-]+$/.test(data.name)) {
      errors.name = 'Name should contain only letters, spaces, and characters like . or \'';
    }

    // Validate employee ID
    if (parseInt(data.employeeId) <= 0 || !Number.isInteger(parseFloat(data.employeeId))) {
      errors.employeeId = 'Employee ID must be a positive integer';
    }

    // Validate years of experience
    if (parseFloat(data.totalYrExp) < 0) {
      errors.totalYrExp = 'Years of experience cannot be negative';
    }

    // Validate designation
    if (!/^[A-Za-z\s.'\-]+$/.test(data.designation)) {
      errors.designation = 'Designation should contain only letters, spaces, and characters like . or \'';
    }

    // Validate reporting manager ID if provided
    if (data.reportingManager && (parseInt(data.reportingManager) <= 0 || !Number.isInteger(parseFloat(data.reportingManager)))) {
      errors.reportingManager = 'Manager ID must be a positive integer';
    }

    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }
  };

  // Helper function to validate all required fields
  const validateRequiredFields = (data) => {
    const errors = {};
    
    // Check for required fields
    const requiredFields = [
      { field: 'name', message: 'Full name is required' },
      { field: 'contactNumber', message: 'Contact number is required' },
      { field: 'officeEmail', message: 'Office email is required' },
      { field: 'personalEmail', message: 'Personal email is required' },
      { field: 'dateOfJoining', message: 'Date of joining is required' },
      { field: 'dateOfBirth', message: 'Date of birth is required' },
      { field: 'employeeId', message: 'Employee ID is required' },
      { field: 'totalYrExp', message: 'Years of experience is required' },
      { field: 'designation', message: 'Designation is required' },
      { field: 'department', message: 'Department is required' },
      { field: 'reportingManager', message: 'Reporting manager is required' }
    ];

    requiredFields.forEach(({ field, message }) => {
      if (!data[field]) {
        errors[field] = message;
      }
    });
    
    // Check primary skills (required)
    if (!data.primarySkills || data.primarySkills.length === 0) {
      errors.primarySkills = 'At least one primary skill is required';
    }
    
    // Secondary skills are optional
    
    return errors;
  };

  const onSubmit = async (data) => {
    try {
      // Make a copy of the form data to avoid mutating the original data
      const submissionData = { ...data };
      
      // Map frontend technical departments to TECHNOLOGY for backend submission
      if (DEPARTMENT_TO_BACKEND_VALUE[submissionData.department]) {
        submissionData.department = DEPARTMENT_TO_BACKEND_VALUE[submissionData.department];
      }
      
      console.log('Original department:', data.department);
      console.log('Submission department:', submissionData.department);
      
      // Check for required fields first
      const requiredFieldErrors = validateRequiredFields(submissionData);
      if (Object.keys(requiredFieldErrors).length > 0) {
        throw new Error(JSON.stringify(requiredFieldErrors));
      }

      // Then perform other validations
      validateForm(submissionData);
      const result = await submitEmployeeData(submissionData);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setLocation("/thank-you");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to submit form",
        });
      }
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
                  rules={{
                    required: "Full name is required",
                    pattern: {
                      value: /^[A-Za-z\s.'\-]+$/,
                      message: "Name should contain only letters, spaces, and characters like . or '"
                    }
                  }}
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
                  rules={{
                    required: "Contact number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Contact number must be exactly 10 digits"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234567890"
                          {...field}
                          maxLength={10}
                          onKeyPress={(e) => {
                            // Allow only digits
                            if (!/\d/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="officeEmail"
                  rules={{
                    required: "Office email is required",
                    pattern: {
                      value: /.+@apptware\.com$/,
                      message: "Office email must use the @apptware.com domain"
                    }
                  }}
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
                  rules={{
                    required: "Personal email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address format"
                    }
                  }}
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
                  name="dateOfJoining"
                  rules={{
                    required: "Date of joining is required"
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Joining</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          disabledDate={(date) => date > new Date()}
                          placeholder="Select date of joining"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />





                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  rules={{
                    required: "Date of birth is required"
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          disabledDate={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          placeholder="Select date of birth"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeId"
                  rules={{
                    required: "Employee ID is required",
                    validate: (value) => {
                      const numValue = parseInt(value);
                      if (isNaN(numValue) || numValue <= 0 || !Number.isInteger(numValue)) {
                        return "Employee ID must be a positive integer";
                      }
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 0) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalYrExp"
                  rules={{
                    required: "Years of experience is required",
                    validate: (value) => {
                      const numValue = parseFloat(value);
                      if (isNaN(numValue) || numValue < 0) {
                        return "Years of experience cannot be negative";
                      }
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (value >= 0 || isNaN(value)) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />



                <FormField
                  control={form.control}
                  name="designation"
                  rules={{
                    required: "Designation is required",
                    pattern: {
                      value: /^[A-Za-z\s.'\-]+$/,
                      message: "Designation should contain only letters, spaces, and characters like . or '"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Senior Developer"
                          {...field}
                          onKeyPress={(e) => {
                            // Allow only letters, spaces, and specific special characters
                            if (!/[A-Za-z\s.'\-]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  rules={{
                    required: "Department is required"
                  }}
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

                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="primarySkills"
                    rules={{
                      required: "At least one primary skill is required",
                      validate: (value) => {
                        return (value && value.length > 0) || "At least one primary skill is required";
                      }
                    }}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormControl>
                          <SkillSelector
                            options={SKILLS_OPTIONS}
                            selectedValues={field.value}
                            onChange={field.onChange}
                            label="Primary Skills"
                            excludeList={secondarySkills}
                            filterCategories={relevantSkillCategories}
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
                      <FormItem className="space-y-1">
                        <FormControl>
                          <SkillSelector
                            options={SKILLS_OPTIONS}
                            selectedValues={field.value}
                            onChange={field.onChange}
                            label="Secondary Skills"
                            excludeList={primarySkills}
                            filterCategories={relevantSkillCategories}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="reportingManager"
                    rules={{
                      required: "Reporting manager is required"
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Reporting Manager</FormLabel>
                        <FormControl>
                          <ManagerSelector
                            employees={existingEmployees}
                            selectedManagerId={field.value}
                            onChange={field.onChange}
                            placeholder="Search and select a reporting manager..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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