export const ApplicationContainer = ({ children }) => (
  <div>
    <style jsx>{`
      div {
        margin: var(--rhythm2);
        max-width: 50em;
      }
    `}</style>
    {children}
  </div>
);

export const MainHeading = ({ children }) => (
  <h1>
    <style jsx>{`
      h1 {
        font-size: var(--typography__h1FontSize);
        margin-top: var(--rhythm1);
        line-height: var(--typography__h1LineHeight);
        padding-top: calc(var(--rhythm2) + var(--typography__h1Offset));
        margin-bottom: calc(-1 * var(--typography__h1Offset));
        background-color: var(--heading-background);
        padding-bottom: var(--rhythm2);
        padding-left: var(--rhythm1);
        margin-left: calc(-1 * var(--rhythm1));
        margin-right: calc(-1 * var(--rhythm2));
      }
    `}</style>
    {children}
  </h1>
);

export const Heading = ({ children }) => (
  <h2>
    <style jsx>{`
      h2 {
        font-size: var(--typography__h2FontSize);
        margin-top: var(--rhythm3);
        line-height: var(--typography__h2LineHeight);
        padding-top: var(--typography__h2Offset);
        margin-bottom: calc(-1 * var(--typography__h2Offset));
        background-color: var(--heading-background);
        padding-left: var(--rhythm1);
        margin-left: calc(-1 * var(--rhythm1));
        margin-right: calc(-1 * var(--rhythm2));
      }
    `}</style>
    {children}
  </h2>
);

export const SubHeading = ({ children }) => (
  <h3>
    <style jsx>{`
      h3 {
        font-size: var(--typography__h3FontSize);
        margin-top: var(--rhythm2);
        line-height: var(--typography__h3LineHeight);
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
        font-size: var(--typography__h4FontSize);
        margin-top: var(--rhythm2);
        line-height: var(--typography__h4LineHeight);
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
        font-size: var(--typography__pFontSize);
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
      }
      table {
        border-collapse: collapse;
        border-spacing: 4px;
        margin-top: var(--rhythm2);
        line-height: var(--rhythm2);
        width: 100%;
      }
    `}</style>
    <table>{children}</table>
  </div>
);

export const TableHead = ({ children }) => <thead>{children}</thead>;
export const TableBody = ({ children }) => <tbody>{children}</tbody>;
export const TableFooter = ({ children }) => (
  <tfoot>
    <style jsx>{`
      tfoot {
        font-weight: bold;
      }
    `}</style>
    {children}
  </tfoot>
);

export const TableHeader = ({ alignRight, children }) => (
  <th>
    <style jsx>{`
      th {
        padding: var(--cell-padding);
        line-height: calc(
          var(--rhythm3) - var(--cell-padding) - var(--cell-padding) -
            var(--border-size)
        );
        ${alignRight ? "text-align: right;" : ""}
      }
    `}</style>
    {children}
  </th>
);

export const TableRow = ({ children }) => (
  <tr>
    <style jsx>{`
      tr {
        border-bottom: var(--border-size) solid var(--foreground-weak);
      }
    `}</style>
    {children}
  </tr>
);

export const TableData = ({ colSpan, alignRight, children }) => (
  <td colSpan={colSpan}>
    <style jsx>{`
      td {
        padding: 4px;
        line-height: calc(
          var(--rhythm3) - var(--cell-padding) - var(--cell-padding) -
            var(--border-size)
        );
        ${alignRight ? "text-align: right;" : ""}
      }
    `}</style>
    {children}
  </td>
);

export const Button = ({ onClick, children }) => (
  <button onClick={onClick}>
    <style jsx>{`
      button {
        display: block;
        margin-top: var(--rhythm2);
        height: var(--rhythm3);

        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 100%;
        width: 364px;

        border: 1px solid var(--primary);
        background-color: var(--background);
        color: var(--primary);
      }
      button:hover {
        border-color: var(--primary-hover);
        color: var(--primary-hover);
        cursor: pointer;
      }
      button:active {
        transform: scale(0.98);
      }
    `}</style>
    {children}
  </button>
);
