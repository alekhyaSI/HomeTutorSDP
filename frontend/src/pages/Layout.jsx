import { Outlet } from 'react-router-dom'
import Nav from '../components/Nav'

export default function Layout(){
  return (
    <div className="min-h-screen bg-purple-50">
      <Nav/>
      <div className="py-8 px-4">
        <div className="max-w-full sm:max-w-3xl md:max-w-6xl lg:max-w-7xl xl:max-w-8xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-12 overflow-hidden min-h-[65vh] md:min-h-[80vh]">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}