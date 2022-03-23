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
