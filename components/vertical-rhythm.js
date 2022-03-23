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
