import React from "react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Tutor Finder connects students with verified tutors across India.
          We focus on affordable, flexible and high-quality online classes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="font-bold text-xl">12k+ Students</h2>
          <p className="mt-2 text-gray-600">Who trust our platform</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="font-bold text-xl">2800+ Tutors</h2>
          <p className="mt-2 text-gray-600">Certified & Verified</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="font-bold text-xl">4.9 Rating</h2>
          <p className="mt-2 text-gray-600">From student reviews</p>
        </div>
      </div>
    </div>
  );
}
