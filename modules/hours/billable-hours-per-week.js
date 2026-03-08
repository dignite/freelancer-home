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
        {Object.keys(hours.totalBillableHoursPerWeek)
          .sort((a, b) => {
            const n = (w) => { const v = parseInt(w.slice(1)); return v > 26 ? v - 53 : v; };
            return n(a) - n(b);
          })
          .map((week) => (
          <TableRow key={week}>
            <TableData>{week}</TableData>
            <TableData alignRight>
              {hours.totalBillableHoursPerWeek[week]}
            </TableData>
          </TableRow>
        ))}
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
