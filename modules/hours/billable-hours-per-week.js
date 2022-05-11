import {
  Heading,
  Table,
  TableData,
  TableHeader,
  TableRow,
} from "../layout/vertical-rhythm";

export const BillableHoursPerWeek = ({ meta }) => (
  <>
    <Heading>Total billable hours per week</Heading>
    <Table>
      <TableRow>
        <TableHeader>Week</TableHeader>
        <TableHeader>Hours</TableHeader>
      </TableRow>
      {Object.keys(meta.totalBillableHoursPerWeek).map((week) => (
        <TableRow key={week}>
          <TableData>{week}</TableData>
          <TableData>{meta.totalBillableHoursPerWeek[week]}</TableData>
        </TableRow>
      ))}
      <TableRow>
        <TableData>Total</TableData>
        <TableData>{meta.totalBillableHours}</TableData>
      </TableRow>
    </Table>
  </>
);
