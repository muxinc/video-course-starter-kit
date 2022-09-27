import React from "react";

const Field = ({ children }: { children: React.ReactNode }) => (
  <div className='my-2 flex flex-col'>
    {children}
  </div>
)

export default Field;