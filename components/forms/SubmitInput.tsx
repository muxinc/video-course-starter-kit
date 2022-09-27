const SubmitInput = ({ value }: { value: string }) => (
  <input className='px-2 py-3 bg-gray-700 hover:bg-slate-800 text-white rounded cursor-pointer' type="submit" value={value} />
)

export default SubmitInput;