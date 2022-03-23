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
        margin-top: 0;
        line-height: calc(var(--rhythm3));
        padding-top: var(--typography__h1Offset);
        margin-bottom: calc(var(--rhythm2) - var(--typography__h1Offset));
      }
    `}</style>
    {children}
  </h1>
);

export const Heading = ({ children }) => (
  <h2>
    <style jsx>{`
      h2 {
        margin-top: 0;
        line-height: var(--rhythm2);
        padding-top: var(--typography__h2Offset);
        margin-bottom: calc(var(--rhythm2) - var(--typography__h2Offset));
      }
    `}</style>
    {children}
  </h2>
);

export const Paragraph = ({ children }) => (
  <p>
    <style jsx>{`
      p {
        margin-top: 0;
        line-height: var(--rhythm2);
        padding-top: var(--typography__pOffset);
        margin-bottom: calc(var(--rhythm2) - var(--typography__pOffset));
      }
    `}</style>
    {children}
  </p>
);

export const UnorderedList = ({ children }) => (
  <ul>
    <style jsx>{`
      ul {
        margin-top: 0;
        line-height: var(--rhythm2);
        padding-top: var(--typography__pOffset);
        margin-bottom: calc(var(--rhythm2) - var(--typography__pOffset));
      }
    `}</style>
    {children}
  </ul>
);

export const UnorderedListItem = ({ children }) => <li>{children}</li>;
