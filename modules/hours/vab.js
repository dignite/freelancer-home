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

export const VAB = ({ vab }) => (
  <>
    <Heading>VAB for the month</Heading>
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Date</TableHeader>
          <TableHeader>Hours</TableHeader>
          <TableHeader>Comment</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {vab.map((vabDay) => (
          <TableRow key={vabDay.id}>
            <TableData>{vabDay.date}</TableData>
            <TableData>???</TableData>
            <TableData>{vabDay.comment}</TableData>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableData>Total</TableData>
          <TableData colSpan={2}>???</TableData>
        </TableRow>
      </TableFooter>
    </Table>
  </>
);
