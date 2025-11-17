import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      className="
      min-h-screen 
      bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] 
      flex flex-col items-center 
      relative overflow-hidden
      text-white
    "
    >
      {/* NAVBAR */}
      <nav className="w-[90%] fixed top-0 left-1/2 transform -translate-x-1/2 z-50 mt-6">
        <div
          className="
      flex justify-between items-center px-10 py-4
      bg-white/5 backdrop-blur-xl
      border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.25)]
      rounded-2xl
      text-white
    "
        >
          {/* Brand */}
          <a
            href="#"
            className="
        text-2xl font-bold tracking-wide 
        bg-gradient-to-r from-purple-300 to-blue-300 
        text-transparent bg-clip-text
      "
          >
            Glitchy
          </a>

          {/* Nav Links */}
          <div className="flex gap-10 text-lg">
            {["Home", "About", "Contact"].map((item) => (
              <a key={item} href="#" className="relative group transition">
                {item}
                <span
                  className="
              absolute left-0 -bottom-1 w-0 h-[2px] 
              bg-gradient-to-r from-purple-400 to-blue-400 
              transition-all duration-300 group-hover:w-full
            "
                ></span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative flex flex-col items-center pt-40 text-center">
        {/* Soft purple glow */}
        <div className="absolute w-80 h-80 bg-purple-500 opacity-30 blur-[120px] -z-10"></div>

        {/* Centered Logo */}
        <img
          src="/assets/logo.png"
          alt="Glitchy Logo"
          className="w-32 h-32 rounded-xl object-cover shadow-lg mb-6"
        />

        {/* Heading */}
        <h1
          className="
      text-6xl font-extrabold 
      bg-gradient-to-r from-purple-400 to-blue-400 
      text-transparent bg-clip-text 
      animate-fadeInUp
    "
        >
          UNIFY
        </h1>

        {/* Tagline */}
        <p className="text-gray-300 mt-4 text-lg animate-fadeInUp animation-delay-200">
          Your Smart and Simplified Management System
        </p>

        {/* Gradient Line */}
        <div className="h-[3px] w-24 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mt-3 animate-fadeInUp animation-delay-300"></div>

        {/* Get Started Button */}
        <button
          onClick={() => navigate("/login")}

          className="
      mt-10 px-8 py-3
      rounded-full font-semibold
      bg-gradient-to-r from-purple-500 to-blue-500
      text-white
      shadow-[0_0_20px_rgba(138,43,226,0.6)]
      hover:shadow-[0_0_35px_rgba(138,43,226,0.9)]
      hover:scale-105
      transition-all
    "
        >
          GET STARTED
        </button>
      </div>

      {/* DEVELOPERS SECTION */}
      <section
        id="developers"
        className="
          w-full mt-40 
          bg-white
          py-28 px-6 
          border-t border-slate-200
          rounded-t-[3rem]
          shadow-inner
        "
      >
        {/* Heading */}
        <h2
          className="
            text-4xl font-bold text-center text-slate-900 mb-20
            opacity-0 animate-fadeInUp tracking-tight
          "
        >
          The Glitched Developers
        </h2>

        {/* Developer Grid */}
        <div className="flex flex-wrap justify-center gap-24">
          {[
            {
              name: "Vivek Yadav",
              role: "Backend Developer",
              img: "public/devs/vivekydv.jpg",
            },
            {
              name: "Sujal Bhawsar",
              role: "Frpntend Developer | UI/UX",
              img: "public/devs/sujalb.jpg",
            },
            {
              name: "Sakshi Chouhan",
              role: "Frontend Developer",
              img: "",
            },
          ].map((dev, index) => (
            <div
              key={index}
              className="
                flex flex-col items-center text-center 
                opacity-0 animate-fadeInUp
                transition-all duration-300
              "
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Image */}
              <img
                src={dev.img}
                alt={dev.name}
                className="
                  w-40 h-40 rounded-full object-cover
                  border border-slate-300
                  shadow-sm
                "
              />

              {/* Name */}
              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                {dev.name}
              </h3>

              {/* Role */}
              <p className="text-slate-500 mt-1 text-sm">{dev.role}</p>

              {/* Social Icons */}
              <div className="flex gap-6 mt-5">
                <a
                  href="#"
                  className="text-slate-500 hover:text-slate-700 transition"
                >
                  <i className="fa-brands fa-github text-2xl"></i>
                </a>

                <a
                  href="#"
                  className="text-slate-500 hover:text-slate-700 transition"
                >
                  <i className="fa-brands fa-linkedin text-2xl"></i>
                </a>

                <a
                  href="#"
                  className="text-slate-500 hover:text-slate-700 transition"
                >
                  <i className="fa-solid fa-envelope text-2xl"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer
        className="
    w-full 
    bg-[#0d0d16] 
    text-gray-300 
    px-10 py-16 
    border-t border-white/10
  "
      >
        {/* Top Gradient Line */}
        <div className="w-full h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 opacity-40 mb-10"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14">
          {/* LOGO & SHORT DESCRIPTION */}
          <div className="flex flex-col items-start">
            <img
              src="/assets/glitchylogo.png"
              alt="Team Glitchy Logo"
              className="
          w-28 h-28 
          rounded-full 
          object-cover 
          border-4 border-white 
          shadow-lg 
          bg-white/10 
          p-2
          opacity-90 hover:opacity-100 
          transition
        "
              draggable="false"
            />

            <p className="text-gray-400 mt-4 text-sm leading-relaxed max-w-xs">
              A unified, smart and reliable management system built for modern
              teams. Streamline your workflow with enterprise precision.
            </p>

            {/* Social Icons */}
            <div className="flex gap-5 mt-6">
              <a href="#" className="hover:text-white transition text-2xl">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="hover:text-white transition text-2xl">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="#" className="hover:text-white transition text-2xl">
                <i className="fa-solid fa-globe"></i>
              </a>
            </div>
          </div>

          {/* COMPANY COLUMN */}
          <div>
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* DEVELOPERS EMAILS COLUMN */}
          <div>
            <h3 className="text-lg font-semibold text-white">Developers</h3>
            <ul className="mt-4 space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-envelope"></i>
                <a
                  href="mailto:vivek@example.com"
                  className="hover:text-white transition"
                >
                  Vivek Yadav — vivek@example.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-envelope"></i>
                <a
                  href="mailto:sujal@example.com"
                  className="hover:text-white transition"
                >
                  Sujal Bhawsar — sujal@example.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-envelope"></i>
                <a
                  href="mailto:sakshi@example.com"
                  className="hover:text-white transition"
                >
                  Sakshi Chouhan — sakshi@example.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="text-center text-gray-500 text-sm mt-16">
          © {new Date().getFullYear()} Team Glitchy — All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
