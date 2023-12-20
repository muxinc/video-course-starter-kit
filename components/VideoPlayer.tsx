import ReactPlayer from 'react-player';

interface VideoPlayerProps {
    playbackId: string;
    courseId: number;
    lessonName: string;
    videoUrl: string;
    thumbnail?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({playbackId, courseId, lessonName, videoUrl, thumbnail}) => {
    const handleMetadata = (): void => {
        console.log({
            video_series: courseId,
            video_title: lessonName,
            player_name: "Video Course Starter Kit",
        });
    };

    return (
        <div className='mb-6 w-full aspect-video'>
            <ReactPlayer
                url={videoUrl}
                className='react-player'
                width='100%'
                height='100%'
                controls={true}
                onReady={handleMetadata}
            />
        </div>
    );
};

export default VideoPlayer;