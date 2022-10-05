import clsx from 'clsx'

type Props = {
  value: string;
  isLoading: boolean;
}

const SubmitInput = ({ value, isLoading }: Props) => {
  const classes = clsx({
    'inline-block text-white rounded px-2 py-3': true,
    'bg-slate-700 hover:bg-slate-800 cursor-pointer': !isLoading,
    'bg-slate-400': isLoading,
  });

  const label = isLoading ? 'Loading...' : value;

  return (
    <input className={classes} type="submit" value={label} disabled={isLoading} />
  )
}

export default SubmitInput;