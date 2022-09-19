import type { NextPage } from 'next'
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from 'next/router'

type Inputs = {
  name: string;
  description: string;
};

type LessonCreateResult = {
  id: number;
}

const AdminNewLesson: NextPage = () => {
  const router = useRouter()
  const { courseId } = router.query

  const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async data => {
    try {
      const result: LessonCreateResult = await fetch('/api/lessons', {
        method: 'POST', body: JSON.stringify(data)
      }).then(res => res.json())

      console.log(result);
      router.push(`/admin/courses/${courseId}/lessons/${result.id}`)
    } catch (error) {
      console.log('Something went wrong')
    }
  };

  return (
    <>
      <h1 className="text-4xl text-center font-bold">
        New lesson
      </h1>
      <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <input className='bg-gray-100' {...register("name", { required: true })} />
        {errors.name && <span>Name is required</span>}

        <label htmlFor="description">Description</label>
        <textarea className='bg-gray-100' {...register("description", { required: true })} />
        {errors.description && <span>Description is required</span>}

        <input type="submit" value='Create lesson' />
      </form>
    </>
  );
}

export default AdminNewLesson