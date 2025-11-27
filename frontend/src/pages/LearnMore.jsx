import React from "react";

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <h1 className="text-4xl font-bold text-center">Learn More</h1>
      <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto">
        Here you can explore details about how Tutor Finder works, how we match students with tutors,
        our approval process and our booking workflow.
      </p>

      <div className="max-w-4xl mx-auto mt-10 bg-gray-100 p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">How Our Platform Works</h2>
        <ul className="mt-5 space-y-3 text-gray-700">
          <li>• Smart tutor matching based on subjects and level</li>
          <li>• Verified tutors with background checks</li>
          <li>• Secure booking & payment workflow</li>
          <li>• Student dashboard to track sessions</li>
          <li>• Recorded classes for replay</li>
        </ul>
      </div>
    </div>
  );
}
