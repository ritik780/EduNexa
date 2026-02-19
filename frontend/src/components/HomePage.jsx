import React, { useState, useEffect } from "react";
import logo from "../assets/imgs/logo.png";
import learning from "../assets/imgs/learning.png";
import hero from "../assets/imgs/hero.png";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";


const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    darkMode ? root.classList.add("dark") : root.classList.remove("dark");
  }, [darkMode]);

  return (
   <div className="min-h-screen flex flex-col justify-between w-full bg-[#F6F7FB] dark:bg-[#0B1120] text-[#2E3232] dark:text-white transition-colors duration-300 overflow-x-hidden relative overflow-y-hidden">


      {/* NAVBAR */}
      <nav className="w-full bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-lg shadow-sm fixed top-0 left-0 z-50 border-b border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">

          {/* LOGO TEXT */}
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(to right, #8335ED, #16B9AB)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            EduNEXA
          </h1>

        {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 text-sm rounded-lg border border-[#8335ED] text-[#8335ED] hover:bg-[#8335ED]/10 transition cursor-pointer"
            >
              {darkMode ? "☀" : "🌙"}
            </button>
              
            {/*Clerk Auth Buttons*/}
           <SignedOut>
  <Link to="/login">
    <button className="text-sm font-semibold text-[#8335ED] border border-[#8335ED] px-4 py-1 rounded-lg hover:bg-[#8335ED]/10 transition cursor-pointer">
      Login
    </button>
  </Link>
</SignedOut>


    <SignedIn>
      <UserButton afterSignOutUrl="/" />
    </SignedIn>
          </div>

        </div>
      </nav>

      {/* BACKGROUND GLOW */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-teal-400/20 dark:bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div className="text-center md:text-left">

          <div className="inline-block mb-4 px-4 py-1 text-xs sm:text-sm font-semibold text-[#8335ED] bg-[#8335ED]/10 dark:bg-[#8335ED]/20 rounded-full shadow-sm">
            Social Learning Platform 🚀
          </div>

          {/* LOGO IMAGE */}
          <div className="flex md:justify-start justify-center mb-5">
            <img
              src={logo}
              alt="EduNEXA Logo"
              className="h-24 sm:h-32 md:h-40 object-contain animate-logo-float glow-logo"
            />
          </div>

          {/* PROJECT CODE */}
          <div className="flex md:justify-start justify-center mb-6">
            <div className="bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border border-[#8335ED]/20 px-5 py-3 rounded-2xl shadow-md">
              <p className="text-xs text-gray-500 dark:text-gray-400">Project Code</p>
              <p className="text-base sm:text-lg font-bold text-[#8335ED] tracking-wide">
                EDU-NEXA-2026
              </p>
            </div>
          </div>
          
          {/* DESCRIPTION */}
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed mx-auto md:mx-0">
            An Instagram-style EdTech platform where students and teachers share notes, videos, and AI-powered practice questions — smarter, faster, and together.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 md:justify-start justify-center">

  <SignedOut>
    <Link to="/login">
      <button className="bg-[#8335ED] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition w-full sm:w-auto cursor-pointer">
        Join Us Today
      </button>
    </Link>
  </SignedOut>

  <SignedIn>
    <Link to="/profile">
      <button className="bg-[#16B9AB] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition w-full sm:w-auto cursor-pointer">
        Go to Dashboard
      </button>
    </Link>
  </SignedIn>

</div>


        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <img
            src={hero}
            alt="Learning Illustration"
            className="w-full max-w-xs sm:max-w-md md:max-w-lg object-contain drop-shadow-xl"
          />
        </div>

      </section>
              
      {/* FEATURES */}
      <h1 className="text-center text-3xl sm:text-4xl font-bold mb-6">Features</h1>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 cursor-pointer">
        {[
          { title: "Share Notes", icon: "📚", color: "#8335ED" },
          { title: "Study Shorts", icon: "🎥", color: "#16B9AB" },
          { title: "PYQ Uploads", icon: "📄", color: "#E09133" },
          { title: "AI Questions", icon: "🤖", color: "#7C3AED" }
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/90 dark:bg-[#1E293B]/80 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-lg" style={{ color: item.color }}>
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
              Modern tools built for next-gen learners and educators.
            </p>
          </div>
        ))}
      </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">

  <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
    About EduNEXA
  </h2>

  <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed mb-14">
    EduNEXA is a next-generation social learning platform where students are the teachers ,They connect, share knowledge, and grow together. 
    Inspired by Instagram’s engagement model, EduNEXA transforms learning into an interactive, collaborative, and modern experience.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

    {/* Mission */}
    <div className="bg-white/90 dark:bg-[#1E293B]/80 backdrop-blur-md p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition">
      <h3 className="text-xl font-bold text-[#8335ED] mb-3">🎯 Our Mission</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        To make learning social, engaging, and accessible by enabling students to share notes, ask questions, and learn collaboratively.
      </p>
    </div>

    {/* Vision */}
    <div className="bg-white/90 dark:bg-[#1E293B]/80 backdrop-blur-md p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition">
      <h3 className="text-xl font-bold text-[#16B9AB] mb-3">🚀 Our Vision</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        To build a social EdTech community where knowledge flows freely between students and educators globally.
      </p>
    </div>

    {/* Why EduNEXA */}
    <div className="bg-white/90 dark:bg-[#1E293B]/80 backdrop-blur-md p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition">
      <h3 className="text-xl font-bold text-[#E09133] mb-3">💡 Why EduNEXA?</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        We combine AI-powered tools, peer learning, and modern UI to create a smarter, faster, and more enjoyable learning ecosystem.
      </p>
    </div>

  </div>

</section>


      {/* EXTRA IMAGE */}
      <div className="mt-10 flex justify-center px-4">
        <img
          src={learning}
          alt="Learning Illustration"
          className="w-full max-w-md sm:max-w-lg drop-shadow-2xl animate-float"
        />
      </div>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold">
          Join EduNEXA & Start Learning 🚀
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
          Share knowledge, explore notes, and practice AI-generated questions in one powerful social learning app.
        </p>

       <SignedOut>
  <Link to="/login">
    <button className="mt-8 bg-[#16B9AB] text-white px-10 py-4 rounded-xl font-bold shadow-xl hover:scale-105 transition cursor-pointer">
      Get Started Now
    </button>
  </Link>
</SignedOut>

<SignedIn>
  <Link to="/profile">
    <button className="mt-8 bg-[#8335ED] text-white px-10 py-4 rounded-xl font-bold shadow-xl hover:scale-105 transition cursor-pointer">
      Open Dashboard
    </button>
  </Link>
</SignedIn>

      </section>
   
  <footer className="bg-white dark:bg-[#0F172A] border-t border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 text-sm">

  <div className="max-w-6xl mx-auto px-4 py-6 text-center space-y-3">

    {/* Brand Line */}
    <p className="font-semibold tracking-wide">
      © 2026 <span className="text-[#8335ED] font-bold">EduNEXA</span> — Instagram for Learning
    </p>

    {/* Divider */}
    <div className="w-24 h-0.5 bg-linear-to-r from-[#8335ED] to-[#16B9AB] mx-auto rounded-full"></div>

    {/* Rights */}
    <p className="text-xs">
      All rights reserved. Unauthorized use or reproduction is prohibited.
    </p>

    {/* Creator Credit */}
    <p className="text-xs">
      Built with ❤️ by <span className="font-semibold text-[#16B9AB]">Ritik</span> @ JUIT Solan
    </p>

  </div>

</footer>



 </div>


  );
};

export default HomePage;
