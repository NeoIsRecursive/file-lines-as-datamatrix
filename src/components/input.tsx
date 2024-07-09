type Props = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ label, id, ...props }: Props) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </div>
  );
};
