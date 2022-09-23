import type { NextPage } from 'next'
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from 'next/router'

type Inputs = {
  name: string;
  description: string;
};

type CourseCreateResult = {
  id: number;
}

const AdminNewCourse: NextPage = () => {
  const router = useRouter()
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>();
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
      <h1 className="text-4xl font-bold">
        New course
      </h1>
      <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <input className='bg-gray-100' {...register("name", { required: true })} />
        {errors.name && <span>Name is required</span>}

        <label htmlFor="description">Description</label>
        <textarea className='bg-gray-100' {...register("description", { required: true })} />
        {errors.description && <span>Description is required</span>}

        <input type="submit" value='Create course' />
      </form>
    </>
  );

}

export default AdminNewCourse
