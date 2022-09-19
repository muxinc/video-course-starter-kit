import type { NextPage, GetServerSideProps } from 'next'
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from 'next/router'
import Mux from '@mux/mux-node';
const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

import MuxUploader from '@mux/mux-uploader-react';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import type { Session } from 'next-auth'

type Inputs = {
  name: string;
  description: string;
};

type AdminNewLessonPageProps = {
  session: Session;
  uploadUrl: string;
}

type LessonCreateResult = {
  id: number;
}

const AdminNewLesson: NextPage<AdminNewLessonPageProps> = ({ uploadUrl }) => {
  const router = useRouter()
  const { courseId } = router.query

  const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async data => {
    try {
      const result: LessonCreateResult = await fetch('/api/lessons', {
        method: 'POST', body: JSON.stringify(data)
      }).then(res => res.json())

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

        <MuxUploader
          endpoint={uploadUrl}
          type="bar"
          status
          style={{ '--button-border-radius': '40px' }}
        />

        <input type="submit" value='Create lesson' />
      </form>
    </>
  );
}

export default AdminNewLesson

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const upload = await Video.Uploads.create({
    cors_origin: 'https://localhost:3000',
    new_asset_settings: {
      playback_policy: 'public'
    }
  });

  return {
    props: {
      session,
      uploadUrl: upload.url
    },
  }
}
