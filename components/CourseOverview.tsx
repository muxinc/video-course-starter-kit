import Image from 'next/image'
import type { Course, Lesson, Video } from "@prisma/client"
import Heading from 'components/Heading'
import ReactMarkdown from 'react-markdown'

type Props = {
  course: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })
}

const CourseOverview = ({ course }: Props) => {
  return (
    <>
      <div>
        <Heading>{course.name}</Heading>
        <p className='text-slate-700 mb-10'></p>

        <div className='prose lg:prose-xl'>
          <ReactMarkdown>
            {course.description}
          </ReactMarkdown>
        </div>

        <h2 className='text-slate-800 text-2xl mb-4 font-bold'>What you&apos;ll learn</h2>
        {course.lessons.map(lesson => (
          <div key={lesson.id} className='flex flex-col md:flex-row gap-6 mb-8'>
            {lesson.video?.publicPlaybackId && (
              <Image
                src={`https://image.mux.com/${lesson.video.publicPlaybackId}/thumbnail.jpg?width=640`}
                alt={`Video thumbnail preview for ${lesson.name}`}
                width={320}
                height={240}
              />
            )}
            <div>
              <h2 className='text-xl font-semibold'>{lesson.name}</h2>
              <p>{lesson.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CourseOverview;


