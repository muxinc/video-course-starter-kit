import type { NextPage } from 'next'
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from 'next/router'
import TextInput from 'components/forms/TextInput';
import Heading from 'components/Heading';
import TextAreaInput from 'components/forms/TextAreaInput';
import SubmitInput from 'components/forms/SubmitInput';

type Inputs = {
  name: string;
  description: string;
};

type CourseCreateResult = {
  id: number;
}

const AdminNewCourse: NextPage = () => {
  const router = useRouter()
  const methods = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async data => {
    try {
      const result: CourseCreateResult = await fetch('/api/courses', {
        method: 'POST', body: JSON.stringify(data)
      }).then(res => res.json())

      router.push(`/admin/courses/${result.id}`)
    } catch (error) {
      console.log('Something went wrong')
    }
  };


  return (
    <>
      <Heading>New course</Heading>
      <FormProvider {...methods}>
        <form className='flex flex-col max-w-lg' onSubmit={methods.handleSubmit(onSubmit)}>
          <TextInput name='name' options={{ required: true }} />
          <TextAreaInput name='description' options={{ required: true }} />
          <SubmitInput value='Create course' />
        </form>
      </FormProvider>
    </>
  );

}

export default AdminNewCourse
