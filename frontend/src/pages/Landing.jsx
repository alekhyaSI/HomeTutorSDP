// Landing.jsx
// React functional component using Tailwind CSS
// Assumes Tailwind is configured in the project.
// Drop this file into src/pages or src/components and import where needed.

import React from "react";
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6d22e6] via-[#8b32ea] to-[#b53cf0] text-white">
      {/* NAVBAR */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            {/* simple logo mark */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M3 12c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 12c0 4.418 3.582 8 8 8s8-3.582 8-8" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            </svg>
          </div>
          <span className="font-semibold text-lg">Tutor Finder</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="hover:underline">Home</a>
          <a href="/courses" className="hover:underline">Courses</a>
          <a href="/teachers" className="hover:underline">Teachers Panel</a>
          <a href="/about" className="hover:underline">About Us</a>
          
        </nav>

        <div className="flex items-center gap-3">
          <a href="/login" className="bg-white text-[#6d22e6] px-4 py-2 rounded-full font-medium shadow-md">Login</a>
        </div>
      </header>

      {/* HERO */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Text + CTAs */}
          <section className="pt-8">
            <p className="text-sm uppercase tracking-widest text-white/80">Affordable High Quality Education</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
              Learn With Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/60">Online Tutors</span> !
            </h1>
            <p className="mt-4 max-w-xl text-white/90">
              Connect with experienced tutors, schedule live tuition slots, and learn at your own pace.
              Our smart matching, secure booking workflow and easy approvals make finding great tuition effortless.
            </p>

            {/* CTA buttons */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="/get-started"
                className="inline-flex items-center gap-2 bg-white text-[#6d22e6] px-6 py-3 rounded-full font-semibold shadow-lg hover:translate-y-[-1px] transition-transform"
              >
                Learn More
              </a>
              <a
                href="/get-tuition"
                className="inline-flex items-center gap-2 border border-white/30 px-5 py-3 rounded-full text-white/95 hover:bg-white/10 transition"
              >
                Get Tuition
              </a>
            </div>

            {/* small slider dots */}
            <div className="mt-6 flex items-center gap-2">
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-white/90" />
                <span className="w-2 h-2 rounded-full bg-white/40" />
                <span className="w-2 h-2 rounded-full bg-white/30" />
                <span className="w-2 h-2 rounded-full bg-white/30" />
              </div>

              <div className="ml-4 text-sm text-white/80">Trusted by thousands of learners</div>
            </div>

            {/* Key benefits row */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md">
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <div className="text-xs text-white/80">Verified Tutors</div>
                <div className="font-semibold">Background checked</div>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <div className="text-xs text-white/80">Flexible</div>
                <div className="font-semibold">Schedule anytime</div>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <div className="text-xs text-white/80">Secure</div>
                <div className="font-semibold">Safe booking</div>
              </div>
            </div>
          </section>

          {/* Right: Illustration card */}
          <section className="relative">
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
              {/* illustration placeholder - vector composition */}
              <div className="flex items-center gap-6">
                <div className="w-2/5">
                  <div className="w-full h-40 rounded-xl bg-white/20 flex items-center justify-center">
                    {/* student avatar / laptop */}
                    <svg viewBox="0 0 120 80" className="w-28 h-20">
                      <rect rx="10" width="120" height="80" fill="white" opacity="0.06" />
                      <rect x="10" y="10" width="100" height="25" rx="4" fill="white" opacity="0.08" />
                      <circle cx="30" cy="55" r="10" fill="white" opacity="0.08" />
                      <rect x="45" y="45" width="60" height="15" rx="4" fill="white" opacity="0.06" />
                    </svg>
                  </div>
                </div>

                <div className="w-3/5">
                  <div className="text-sm text-white/80">Live Class</div>
                  <div className="mt-2 font-semibold text-lg">Maths with an experienced tutor</div>
                  <div className="mt-3 text-white/75 text-sm">
                    Secure live lessons, small batch size and recorded replays so you can rewatch anytime.
                  </div>

                  <div className="mt-4 flex gap-3">
                    <div className="bg-white/20 px-3 py-2 rounded-lg text-sm">Live • 60 mins</div>
                    <div className="bg-white/20 px-3 py-2 rounded-lg text-sm">₹250 / hour</div>
                  </div>

                </div>
              </div>

              {/* small stats bar */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                <div className="bg-white/5 p-3 rounded-lg text-center">
                  <div className="text-sm text-white/80">Students</div>
                  <div className="font-bold text-lg">12k+</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-center">
                  <div className="text-sm text-white/80">Sessions</div>
                  <div className="font-bold text-lg">28k+</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-center">
                  <div className="text-sm text-white/80">Reviews</div>
                  <div className="font-bold text-lg">4.9</div>
                </div>
              </div>
            </div>

            {/* Decorative device / shape */}
            <div className="absolute -right-8 top-6 w-40 h-40 rounded-xl bg-white/5 border border-white/5 rotate-6" />
          </section>
        </div>
      </main>

      {/* WAVE DIVIDER (white) */}
      <div className="-mt-6">
        <svg viewBox="0 0 1440 120" className="w-full block" preserveAspectRatio="none">
          <path d="M0,32 C360,160 1080,0 1440,96 L1440 120 L0 120 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* FEATURES (white background section) */}
      <section className="bg-white text-slate-800 -mt-4 pb-20">
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold">Why choose our platform?</h2>
            <p className="mt-3 text-slate-600">
              Carefully curated tutors, flexible scheduling and a booking/approval flow that keeps both students and tutors in control.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Face To Face Learning", text: "One-to-one or small group tuition with focused attention." },
              { title: "Share And Collaborate", text: "Students can interact, share resources and practice together." },
              { title: "Monthly Conference", text: "Regular workshops and guest lectures to build depth." },
              { title: "Rewatch Lessons", text: "All sessions are recorded for later review and practice." }
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-indigo-50">
                  {/* icon */}
                  <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2v8" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M5 12h14" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M4 19h16" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div className="mt-12 bg-slate-50 p-8 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Ready to start learning?</h3>
              <p className="mt-1 text-slate-600">Create a free account and book your first class in minutes.</p>
            </div>
            <div className="flex gap-3">
              <a href="/register" className="px-5 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-sm">Get Started</a>
              <a href="/contact" className="px-5 py-3 rounded-full border border-slate-200 text-slate-700">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white text-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-indigo-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div className="font-semibold">Tutor Finder</div>
              <div className="text-sm text-slate-500">© {new Date().getFullYear()} Tutor Finder. All rights reserved.</div>
            </div>
          </div>

          <div className="text-sm text-slate-500">Built with ❤️ • Privacy • Terms</div>
        </div>
      </footer>
    </div>
  );
}
