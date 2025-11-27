// src/components/Sidebar.jsx
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = (() => { 
    try { return JSON.parse(localStorage.getItem('user')) } 
    catch(e){ return {role:'STUDENT'} } 
  })();

  const menuItems = {
    STUDENT: ['Dashboard','Find Tutors','Records','Profile'],
    TUTOR: ['Dashboard','Manage','Requests','Profile'],
    ADMIN: ['Dashboard','Manage Users','Reports'],
  };

  const items = menuItems[user.role] || menuItems['STUDENT'];

  return (
    <aside className="
      h-screen
      w-64
      fixed left-0 top-0
      bg-gradient-to-b from-purple-600 to-purple-800
      text-white flex flex-col p-6
      shadow-inner overflow-y-auto
    ">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-3 rounded-xl text-2xl">🎓</div>
          <h1 className="text-lg font-semibold">HomeTutor</h1>
        </div>
        <p className="text-xs opacity-80">{user?.role}</p>
      </div>

      <nav className="flex-1 space-y-4">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => {
              const route = `/${user.role.toLowerCase()}/${item.toLowerCase().replace(/\s+/g,'')}`;
              navigate(route);
            }}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
          >
            {item}
          </button>
        ))}
      </nav>

      <button
        onClick={() => {
          localStorage.removeItem('user');
          navigate('/login');
        }}
        className="mt-auto bg-white/20 py-2 rounded-lg hover:bg-white/30 transition"
      >
        Logout
      </button>
    </aside>
  );
}
