export default function Welcome() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative overflow-hidden">
      {/* NAVBAR */}
      <nav className="w-[90%] mt-6">
        <div className="flex justify-between items-center px-10 py-3 bg-[#c9d9ff] border border-blue-700 rounded-full text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-700">
            Glitchy
          </a>
          <a href="#" className="hover:text-blue-700">
            Home
          </a>
          <a href="#" className="hover:text-blue-700">
            About
          </a>
          <a href="#" className="hover:text-blue-700">
            Contact Us
          </a>
        </div>
      </nav>

      {/* MAIN TITLE */}
      <h1 className="text-6xl font-semibold text-gray-600 mt-24">UNIFY</h1>

      {/* GET STARTED BUTTON */}
      <button className="mt-20 px-6 py-2 border-2 border-blue-700 text-blue-700 rounded-full font-medium hover:bg-blue-700 hover:text-white transition">
        GET STARTED
      </button>

      {/* DEVELOPERS TITLE */}
      <h2 className="text-2xl text-gray-600 mt-32 mb-8">developers</h2>

      {/* 3 CIRCLES */}
      <div className="flex gap-16 mb-32">
        <div className="w-32 h-32 bg-blue-700 rounded-full"></div>
        <div className="w-32 h-32 bg-blue-700 rounded-full"></div>
        <div className="w-32 h-32 bg-blue-700 rounded-full"></div>
      </div>

      {/* BOTTOM BLUE BAR */}
      <div className="w-full h-48 bg-blue-700"></div>
    </div>
  );
}
