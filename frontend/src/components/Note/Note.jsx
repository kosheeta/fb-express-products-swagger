import "./Note.scss";

export function Note({ children }) {
  return (
    <p className="note">
      {children}
    </p>
  );
}
