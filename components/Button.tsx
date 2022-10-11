import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  rest?: any;
  intent?: "primary" | "secondary" | "danger";
};

const Button = ({ children, intent = 'primary', ...rest }: Props) => {
  return (
    <button
      className={clsx({
        "px-4 py-3 rounded text-white my-4 inline-block w-fit": true,
        'bg-slate-700 hover:bg-slate-800': intent === 'primary',
        'text-slate-700 border border-slate-700': intent === 'secondary',
        "bg-red-600 hover:bg-red-700": intent === "danger",
      })}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;