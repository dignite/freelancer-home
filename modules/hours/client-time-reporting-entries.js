import React from "react";
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

export const ClientTimeReportingEntries = ({ entries }) => (
  <>
    <Heading>Client Time Reporting</Heading>
    {entries.length ? (
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader alignRight>Hours</TableHeader>
            <TableHeader>Comment</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableData>{entry.date}</TableData>
              <TableData alignRight>{entry.hours}</TableData>
              <TableData alignRight>
                {entry.comment.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </TableData>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableData>Total</TableData>
            <TableData alignRight colSpan={2}>
              {entries.reduce(
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
