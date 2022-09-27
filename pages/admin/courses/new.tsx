import type { NextPage } from 'next'
import { SubmitHandler } from "react-hook-form";
import { useRouter } from 'next/router'

import Heading from 'components/Heading';
import CourseForm, { Inputs } from 'components/forms/CourseForm';

type CourseCreateResult = {
  id: number;
}

const AdminNewCourse: NextPage = () => {
  const router = useRouter()
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
      <CourseForm onSubmit={onSubmit} />
    </>
  );

}

export default AdminNewCourse
