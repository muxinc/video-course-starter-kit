import Image from 'next/future/image'
import type { Course, Lesson, Video } from "@prisma/client"

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
      <div>
        <h1>Course viewer</h1>
        {course.lessons.map(lesson => (
          <div key={lesson.id}>
            {lesson.video?.publicPlaybackId && (
              <Image
                src={`https://image.mux.com/${lesson.video.publicPlaybackId}/thumbnail.jpg?width=640`}
                alt={`Video thumbnail preview for ${lesson.name}`}
                width={320}
                height={240}
              />
            )}
            <h2 className='text-xl'>{lesson.name}</h2>
            <p>{lesson.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default CourseViewer;


