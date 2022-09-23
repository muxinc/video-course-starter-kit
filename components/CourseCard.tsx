import { Course } from "@prisma/client";
import Link from 'next/link'

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <>
      <Link href={`/courses/${course.id}`}>
        <a className='w-full border rounded p-8 transition shadow-sm hover:shadow-md cursor-pointer'>
          <h2 className="font-semibold text-2xl">
            {course.name}
          </h2>
          <p>
            {course.description}
          </p>
        </a>
      </Link>
    </>
  );
};

export default CourseCard;