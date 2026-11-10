import '@videojs/react/video/skin.css';
import { VideoPlayer, VideoSkin } from '@videojs/react/video';
import { MuxVideo } from '@videojs/react/media/mux-video';
import { MuxData } from '@videojs/react/extensions/mux-data';
import type { Lesson } from '@prisma/client';

export type Props = {
  playbackId: string;
  lesson: Pick<Lesson, 'name' | 'courseId'>;
  placeholder?: string;
  onEnded?: () => void;
}

const LessonVideo = ({ playbackId, lesson, placeholder, onEnded }: Props) => (
  <VideoPlayer title="">
    <VideoSkin
      className='absolute inset-0 size-full [--media-border-radius:0]'
      renderPoster={placeholder ? (props) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          {...props}
          alt=""
          style={{
            ...props.style,
            background: `url('${placeholder}') var(--media-object-position, center) / contain no-repeat`,
          }}
        />
      ) : undefined}
    >
      <MuxVideo
        source={{ playbackId }}
        onEnded={onEnded}
        playsInline
        crossOrigin="anonymous"
      />
      <MuxData
        metadata={{
          video_series: lesson.courseId,
          video_title: lesson.name,
          player_name: "Video Course Starter Kit",
        }}
      />
    </VideoSkin>
  </VideoPlayer>
);

export default LessonVideo;
