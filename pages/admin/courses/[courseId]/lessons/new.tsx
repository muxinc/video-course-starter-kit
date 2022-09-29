import type { NextPage, GetServerSideProps } from 'next'
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from 'next/router'
import Mux from '@mux/mux-node';
const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

import MuxUploader from '@mux/mux-uploader-react';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import type { Session } from 'next-auth'
import { useState } from 'react';

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
      <Heading>New lesson</Heading>
      <FormProvider {...methods}>
        <form className='flex flex-col' onSubmit={methods.handleSubmit(onSubmit)}>

          <TextInput label='Name' name='name' options={{ required: true }} />
          <TextAreaInput label='Description' name='description' options={{ required: true }} />

          <Field>
            <MuxUploader
              endpoint={uploadUrl}
              type="bar"
              status
              style={{ '--button-border-radius': '40px' }}
              onSuccess={() => setIsVideoUploaded(true)}
            />
          </Field>

          <input type="hidden" {...methods.register("uploadId", { value: uploadId, required: true })} />
          <input type="hidden" {...methods.register("courseId", { value: courseId, required: true })} />

          <input
            type="submit"
            className='bg-blue-500 text-white p-4 disabled:bg-slate-50 disabled:text-gray-400 cursor-pointer'
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
      playback_policy: ['public', 'signed'],
      passthrough: JSON.stringify({ userId: session.user?.id })
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
