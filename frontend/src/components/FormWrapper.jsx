import "../styles/form.css";

export default function FormWrapper({ title, onSubmit, children }) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <h2>{title}</h2>
      {children}
    </form>
  );
}
