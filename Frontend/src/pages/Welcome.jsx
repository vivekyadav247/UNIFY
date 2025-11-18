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
      rounded-full
      text-white
    "
        >
          {/* Brand */}
          <a
            href="/"
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
            <a href="/" className="relative group transition">
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a href="#about" className="relative group transition">
              About
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a href="#developers" className="relative group transition">
              Developers
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a href="#footer" className="relative group transition">
              Contact
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
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

      {/* ABOUT THE PROJECT SECTION */}
      <section
        id="about"
        className="
    w-full mt-32 
    relative 
    py-28 px-6
    bg-gradient-to-b from-[#fafbff] to-white
    border-t border-slate-200
    rounded-t-[3rem]
    overflow-hidden
  "
      >
        {/* Soft Background Glows */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-purple-300 opacity-10 blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[150px] bg-blue-300 opacity-10 blur-[100px]"></div>

        {/* Heading */}
        <h2
          className="
      text-4xl font-bold text-center text-slate-900 
      tracking-tight
    "
        >
          About the Project
        </h2>

        {/* Divider */}
        <div className="w-20 h-[3px] bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mt-4 mb-12 rounded-full"></div>

        {/* Content Card */}
        <div
          className="
      max-w-4xl mx-auto bg-white/70 backdrop-blur-xl 
      rounded-3xl shadow-lg p-10 
      border border-white/40
    "
        >
          <p className="text-lg text-slate-700 leading-relaxed">
            <strong>UNIFY</strong> is a modern, modular ERP system designed
            specifically for colleges and academic institutions. Its primary
            goal is to simplify daily operations, improve data accessibility,
            and bring multiple academic workflows under one unified digital
            platform.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mt-6">
            The current version includes four core modules:
            <strong> HOD</strong>, <strong>Teacher Guardian (TG)</strong>,
            <strong> Faculty</strong>, and <strong>Student</strong>. Each module
            has been crafted with focused functionality so stakeholders can
            manage tasks more efficiently—from academic performance tracking to
            basic communication and administrative operations.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mt-6">
            As the project evolves, <strong>UNIFY</strong> aims to grow into a
            complete enterprise-grade solution with additional modules such as
            Administration, Examination Cell, Library, Attendance Analytics,
            Timetable Automation, and more. The system is being built as a
            learning and innovation project by <strong>Team Glitchy</strong>,
            and will continue to expand and mature with new features,
            optimizations, and user feedback.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed mt-6">
            This ERP is a non-commercial prototype created purely for academic
            exploration and skill development, showcasing strong UI/UX design,
            MERN stack implementation, scalable architecture, and practical
            problem solving for real-world institutional needs.
          </p>
        </div>
      </section>

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
              github: "https://github.com/vivekyadav247",
              linkedin: "https://www.linkedin.com/in/vivek-07x",
              email: "mailto:vivekyad240706@gmail.com",
            },
            {
              name: "Sujal Bhawsar",
              role: "Frpntend Developer | UI/UX",
              img: "public/devs/sujalb.jpg",
              github: "https://github.com/SUJAL1902",
              linkedin: "www.linkedin.com/in/sujalbhawsar19",
              email: "mailto:sbhawsar2017@gmail.com",
            },
            {
              name: "Sakshi Chouhan",
              role: "Frontend Developer",
              img: "",
              github: "https://github.com/sakshichouhan305",
              linkedin: "https://www.linkedin.com/in/sakshi-chouhan-64712b30b/",
              email: "mailto:chouhansakshi068@gmail.com",
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
                  href={dev.github}
                  target="_blank"
                  className="text-slate-500 hover:text-slate-700 transition"
                >
                  <i className="fa-brands fa-github text-2xl"></i>
                </a>

                <a
                  href={dev.linkedin}
                  target="_blank"
                  className="text-slate-500 hover:text-slate-700 transition"
                >
                  <i className="fa-brands fa-linkedin text-2xl"></i>
                </a>

                <a
                  href={dev.email}
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
        id="footer"
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

            {/* Social Icons
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
            // </div> */}
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
                  href="mailto:vivekyad240706@gmail.com"
                  className="hover:text-white transition"
                >
                  Vivek Yadav — vivekyad240706@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-envelope"></i>
                <a
                  href="mailto:sbhawsar2017@gmail.com"
                  className="hover:text-white transition"
                >
                  Sujal Bhawsar — sbhawsar2017@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-envelope"></i>
                <a
                  href="mailto:chouhansakshi068@gmail.com"
                  className="hover:text-white transition"
                >
                  Sakshi Chouhan — chouhansakshi068@gmail.com
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
