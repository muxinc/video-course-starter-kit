import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import TextInput from 'components/forms/TextInput';
import TextAreaInput from 'components/forms/TextAreaInput';
import SubmitInput from 'components/forms/SubmitInput';
import { Course } from "@prisma/client";

export type Inputs = {
  name: string;
  description: string;
};

type Props = {
  course?: Course;
  onSubmit: SubmitHandler<Inputs>
}

const CourseForm = ({ course, onSubmit }: Props) => {
  const methods = useForm<Inputs>({ defaultValues: { name: course?.name, description: course?.description } });

  return (
    <FormProvider {...methods}>
      <form className='flex flex-col max-w-lg' onSubmit={methods.handleSubmit(onSubmit)}>
        <TextInput name='name' options={{ required: true }} />
        <TextAreaInput name='description' options={{ required: true }} />
        <SubmitInput value={`${course ? 'Update' : 'Create'} course`} />
      </form>
    </FormProvider>
  )
}

export default CourseForm;