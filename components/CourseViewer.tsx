import Image from 'next/future/image'
import type { Course, Lesson, Video } from "@prisma/client"
import Heading from 'components/Heading'

type Props = {
  course: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })
}

const CourseViewer = ({ course }: Props) => {
  return (
    <>
      <Heading>Course viewer</Heading>
      {course.lessons.map(lesson => (
        <div key={lesson.id} className='flex gap-6'>
          {lesson.video?.publicPlaybackId && (
            <div className='w-32 h-[4.5rem] rounded border'>
              <Image
                className='w-full h-full object-contain'
                src={`https://image.mux.com/${lesson.video.publicPlaybackId}/thumbnail.jpg?width=640`}
                alt={`Video thumbnail preview for ${lesson.name}`}
                width={320}
                height={240}
              />
            </div>
          )}
          <div>
            <h2 className='text-lg font-semibold'>{lesson.name}</h2>
            <p className='text-md italic text-gray-600 my-2 truncate'>{lesson.description}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default CourseViewer;


