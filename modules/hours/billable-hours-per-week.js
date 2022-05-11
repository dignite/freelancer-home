import {
  Heading,
  Table,
  TableData,
  TableHeader,
  TableRow,
} from "../layout/vertical-rhythm";

export const BillableHoursPerWeek = ({ hours }) => (
  <>
    <Heading>Total billable hours per week</Heading>
    <Table>
      <TableRow>
        <TableHeader>Week</TableHeader>
        <TableHeader>Hours</TableHeader>
      </TableRow>
      {Object.keys(hours.totalBillableHoursPerWeek).map((week) => (
        <TableRow key={week}>
          <TableData>{week}</TableData>
          <TableData>{hours.totalBillableHoursPerWeek[week]}</TableData>
        </TableRow>
      ))}
      <TableRow>
        <TableData>Total</TableData>
        <TableData>{hours.totalBillableHours}</TableData>
      </TableRow>
    </Table>
  </>
);
