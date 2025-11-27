import React from "react";

export default function Courses() {
  const courses = [
    { title: "Mathematics", desc: "Live classes, worksheets & 1-to-1 practice." },
    { title: "Science", desc: "Physics, Chemistry & Biology with experts." },
    { title: "English", desc: "Grammar, writing & communication skills." },
    { title: "Programming", desc: "Learn Java, Python, C, HTML, React." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <h1 className="text-4xl font-bold text-center">Our Courses</h1>
      <p className="text-center mt-2 text-gray-600">Choose from our most popular subjects</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-10">
        {courses.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
            <h2 className="text-xl font-semibold">{c.title}</h2>
            <p className="mt-2 text-gray-600">{c.desc}</p>
            <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
