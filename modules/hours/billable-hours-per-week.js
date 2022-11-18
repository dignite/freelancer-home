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
          <TableHeader>Hours</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(hours.totalBillableHoursPerWeek).map((week) => (
          <TableRow key={week}>
            <TableData>{week}</TableData>
            <TableData>{hours.totalBillableHoursPerWeek[week]}</TableData>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableData>Total</TableData>
          <TableData>{hours.totalBillableHours}</TableData>
        </TableRow>
      </TableFooter>
    </Table>
  </>
);
