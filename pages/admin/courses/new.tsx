import type { NextPage } from 'next'
import { prisma } from 'utils/prisma'
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string,
};


const AdminNewCourse: NextPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  return (
    <>
      <h1 className="text-4xl text-center font-bold">
        New course
      </h1>
      <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <input className='bg-gray-100' {...register("name", { required: true })} />
        {errors.name && <span>Name is required</span>}

        <input type="submit" value='Create course' />
      </form>
    </>
  );

}

export default AdminNewCourse
