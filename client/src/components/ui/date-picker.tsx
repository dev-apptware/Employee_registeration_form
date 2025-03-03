import React from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import dayjs from 'dayjs';
// CSS is imported in index.css

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | null) => void;
  disabledDate?: (date: Date) => boolean;
  placeholder?: string;
  className?: string;
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ value, onChange, disabledDate, placeholder = "Select date", className = "" }, ref) => {
    // Convert Date to dayjs for Ant DatePicker
    const dayjsValue = value ? dayjs(value) : undefined;

    // Handle Ant DatePicker onChange (returns dayjs object)
    const handleChange = (date: dayjs.Dayjs | null) => {
      if (onChange) {
        onChange(date ? date.toDate() : null);
      }
    };

    // Convert disabledDate function to work with dayjs
    const disabledDayjs = disabledDate
      ? (date: dayjs.Dayjs) => disabledDate(date.toDate())
      : undefined;

    return (
      <div ref={ref} className={className}>
        <AntDatePicker
          style={{ width: '100%' }}
          value={dayjsValue}
          onChange={handleChange}
          disabledDate={disabledDayjs}
          placeholder={placeholder}
          format="DD/MM/YYYY"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        />
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
