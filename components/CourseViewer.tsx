import { useState } from 'react';
import Image from 'next/future/image'
import type { Course, Lesson, Video } from "@prisma/client"
import Heading from 'components/Heading'
import MuxPlayer from "@mux/mux-player-react";
import formatDuration from 'utils/formatDuration'
import clsx from 'clsx';

type Props = {
  course: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })
}

const CourseViewer = ({ course }: Props) => {
  const [playbackId, setPlaybackId] = useState(course.lessons[0].video?.publicPlaybackId)

  return (
    <>
      <MuxPlayer
        className='mb-6'
        streamType="on-demand"
        playbackId={playbackId}
      />

      {course.lessons.map(lesson => (
        <a
          onClick={() => setPlaybackId(lesson.video?.publicPlaybackId)}
          key={lesson.id}
          className={clsx({
            'flex gap-6 cursor-pointer hover:bg-gray-50 py-4': true,
            'bg-yellow-50': playbackId === lesson.video?.publicPlaybackId
          })}
        >
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
            <h2>
              <span className='font-semibold text-lg text-gray-800'>{lesson.name}</span>
              {lesson.video && (
                <span className='text-md italic text-gray-600 truncate'> • {formatDuration(Math.round(lesson.video.duration))}</span>
              )}
            </h2>
            <p className='text-md italic text-gray-600 my-1 truncate'>{lesson.description}</p>
          </div>
        </a>
      ))}
    </>
  );
};

export default CourseViewer;


