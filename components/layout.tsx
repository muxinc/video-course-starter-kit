import Footer from './Footer'
import Nav from './Nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className='mx-auto max-w-full md:max-w-6xl min-h-screen px-5'>
        {children}
      </main>
      <Footer />
    </>
  )
}
