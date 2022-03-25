import {
  Heading,
  Table,
  TableData,
  TableHeader,
  TableRow,
} from "../layout/vertical-rhythm";

export const UnbilledHoursPerWeek = ({ meta }) => (
  <>
    <Heading>Total unbilled hours per week</Heading>
    <Table>
      <TableRow>
        <TableHeader>Week</TableHeader>
        <TableHeader>Hours</TableHeader>
      </TableRow>
      {Object.keys(meta.totalUnbilledHoursPerWeek).map((week) => (
        <TableRow key={week}>
          <TableData>{week}</TableData>
          <TableData>{meta.totalUnbilledHoursPerWeek[week]}</TableData>
        </TableRow>
      ))}
      <TableRow>
        <TableData>Total</TableData>
        <TableData>{meta.totalUnbilledHours}</TableData>
      </TableRow>
    </Table>
  </>
);
