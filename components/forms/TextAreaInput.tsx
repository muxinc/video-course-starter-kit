import { useFormContext, RegisterOptions } from "react-hook-form";
import Field from "./Field"
import Label from "./Label"
import TextareaAutosize from 'react-textarea-autosize';

type Props = {
  name: string;
  label: string;
  options: RegisterOptions;
}

const TextAreaInput = ({ name, label, options }: Props) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <Field>
      <Label htmlFor={name}>{label}</Label>
      <TextareaAutosize className='border border-gray-200 p-2 rounded mb-2 text-slate-700' {...register(name, options)} />
      {errors[name] && <span className='text-red-600 text-sm'>{name} is required</span>}
    </Field>
  )
}

export default TextAreaInput;