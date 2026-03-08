import { useState } from "react";
import { Button } from "../layout/vertical-rhythm";

export const BillableHoursClipboardButton = ({
  hours,
  formattedFirstDayOfMonth,
  formattedLastDayOfMonth,
}) => {
  const [checked, setChecked] = useState(false);
  return (
    <Button
      onClick={() => {
        const keys = Object.keys(hours.totalBillableHoursPerWeek);
        const nums = keys.map((w) => parseInt(w.slice(1)));
        const hasYearBoundary = Math.max(...nums) > 46 && Math.min(...nums) < 7;
        const n = (w) => { const v = parseInt(w.slice(1)); return hasYearBoundary && v > 26 ? v - 53 : v; };
        const allWeeks = keys
          .sort((a, b) => n(a) - n(b))
          .map((week) => `${week}:  ${hours.totalBillableHoursPerWeek[week]}h`);
        const lines = [
          `${formattedFirstDayOfMonth} - ${formattedLastDayOfMonth}`,
          ...allWeeks,
          `Total: ${hours.totalBillableHours}h`,
        ];
        navigator.clipboard.writeText(lines.join("\n"));
        setChecked(true);
      }}
    >
      {checked ? "Copied to clipboard ✓" : "Copy to clipboard"}
    </Button>
  );
};
