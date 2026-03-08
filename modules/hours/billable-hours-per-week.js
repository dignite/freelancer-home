import {
  Heading,
  Table,
  TableBody,
  TableData,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../layout/vertical-rhythm";

export const BillableHoursPerWeek = ({ hours }) => (
  <>
    <Heading>Total billable hours per week</Heading>
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Week</TableHeader>
          <TableHeader alignRight>Hours</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {(() => {
          const keys = Object.keys(hours.totalBillableHoursPerWeek);
          const nums = keys.map((w) => parseInt(w.slice(1)));
          const hasYearBoundary = Math.max(...nums) > 46 && Math.min(...nums) < 7;
          const n = (w) => { const v = parseInt(w.slice(1)); return hasYearBoundary && v > 26 ? v - 53 : v; };
          return keys.sort((a, b) => n(a) - n(b)).map((week) => (
            <TableRow key={week}>
              <TableData>{week}</TableData>
              <TableData alignRight>
                {hours.totalBillableHoursPerWeek[week]}
              </TableData>
            </TableRow>
          ));
        })()}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableData>Total</TableData>
          <TableData alignRight>{hours.totalBillableHours}</TableData>
        </TableRow>
      </TableFooter>
    </Table>
  </>
);
