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
      onClick={async () => {
        const allWeeks = Object.keys(hours.totalBillableHoursPerWeek)
          .sort()
          .map((week) => `${week}:  ${hours.totalBillableHoursPerWeek[week].toFixed(1)}h`);
        const lines = [
          `${formattedFirstDayOfMonth} - ${formattedLastDayOfMonth}`,
          ...allWeeks,
          `Total: ${hours.totalBillableHours.toFixed(1)}h`,
        ];
        try {
          await navigator.clipboard.writeText(lines.join("\n"));
          setChecked(true);
        } catch (error) {
          console.error("Failed to copy to clipboard:", error);
        }
      }}
    >
      {checked ? "Copied to clipboard ✓" : "Copy to clipboard"}
    </Button>
  );
};
