import React, { useState, useRef } from "react";

const App = () => {
  const [isSwapped, setIsSwapped] = useState(false);

  const handleInputInteraction = (e) => {
    if (!isSwapped) {
      const target = e.target;
      target.blur(); // temporarily close the browser's autocomplete suggestions
      setIsSwapped(true);
      setTimeout(() => {
        target.focus(); // reopen the suggestions once the swap animation is finished!
      }, 1000);
    }
  };

  return (
    <div className="h-screen w-screen relative flex overflow-hidden">
      <style>{`
        @keyframes slideFromImage {
          0% {
            transform: translate(calc(-50% - 320px), -50%);
            opacity: 0.3;
          }
          20% { opacity: 1; }
          100% {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }

        @keyframes zoomInImage {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
          }
          60% {
            transform: translate(-50%, -50%) scale(1.08);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes flyOut1  { 0% { transform:translate(0,0) scale(.5);opacity:0} 30%{opacity:1} 100%{transform:translate(340px,-210px) rotate(-40deg) scale(1.1);opacity:.9} }
        @keyframes flyOut2  { 0% { transform:translate(0,0) scale(.4);opacity:0} 25%{opacity:1} 100%{transform:translate(-280px,-320px) rotate(25deg) scale(1);opacity:.85} }
        @keyframes flyOut3  { 0% { transform:translate(0,0) scale(.5);opacity:0} 28%{opacity:1} 100%{transform:translate(480px,-80px) rotate(-15deg) scale(.9);opacity:.8} }
        @keyframes flyOut4  { 0% { transform:translate(0,0) scale(.6);opacity:0} 32%{opacity:1} 100%{transform:translate(-420px,-100px) rotate(35deg) scale(1.2);opacity:.85} }
        @keyframes flyOut5  { 0% { transform:translate(0,0) scale(.3);opacity:0} 20%{opacity:1} 100%{transform:translate(120px,-400px) rotate(-50deg) scale(.8);opacity:.75} }
        @keyframes flyOut6  { 0% { transform:translate(0,0) scale(.5);opacity:0} 35%{opacity:1} 100%{transform:translate(-160px,-380px) rotate(20deg) scale(1);opacity:.8} }
        @keyframes flyOut7  { 0% { transform:translate(0,0) scale(.4);opacity:0} 22%{opacity:1} 100%{transform:translate(520px,-160px) rotate(-30deg) scale(.95);opacity:.7} }
        @keyframes flyOut8  { 0% { transform:translate(0,0) scale(.5);opacity:0} 30%{opacity:1} 100%{transform:translate(-500px,-50px) rotate(45deg) scale(1.1);opacity:.75} }
        @keyframes flyOut9  { 0% { transform:translate(0,0) scale(.3);opacity:0} 18%{opacity:1} 100%{transform:translate(260px,-450px) rotate(-20deg) scale(.85);opacity:.7} }
        @keyframes flyOut10 { 0% { transform:translate(0,0) scale(.4);opacity:0} 26%{opacity:1} 100%{transform:translate(-340px,-270px) rotate(40deg) scale(1);opacity:.8} }
        @keyframes flyOut11 { 0% { transform:translate(0,0) scale(.5);opacity:0} 30%{opacity:1} 100%{transform:translate(400px,-340px) rotate(-55deg) scale(.9);opacity:.75} }
        @keyframes flyOut12 { 0% { transform:translate(0,0) scale(.3);opacity:0} 24%{opacity:1} 100%{transform:translate(-80px,-420px) rotate(15deg) scale(1.1);opacity:.85} }

        @keyframes wingFlap {
          0%,100% { transform: scaleX(1) rotate(0deg); }
          25%      { transform: scaleX(0.6) rotate(5deg); }
          50%      { transform: scaleX(-1) rotate(0deg); }
          75%      { transform: scaleX(0.6) rotate(-5deg); }
        }

        .bat-fly {
          position: absolute;
          top: 50%;
          left: 50%;
          pointer-events: none;
          animation-fill-mode: both;
          filter: brightness(0); /* makes emoji fully BLACK */
        }

        .bat-fly span {
          display: inline-block;
          animation: wingFlap 0.22s ease-in-out infinite;
        }

        .bf1  { font-size:22px; animation: flyOut1  1.6s 0.40s ease-in-out forwards; }
        .bf2  { font-size:16px; animation: flyOut2  1.8s 0.55s ease-in-out forwards; }
        .bf3  { font-size:13px; animation: flyOut3  1.4s 0.30s ease-in-out forwards; }
        .bf4  { font-size:20px; animation: flyOut4  1.7s 0.65s ease-in-out forwards; }
        .bf5  { font-size:11px; animation: flyOut5  1.9s 0.45s ease-in-out forwards; }
        .bf6  { font-size:17px; animation: flyOut6  1.5s 0.70s ease-in-out forwards; }
        .bf7  { font-size:12px; animation: flyOut7  1.6s 0.35s ease-in-out forwards; }
        .bf8  { font-size:19px; animation: flyOut8  1.4s 0.50s ease-in-out forwards; }
        .bf9  { font-size:10px; animation: flyOut9  2.0s 0.60s ease-in-out forwards; }
        .bf10 { font-size:15px; animation: flyOut10 1.7s 0.42s ease-in-out forwards; }
        .bf11 { font-size:14px; animation: flyOut11 1.5s 0.58s ease-in-out forwards; }
        .bf12 { font-size:18px; animation: flyOut12 1.8s 0.48s ease-in-out forwards; }

        .login-panel {
          animation: slideFromImage 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .image-card {
          animation: zoomInImage 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Background image */}
      <img
        src="/bg.png"
        alt=""
        className="absolute h-full w-full object-cover opacity-80"
      />

      {/* Bat overlay — overflow:visible so bats escape freely in all directions */}
      <div
        className="transition-all duration-1000 ease-in-out"
        style={{
          position: "absolute",
          top: "50%",
          left: isSwapped ? "calc(75% - 15rem)" : "33.333333%",
          transform: "translate(-50%, -50%)",
          width: "25rem",
          height: "25rem",
          zIndex: 30,
          overflow: "visible",
          pointerEvents: "none",
        }}>
        <div className="bat-fly bf1"><span>🦇</span></div>
        <div className="bat-fly bf2"><span>🦇</span></div>
        <div className="bat-fly bf3"><span>🦇</span></div>
        <div className="bat-fly bf4"><span>🦇</span></div>
        <div className="bat-fly bf5"><span>🦇</span></div>
        <div className="bat-fly bf6"><span>🦇</span></div>
        <div className="bat-fly bf7"><span>🦇</span></div>
        <div className="bat-fly bf8"><span>🦇</span></div>
        <div className="bat-fly bf9"><span>🦇</span></div>
        <div className="bat-fly bf10"><span>🦇</span></div>
        <div className="bat-fly bf11"><span>🦇</span></div>
        <div className="bat-fly bf12"><span>🦇</span></div>
      </div>

      {/* Left image card */}
      <div
        className="image-card absolute h-100 w-100 rounded-4xl flex justify-center items-center top-1/2 transition-all duration-1000 ease-in-out"
        style={{
          zIndex: 10,
          left: isSwapped ? "calc(75% - 15rem)" : "33.333333%",
          transform: "translate(-50%, -50%) scale(0.3)",
          overflow: "hidden"
        }}
      >
        <img
          src="/bg.png"
          className="h-100 w-100 shadow-2xl rounded-4xl object-cover"
          alt=""
        />
      </div>

      {/* Login panel */}
      <div
        className="login-panel absolute h-120 w-120 rounded-4xl top-1/2 bg-linear-to-br from-purple-400/40 via-purple-600/50 to-black flex justify-center items-center transition-all duration-1000 ease-in-out"
        style={{
          zIndex: 20,
          left: isSwapped ? "33.333333%" : "calc(75% - 15rem)",
          transform: "translate(-50%, -50%)"
        }}
      >
        <form className="flex flex-col gap-6 w-3/4" onSubmit={e => e.preventDefault()}>
          <div className="text-3xl font-extrabold text-center text-white">
            LOGIN
          </div>
          <input
            type="text"
            placeholder="ENTER YOUR EMAIL"
            onFocus={handleInputInteraction}
            onClick={handleInputInteraction}
            className="border-2 p-3 rounded-lg shadow-sm outline-none mt-5 bg-white/10 text-white placeholder:text-white/60 border-white/30 focus:border-purple-400 transition-all"
          />
          <input
            type="password"
            placeholder="ENTER YOUR PASSWORD"
            onFocus={handleInputInteraction}
            onClick={handleInputInteraction}
            className="border-2 p-3 rounded-lg shadow-sm outline-none mt-5 bg-white/10 text-white placeholder:text-white/60 border-white/30 focus:border-purple-400 transition-all"
          />
          <button
            type="button"
            onClick={() => setIsSwapped(true)}
            className="border-2 py-2 px-10 w-fit mx-auto rounded-lg bg-blue-400 text-white font-bold tracking-widest hover:bg-blue-500 transition"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;