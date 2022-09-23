import Image from 'next/future/image'
import type { Course, Lesson, Video } from "@prisma/client"
import Heading from 'components/Heading'
import MuxPlayer from "@mux/mux-player-react";
import formatDuration from 'utils/formatDuration'

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
      <MuxPlayer
        className='mb-6'
        streamType="on-demand"
        playbackId={course.lessons[0].video?.publicPlaybackId}
      />

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
            <h2 className=''>
              <span className='font-semibold text-lg text-gray-800'>{lesson.name}</span>
              {lesson.video && (
                <span className='text-md italic text-gray-600 truncate'> • {formatDuration(Math.round(lesson.video.duration))}</span>
              )}
            </h2>
            <p className='text-md italic text-gray-600 my-1 truncate'>{lesson.description}</p>

          </div>
        </div>
      ))}
    </>
  );
};

export default CourseViewer;


