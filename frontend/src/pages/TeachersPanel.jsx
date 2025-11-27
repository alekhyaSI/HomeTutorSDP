import React from "react";

export default function TeachersPanel() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <h1 className="text-4xl font-bold text-center">Teachers Panel</h1>
      <p className="text-center text-gray-600 mt-2">For tutors who want to join our platform</p>

      <div className="max-w-4xl mx-auto mt-10 bg-gray-50 p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">Become a Tutor</h2>
        <p className="mt-2 text-gray-700">
          Join thousands of certified tutors helping students learn better.
        </p>

        <ul className="mt-5 space-y-3 text-gray-700">
          <li>✔ Create tutor profile</li>
          <li>✔ Upload certificates</li>
          <li>✔ Get approved by admin</li>
          <li>✔ Start teaching students</li>
        </ul>

        <button className="mt-6 bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700">
          Apply as Tutor
        </button>
      </div>
    </div>
  );
}
