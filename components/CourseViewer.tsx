import { useState } from 'react';
import Image from 'next/future/image'
import type { Course, Lesson, Video } from "@prisma/client"
import Heading from 'components/Heading'
import MuxPlayer from "@mux/mux-player-react";
import formatDuration from 'utils/formatDuration'
import clsx from 'clsx';
import type { UserLessonProgress } from '@prisma/client'

type Props = {
  course: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })
}

const CourseViewer = ({ course }: Props) => {
  const [activeLesson, setActiveLesson] = useState(course.lessons[0]);
  const playbackId = activeLesson.video?.publicPlaybackId

  const markLessonCompleted = async () => {
    try {
      const result: UserLessonProgress = await fetch(`/api/lessons/${activeLesson.id}/complete`, {
        method: 'POST'
      }).then(res => res.json())
    } catch (error) {
      console.log('Something went wrong')
    }
  }

  return (
    <div className='px-5 grid lg:grid-cols-[70%_30%]'>
      <div>
        <MuxPlayer
          className='mb-6'
          streamType="on-demand"
          playbackId={playbackId}
          onEnded={markLessonCompleted}
        />
        <Heading>{activeLesson.name}</Heading>
        <p className='text-slate-600 text-lg'>{activeLesson.description}</p>
      </div>

      <div>
        {course.lessons.map(lesson => (
          <a
            onClick={() => setActiveLesson(lesson)}
            key={lesson.id}
            className={clsx({
              'flex gap-5 cursor-pointer hover:bg-gray-50 px-6 py-4': true,
              'bg-yellow-50': playbackId === lesson.video?.publicPlaybackId
            })}
          >
            {lesson.video?.publicPlaybackId && (
              <Image
                src={`https://image.mux.com/${lesson.video.publicPlaybackId}/thumbnail.jpg?width=640`}
                alt={`Video thumbnail preview for ${lesson.name}`}
                width={106}
                height={60}
              />
            )}
            <div className='overflow-hidden'>
              <h2>
                <span className='font-semibold font-cal text-lg text-slate-800'>{lesson.name}</span>
                {lesson.video?.duration && (
                  <span className='text-sm italic text-slate-600 truncate'> • {formatDuration(Math.round(lesson.video.duration))}</span>
                )}
              </h2>
              <p className='text-md italic text-slate-600 my-1 truncate'>{lesson.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CourseViewer;


