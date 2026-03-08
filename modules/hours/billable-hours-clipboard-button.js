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
        const allWeeks = Object.keys(hours.totalBillableHoursPerWeek)
          .sort()
          .map((week) => `${week}:  ${hours.totalBillableHoursPerWeek[week].toFixed(1)}h`);
        const lines = [
          `${formattedFirstDayOfMonth} - ${formattedLastDayOfMonth}`,
          ...allWeeks,
          `Total: ${hours.totalBillableHours.toFixed(1)}h`,
        ];
        navigator.clipboard.writeText(lines.join("\n"));
        setChecked(true);
      }}
    >
      {checked ? "Copied to clipboard ✓" : "Copy to clipboard"}
    </Button>
  );
};
