type Props = {
  htmlFor: string;
  children: React.ReactNode;
}

const Label = ({ htmlFor, children }: Props) => (
  <label className='font-semibold text-slate-700 mb-1' htmlFor={htmlFor}>{children}</label>
)

export default Label;