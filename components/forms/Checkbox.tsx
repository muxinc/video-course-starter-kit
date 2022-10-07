import { useFormContext, RegisterOptions } from "react-hook-form";
import Field from "./Field"
import Label from "./Label"

type Props = {
  name: string;
  label: string;
  options?: RegisterOptions;
}

const Checkbox = ({ name, label, options = {} }: Props) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <Field>
      <div className="flex items-center gap-2">
        <input type="checkbox" className="border-gray-200 cursor-not-allowed mb-1 block" disabled {...register(name, options)} />
        <Label htmlFor={name}>{label}</Label>
      </div>
    </Field>
  )
}

export default Checkbox;



