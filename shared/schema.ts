import { pgTable, text, serial, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactNumber: text("contact_number").notNull(),
  officeEmail: text("office_email").notNull(),
  personalEmail: text("personal_email").notNull(),
  employeeId: numeric("employee_id").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  dateOfJoining: date("date_of_joining").notNull(),
  totalYrExp: numeric("total_yr_exp").notNull(),
  primarySkills: text("primary_skills").array().notNull(),
  secondarySkills: text("secondary_skills").array().notNull(),
  designation: text("designation").notNull(),
  department: text("department").notNull(),
  reportingManager: numeric("reporting_manager").notNull(),
});

export const insertEmployeeSchema = createInsertSchema(employees).extend({
  contactNumber: z.string().length(10, "Contact number must be 10 digits"),
  officeEmail: z.string().email("Invalid office email format"),
  personalEmail: z.string().email("Invalid personal email format"),
  employeeId: z.number().int().positive("Employee ID must be positive"),
  totalYrExp: z.number().min(0, "Experience cannot be negative"),
  primarySkills: z.array(z.string()).min(1, "Select at least one primary skill"),
  secondarySkills: z.array(z.string()),
  reportingManager: z.number().int().positive("Invalid manager ID"),
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;
