import {
  Heading,
  Paragraph,
  Table,
  TableBody,
  TableData,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../layout/vertical-rhythm";

export const VAB = ({ vab, startDate, endDate }) => (
  <>
    <Heading>
      VAB between {startDate} and {endDate}
    </Heading>
    {vab.length ? (
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader alignRight>Hours</TableHeader>
            <TableHeader>Comment</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {vab.map((vabDay) => (
            <TableRow key={vabDay.id}>
              <TableData>{vabDay.date}</TableData>
              <TableData alignRight>{vabDay.hours}</TableData>
              <TableData>{vabDay.comment}</TableData>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableData>Total</TableData>
            <TableData alignRight colSpan={2}>
              {vab.reduce(
                (accumulator, currentValue) => accumulator + currentValue.hours,
                0
              )}
            </TableData>
          </TableRow>
        </TableFooter>
      </Table>
    ) : (
      <Paragraph>None</Paragraph>
    )}
  </>
);
