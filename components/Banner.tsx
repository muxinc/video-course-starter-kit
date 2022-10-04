type Props = {
  children: React.ReactNode;
};

const Banner = ({ children }: Props) => {
  return (
    <div className='bg-slate-800 hover:bg-slate-900 text-white w-full p-4 block mb-8'>
      {children}
    </div>
  );
};

export default Banner;
