import { Link, useLocation } from 'react-router-dom'
import Button from './Button'

const NavLink = ({to, children}) => {
  const { pathname } = useLocation()
  const active = pathname === to
  return <Link to={to} className={`px-3 py-2 rounded-md ${active? 'bg-primary-500 text-white' : 'hover:bg-neutral-100'}`}>{children}</Link>
}

export default function Nav(){
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold">HT</div>
          <div className="text-xl font-semibold">HomeTutor</div>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>
        <div className="md:hidden">
          <Link to="/login"><Button variant="primary">Login</Button></Link>
        </div>
      </div>
    </header>
  )
}