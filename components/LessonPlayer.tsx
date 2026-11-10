import dynamic from 'next/dynamic';
import type { Props } from 'components/LessonVideo';

const LessonVideo = dynamic(() => import('components/LessonVideo'), { ssr: false });

const LessonPlayer = (props: Props) => (
  <div
    className='relative mb-6 w-full aspect-video bg-black'
    style={props.placeholder ? {
      background: `#000 url('${props.placeholder}') center / contain no-repeat`,
    } : undefined}
  >
    <LessonVideo {...props} />
  </div>
);

export default LessonPlayer;
