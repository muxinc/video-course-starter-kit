import { useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next'
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from 'next/router'
import { prisma } from 'utils/prisma'

import Mux from '@mux/mux-node';
const mux = new Mux();

import MuxUploader from '@mux/mux-uploader-react';
import { getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import type { Session } from 'next-auth'
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import Heading from 'components/Heading';
import TextInput from 'components/forms/TextInput';
import TextAreaInput from 'components/forms/TextAreaInput';
import Field from 'components/forms/Field';
import SubmitInput from 'components/forms/SubmitInput';

type Inputs = {
  name: string;
  description: string;
  uploadId: string;
  courseId: string;
};

type AdminNewLessonPageProps = {
  session: Session;
  uploadUrl: string;
  uploadId: string;
}

type LessonCreateResult = {
  id: number;
}

const AdminNewLesson: NextPage<AdminNewLessonPageProps> = ({ uploadUrl, uploadId }) => {
  const router = useRouter()
  const courseId = router.query.courseId as string
  const [isVideoUploaded, setIsVideoUploaded] = useState(false)

  const methods = useForm<Inputs>();

  const handler = (data: Inputs) => {
    return fetch('/api/lessons', {
      method: 'POST', body: JSON.stringify(data)
    }).then(res => res.json())
  }

  const mutation = useMutation({
    mutationFn: handler,
    onSuccess: (data: LessonCreateResult) => {
      router.push(`/admin/courses/${courseId}/lessons/${data.id}`)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Something went wrong')
    }
  })

  const onSubmit: SubmitHandler<Inputs> = async data => {
    mutation.mutate(data);
  };

  return (
    <>
      <Heading>New lesson</Heading>
      <FormProvider {...methods}>
        <form className='flex flex-col max-w-xl' onSubmit={methods.handleSubmit(onSubmit)}>
          <TextInput label='Name' name='name' options={{ required: true }} />
          <TextAreaInput label='Description' name='description' options={{ required: true }} />

          <Field>
            <MuxUploader
              endpoint={uploadUrl}
              type="bar"
              style={{ '--button-border-radius': '40px' } as React.CSSProperties}
              onSuccess={() => setIsVideoUploaded(true)}
              className='w-full mb-6'
            />
          </Field>

          <input type="hidden" {...methods.register("uploadId", { value: uploadId, required: true })} />
          <input type="hidden" {...methods.register("courseId", { value: courseId, required: true })} />

          <input
            type="submit"
            className='bg-blue-500 text-white p-4 disabled:bg-slate-50 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed w-fit'
            value='Create lesson'
            disabled={!isVideoUploaded}
          />
        </form>
      </FormProvider>
    </>
  );
}

export default AdminNewLesson

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const upload = await mux.video.uploads.create({
    cors_origin: 'https://localhost:3000',
    new_asset_settings: {
      playback_policy: ['public', 'signed'],
      passthrough: JSON.stringify({ userId: session.user?.id })
    }
  });

  await prisma.video.create({
    data: {
      uploadId: upload.id,
      owner: {
        connect: { id: session.user.id }
      }
    }
  });

  return {
    props: {
      session,
      uploadId: upload.id,
      uploadUrl: upload.url
    },
  }
}
