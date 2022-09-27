const Heading = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-slate-700">
        {children}
      </h1>
    </>
  );
};

export default Heading;