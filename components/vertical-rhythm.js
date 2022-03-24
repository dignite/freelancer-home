export const ApplicationContainer = ({ children }) => (
  <div>
    <style jsx>{`
      div {
        margin: var(--rhythm2);
      }
    `}</style>
    {children}
  </div>
);

export const MainHeading = ({ children }) => (
  <h1>
    <style jsx>{`
      h1 {
        margin-top: var(--rhythm3);
        line-height: calc(var(--rhythm3));
        padding-top: var(--typography__h1Offset);
        margin-bottom: calc(-1 * var(--typography__h1Offset));
      }
    `}</style>
    {children}
  </h1>
);

export const Heading = ({ children }) => (
  <h2>
    <style jsx>{`
      h2 {
        margin-top: var(--rhythm3);
        line-height: var(--rhythm2);
        padding-top: var(--typography__h2Offset);
        margin-bottom: calc(-1 * var(--typography__h2Offset));
      }
    `}</style>
    {children}
  </h2>
);

export const SubHeading = ({ children }) => (
  <h3>
    <style jsx>{`
      h3 {
        margin-top: var(--rhythm2);
        line-height: var(--rhythm2);
        padding-top: var(--typography__h3Offset);
        margin-bottom: calc(-1 * var(--typography__h3Offset));
      }
    `}</style>
    {children}
  </h3>
);

export const SubSubHeading = ({ children }) => (
  <h4>
    <style jsx>{`
      h4 {
        margin-top: var(--rhythm2);
        line-height: var(--rhythm2);
        padding-top: var(--typography__h4Offset);
        margin-bottom: calc(-1 * var(--typography__h4Offset));
      }
    `}</style>
    {children}
  </h4>
);

export const Paragraph = ({ children }) => (
  <p>
    <style jsx>{`
      p {
        margin-top: var(--rhythm2);
        line-height: var(--rhythm2);
        padding-top: var(--typography__pOffset);
        margin-bottom: calc(-1 * var(--typography__pOffset));
      }
    `}</style>
    {children}
  </p>
);

export const UnorderedList = ({ children }) => (
  <ul>
    <style jsx>{`
      ul {
        margin-top: var(--rhythm2);
        line-height: var(--rhythm2);
        padding-top: var(--typography__pOffset);
        margin-bottom: calc(-1 * var(--typography__pOffset));
      }
    `}</style>
    {children}
  </ul>
);

export const UnorderedListItem = ({ children }) => <li>{children}</li>;

export const Table = ({ children }) => (
  <div>
    <style jsx>{`
      div {
        --border-size: 2px;
        --cell-padding: 4px;
        padding-top: var(--typography__tableOffset);
        margin-bottom: calc(
          -1 * var(--typography__tableOffset) - var(--border-size)
        );
      }
      table {
        border-collapse: collapse;
        border-spacing: 4px;
        margin-top: var(--rhythm2);
        line-height: var(--rhythm2);
        width: 100%;
        border-top: var(--border-size) solid gray;
      }
    `}</style>
    <table>{children}</table>
  </div>
);

export const TableRow = ({ children }) => (
  <tr>
    <style jsx>{`
      tr {
        border-right: var(--border-size) solid gray;
        border-bottom: var(--border-size) solid gray;
      }
    `}</style>
    {children}
  </tr>
);

export const TableHeader = ({ children }) => (
  <th>
    <style jsx>{`
      th {
        padding: var(--cell-padding);
        line-height: calc(
          var(--rhythm2) - var(--cell-padding) - var(--cell-padding) -
            var(--border-size)
        );
        border-left: var(--border-size) solid gray;
      }
    `}</style>
    {children}
  </th>
);

export const TableData = ({ children }) => (
  <td>
    <style jsx>{`
      td {
        padding: 4px;
        line-height: calc(
          var(--rhythm2) - var(--cell-padding) - var(--cell-padding) -
            var(--border-size)
        );
        border-left: var(--border-size) solid gray;
      }
    `}</style>
    {children}
  </td>
);
