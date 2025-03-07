import * as React from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Employee {
  id: string | number;  // Allow both string and number IDs
  name: string;
  designation: string;
  department: string;
}

interface ManagerSelectorProps {
  employees: Employee[];
  selectedManagerId: string | number | null;
  onChange: (managerId: string | number | null) => void;
  placeholder?: string;
}

export function ManagerSelector({
  employees,
  selectedManagerId,
  onChange,
  placeholder = "Select a reporting manager...",
}: ManagerSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  // Handle both string and number IDs
  const selectedManager = employees.find((employee) => employee.id == selectedManagerId); // Using == for loose equality check
  
  // Filter employees based on search query
  const filteredEmployees = React.useMemo(() => {
    if (!searchQuery) return employees;
    
    return employees.filter((employee) => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedManager ? (
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4 shrink-0 opacity-70" />
              <span>
                {selectedManager.name} - {selectedManager.designation} ({selectedManager.department})
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search by name..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No managers found.</CommandEmpty>
          <CommandGroup className="max-h-[320px] overflow-y-auto">
            {(searchQuery ? filteredEmployees : employees.slice(0, 8)).map((employee) => (
              <CommandItem
                key={employee.id}
                onSelect={() => {
                  onChange(employee.id == selectedManagerId ? null : employee.id);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedManagerId == employee.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{employee.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {employee.designation} ({employee.department})
                  </span>
                </div>
              </CommandItem>
            ))}
            {!searchQuery && employees.length > 8 && (
              <div className="py-2 px-3 text-sm text-muted-foreground border-t">
                {employees.length - 8} more managers available. Use search to find them.
              </div>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
