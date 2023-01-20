import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/future/image'
import type { Course, Lesson, Video } from "@prisma/client"
import Heading from 'components/Heading'
import EmptyState from 'components/EmptyState'
import MuxPlayer from "@mux/mux-player-react/lazy";
import formatDuration from 'utils/formatDuration'
import clsx from 'clsx';
import type { UserLessonProgress } from '@prisma/client'

type Props = {
  course: (Course & {
    lessons: (Lesson & {
      video: (Video & { placeholder?: string }) | null;
    })[];
  });
  lessonProgress: number[];
  setLessonProgress: (lessonProgess: number[]) => void;
}

const CourseViewer = ({ course, lessonProgress = [], setLessonProgress }: Props) => {
  const router = useRouter()
  const slug = (router.query.slug as string[]) || []
  const lessonIndex = slug[2] ? parseInt(slug[2]) - 1 : 0

  const [activeLesson, setActiveLesson] = useState(course.lessons[lessonIndex]);
  const playbackId = activeLesson?.video?.publicPlaybackId
  const videoReady = activeLesson?.video?.status === "ready"
  const placeholder = activeLesson?.video?.placeholder

  useEffect(() => {
    const lessonIndex = course.lessons.findIndex(lesson => lesson.id === activeLesson.id) + 1
    router.push(`/courses/${course.id}/lessons/${lessonIndex}`, undefined, { shallow: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLesson, course])

  const markLessonCompleted = async () => {
    try {
      const result: UserLessonProgress = await fetch(`/api/lessons/${activeLesson.id}/complete`, {
        method: 'POST'
      }).then(res => res.json())
      setLessonProgress([...lessonProgress, result.lessonId])
    } catch (error) {
      console.log('Something went wrong')
    }
  }

  if (!course.lessons.length) {
    return (
      <div className="max-w-lg mt-12 mx-8 lg:mx-auto">
        <EmptyState>
          This course does not have any lessons
        </EmptyState>
      </div>
    );
  }

  return (
    <div className='px-5 grid lg:grid-cols-[70%_30%]'>
      <div>
        {playbackId && videoReady ? (
          <MuxPlayer
            className='mb-6 w-full aspect-video'
            streamType="on-demand"
            playbackId={playbackId}
            placeholder={placeholder}
            onEnded={markLessonCompleted}
            metadata={{
              video_series: activeLesson.courseId,
              video_title: activeLesson.name,
              player_name: "Video Course Starter Kit",
            }}
          />
        ) : (
          <div className='mb-6 w-full aspect-video bg-gray-200' />
        )}

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
            {lessonProgress.includes(lesson.id) && (
              <span className='absolute z-10 -translate-x-2 -translate-y-2'>
                <svg className="w-6 h-6 fill-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </span>
            )}

            {lesson.video?.publicPlaybackId && lesson.video.status === "ready" && (
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


