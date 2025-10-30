import PropTypes from "prop-types";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { parse, format } from "date-fns";

const DatePicker = ({
  value,
  onChange,
  placeholder = "MM-DD-YYYY",
  disabledPast = true,
  toYear = 2100,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const parsed = value ? parse(value, "yyyy-MM-dd", new Date()) : null;

  return (
    <div className="relative">
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex items-center justify-between focus:outline-none"
          >
            <span>{parsed ? format(parsed, "MM-dd-yyyy") : placeholder}</span>
            <CalendarIcon size={18} className="text-gray-500" />
          </button>
        </Popover.Trigger>
        <Popover.Content
          className="bg-white p-2 rounded-md shadow-md border border-gray-200 z-[10000]"
          align="start"
        >
          <DayPicker
            key={
              isOpen ? (parsed ? format(parsed, "yyyy-MM") : "open") : "closed"
            }
            mode="single"
            selected={parsed ?? undefined}
            defaultMonth={parsed ?? new Date()}
            onSelect={(date) => {
              if (date) {
                onChange(format(date, "yyyy-MM-dd"));
                setIsOpen(false);
              }
            }}
            captionLayout="dropdown"
            fromYear={new Date().getFullYear()}
            toYear={toYear}
            disabled={disabledPast ? { before: new Date() } : undefined}
          />
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabledPast: PropTypes.bool,
  fromYear: PropTypes.number,
  toYear: PropTypes.number,
};

export default DatePicker;
