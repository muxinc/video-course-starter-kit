const Footer = () => (
  <footer
    className="lg:h-auto sm:h-40 h-30 max-w-screen-xl xl:mx-auto mx-5 rounded-lg px-5 lg:pt-3 pt-0 pb-3 flex flex-col lg:flex-row space-y-3 lg:space-y-0 justify-between items-center sticky bottom-5 bg-white border-t-4 border-black drop-shadow-lg transition-all ease-in-out duration-150"
  >
    <div className="text-center lg:text-left">
      <p className="font-cal text-lg sm:text-2xl text-black">
        Video Course Starter Kit Demo
      </p>
      <p
        className="text-sm text-gray-700 mt-2 lg:mt-0"
      >
        This is a demo site showcasing how to build a video course
        starter kit with{" "}
        <a
          className="text-black font-semibold underline"
          href="https://mux.com?utm_source=video-course-starter-kit"
          rel="noreferrer"
          target="_blank"
        >
          Mux
        </a>{" "}
        .
      </p>
    </div>
    <div
      className="flex space-y-3 sm:space-y-0 sm:space-x-3 sm:flex-row flex-col lg:w-auto w-full text-center"
    >
      <a
        className="flex-auto font-cal text-lg bg-black text-white border border-black rounded-md py-1 sm:py-3 px-5 hover:text-black hover:bg-white transition-all ease-in-out duration-150 whitespace-no-wrap"
        href="https://github.com/muxinc/video-course-starter-kit"
        rel="noreferrer"
        target="_blank"
      >
        Clone and deploy
      </a>
    </div>
  </footer>
)

export default Footer;