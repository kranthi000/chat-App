import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginService as loginUserService } from "../../services/service";
import { setActiveUser } from "../../chatSlice";

/* ─────────────────────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────────────────────── */
const MailIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
const LockIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);
const EyeOn = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const EyeOff = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   BOY CHARACTER  (returning — waves with one hand)
───────────────────────────────────────────────────────────── */
function BoyCharacter({ style }) {
  return (
    <svg viewBox="0 0 120 220" style={style} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="215" rx="30" ry="5" fill="rgba(0,0,0,0.18)" />
      <ellipse cx="48" cy="207" rx="11" ry="5" fill="#2d2d2d" />
      <ellipse cx="72" cy="207" rx="11" ry="5" fill="#2d2d2d" />
      <rect x="43" y="160" width="14" height="50" rx="7" fill="#1a6b3c" />
      <rect x="63" y="160" width="14" height="50" rx="7" fill="#1a6b3c" />
      <rect x="32" y="100" width="56" height="68" rx="14" fill="#25a244" />
      <polygon points="52,100 60,115 68,100" fill="#fff" opacity="0.9" />
      {/* Left arm down */}
      <rect x="14" y="105" width="20" height="48" rx="10" fill="#25a244" />
      <ellipse cx="24" cy="155" rx="10" ry="10" fill="#f4a261" />
      {/* Right arm raised — waving */}
      <rect x="86" y="72" width="18" height="44" rx="9" fill="#25a244"
        transform="rotate(-55 95 72)" />
      <ellipse cx="108" cy="68" rx="10" ry="10" fill="#f4a261" />
      <rect x="52" y="88" width="16" height="16" rx="5" fill="#f4a261" />
      <ellipse cx="60" cy="70" rx="26" ry="28" fill="#f4a261" />
      <ellipse cx="60" cy="44" rx="26" ry="14" fill="#3d1f00" />
      <rect x="34" y="44" width="52" height="10" rx="5" fill="#3d1f00" />
      <ellipse cx="51" cy="68" rx="4" ry="4.5" fill="#fff" />
      <ellipse cx="69" cy="68" rx="4" ry="4.5" fill="#fff" />
      <circle cx="52" cy="69" r="2.5" fill="#1a1a1a" />
      <circle cx="70" cy="69" r="2.5" fill="#1a1a1a" />
      <circle cx="53" cy="68" r="1" fill="#fff" />
      <circle cx="71" cy="68" r="1" fill="#fff" />
      <path d="M46 62 Q51 59 56 62" stroke="#3d1f00" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M64 62 Q69 59 74 62" stroke="#3d1f00" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Happy smile */}
      <path d="M52 79 Q60 87 68 79" stroke="#c0603a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Speech bubble */}
      <rect x="70" y="16" width="48" height="30" rx="8" fill="#fff" opacity="0.95" />
      <polygon points="78,46 83,46 78,54" fill="#fff" opacity="0.95" />
      <text x="94" y="27" textAnchor="middle" fontSize="8" fill="#25a244" fontWeight="bold" fontFamily="sans-serif">Welcome</text>
      <text x="94" y="38" textAnchor="middle" fontSize="8" fill="#25a244" fontWeight="bold" fontFamily="sans-serif">back! 👋</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   GIRL CHARACTER  (returning — happy pose)
───────────────────────────────────────────────────────────── */
function GirlCharacter({ style }) {
  return (
    <svg viewBox="0 0 120 220" style={style} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="215" rx="30" ry="5" fill="rgba(0,0,0,0.18)" />
      <ellipse cx="47" cy="208" rx="9" ry="4" fill="#b5179e" />
      <ellipse cx="73" cy="208" rx="9" ry="4" fill="#b5179e" />
      <rect x="42" y="168" width="13" height="42" rx="6" fill="#f9c6ea" />
      <rect x="65" y="168" width="13" height="42" rx="6" fill="#f9c6ea" />
      <ellipse cx="60" cy="168" rx="32" ry="10" fill="#e040fb" />
      <rect x="30" y="100" width="60" height="72" rx="14" fill="#e040fb" />
      <ellipse cx="60" cy="136" rx="28" ry="6" fill="#ce39e0" opacity="0.5" />
      {/* Left arm raised — waving */}
      <rect x="8" y="78" width="18" height="44" rx="9" fill="#e040fb"
        transform="rotate(55 26 78)" />
      <ellipse cx="12" cy="72" rx="10" ry="10" fill="#f9c6ea" />
      {/* Right arm down */}
      <rect x="88" y="105" width="22" height="44" rx="11" fill="#e040fb" />
      <ellipse cx="99" cy="151" rx="10" ry="10" fill="#f9c6ea" />
      <rect x="52" y="88" width="16" height="16" rx="5" fill="#f9c6ea" />
      <ellipse cx="60" cy="68" rx="27" ry="29" fill="#f9c6ea" />
      <ellipse cx="60" cy="42" rx="27" ry="15" fill="#6b2d0e" />
      <rect x="33" y="42" width="10" height="52" rx="5" fill="#6b2d0e" />
      <rect x="77" y="42" width="10" height="52" rx="5" fill="#6b2d0e" />
      <rect x="33" y="42" width="54" height="14" rx="7" fill="#6b2d0e" />
      <ellipse cx="60" cy="42" rx="17" ry="5" fill="#f06292" />
      <ellipse cx="50" cy="67" rx="4.5" ry="5" fill="#fff" />
      <ellipse cx="70" cy="67" rx="4.5" ry="5" fill="#fff" />
      <circle cx="51" cy="68" r="2.8" fill="#1a1a1a" />
      <circle cx="71" cy="68" r="2.8" fill="#1a1a1a" />
      <circle cx="52" cy="67" r="1" fill="#fff" />
      <circle cx="72" cy="67" r="1" fill="#fff" />
      <path d="M46 62 Q50 58 55 61" stroke="#3d1f00" strokeWidth="1.5" fill="none" />
      <path d="M65 61 Q70 58 74 62" stroke="#3d1f00" strokeWidth="1.5" fill="none" />
      <ellipse cx="42" cy="74" rx="6" ry="4" fill="#ffb3c6" opacity="0.6" />
      <ellipse cx="78" cy="74" rx="6" ry="4" fill="#ffb3c6" opacity="0.6" />
      {/* Big smile */}
      <path d="M52 80 Q60 89 68 80" stroke="#d63384" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Speech bubble */}
      <rect x="2" y="14" width="52" height="30" rx="8" fill="#fff" opacity="0.95" />
      <polygon points="40,44 46,44 40,52" fill="#fff" opacity="0.95" />
      <text x="28" y="25" textAnchor="middle" fontSize="8" fill="#e040fb" fontWeight="bold" fontFamily="sans-serif">Missed</text>
      <text x="28" y="36" textAnchor="middle" fontSize="8" fill="#e040fb" fontWeight="bold" fontFamily="sans-serif">you! 💜</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   REUSABLE INPUT FIELD
───────────────────────────────────────────────────────────── */
function Field({ icon, placeholder, type, value, onChange, suffix }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ ...s.fieldWrap, ...(focused ? s.fieldFocused : {}) }}>
      <span style={{ ...s.fieldIcon, ...(focused ? s.fieldIconFocused : {}) }}>
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={type === "password" ? "current-password" : (type === "email" ? "username" : "off")}
        style={s.fieldInput}
      />
      {suffix}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN LOGIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function Login() {
  const [phase, setPhase] = useState("walk"); // "walk" | "form"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* Walk-in → show form */
  useEffect(() => {
    const t = setTimeout(() => setPhase("form"), 1900);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -6;
    const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 6;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await loginUserService({
        email: email,
        password: password
      });

      if (response) {
        // Update user in Redux
        dispatch(setActiveUser(response.user || response));

        // OPTIONAL: Save to localStorage so you stay logged in after refresh
        try {
          localStorage.setItem('user', JSON.stringify(response.user || response));
        } catch (e) {
          if (e.name === 'QuotaExceededError') {
            console.warn("Storage Quota Exceeded. Attempting surgical cleanup...");
            localStorage.clear(); 
            localStorage.setItem('user', JSON.stringify(response.user || response));
          } else {
            console.error("Local Storage Error:", e);
          }
        }

        alert("Login Successful! Redirecting...");
        navigate('/chat');
      }
    } catch (error) {
      console.error("Login component error:", error);
      setLoading(false);
      
      let serverMessage = "Invalid email or password. Please try again.";
      
      // Handle Network Errors (like ERR_INTERNET_DISCONNECTED or server down)
      if (!error.response) {
        serverMessage = "Server is unreachable. Please check your internet connection or try again later.";
      } else if (error.response.data?.message) {
        serverMessage = error.response.data.message;
      }
      
      alert(serverMessage);
    }
  }

  /* ── Floating background bubbles ── */
  const bubbles = [
    { text: "Welcome back! 👋", top: "12%", left: "5%", delay: "0s" },
    { text: "Good to see you 😊", top: "25%", right: "4%", delay: "0.8s" },
    { text: "Miss us? ☀️", bottom: "30%", left: "3%", delay: "1.4s" },
    { text: "Let's chat! 💬", bottom: "20%", right: "5%", delay: "0.4s" },
    { text: "Sign in 🔐", top: "8%", right: "20%", delay: "1.8s" },
  ];

  return (
    <div style={s.root}>
      <Toaster position="top-center" />
      <style>{CSS}</style>

      {/* Background */}
      <div style={s.sceneBg} />
      <div style={s.sceneOverlay} />
      <div style={s.ground} />
      <div style={s.groundLine} />

      {/* Floating bubbles */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="float-bubble"
          style={{
            ...s.floatBubble,
            top: b.top, bottom: b.bottom,
            left: b.left, right: b.right,
            animationDelay: b.delay,
          }}
        >
          {b.text}
        </div>
      ))}

      {/* Brand */}
      <div style={s.brand} className={phase === "form" ? "brand-show" : ""}>
        <div style={s.brandIconContainer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </div>
        <span style={s.brandName}>ChatFlow</span>
      </div>

      {/* Characters */}
      <div
        className="char-transition"
        style={{ ...s.boyWrap, ...(phase === "form" ? s.boyForm : s.boyWalk) }}
      >
        <BoyCharacter style={s.charSvg} />
      </div>
      <div
        className="char-transition"
        style={{ ...s.girlWrap, ...(phase === "form" ? s.girlForm : s.girlWalk) }}
      >
        <GirlCharacter style={s.charSvg} />
      </div>

      {/* ── Login card ── */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          ...s.formCard, 
          ...(phase === "form" ? s.cardShow : s.cardHidden),
          transform: `translate(-50%, -50%) perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        <div style={s.cardGlow} />

        <div style={s.cardHeader}>
          <span style={s.cardEmoji}>🔐</span>
          <h1 style={s.cardTitle}>LOGIN</h1>
          <p style={s.cardSub}>Sign in to continue the conversation</p>
        </div>

          <form onSubmit={handleSubmit} style={s.form}>

            {/* Email */}
            <Field
              icon={<MailIcon />}
              placeholder="Enter Your Mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <Field
              icon={<LockIcon />}
              placeholder="Enter Your Password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={s.eyeBtn}
                >
                  {showPw ? <EyeOff /> : <EyeOn />}
                </button>
              }
            />

          {/* Forgot password */}
          <div style={s.forgotRow}>
            <Link to="/forgot-password" style={s.forgotLink}>
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={s.submitBtn}
            className="submit-btn"
          >
            {loading ? (
              <span style={s.spinner} className="spin" />
            ) : (
              <>
                <span>Sign In</span>
                <span style={s.btnArrow}>→</span>
              </>
            )}
          </button>

          {/* Register link */}
          <p style={s.registerLink}>
            Don't have an account?{" "}
            <Link to="/register" style={s.registerAnchor}>Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TOAST CONFIG
───────────────────────────────────────────────────────────── */
const toastCfg = {
  style: {
    background: "rgba(10,16,28,0.95)",
    color: "#fff",
    border: "1px solid rgba(0,201,120,0.3)",
    borderRadius: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
  },
};

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const s = {
  root: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
  },
  sceneBg: {
    position: "absolute", inset: 0, zIndex: 0,
    background: "linear-gradient(170deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
  },
  sceneOverlay: {
    position: "absolute", inset: 0, zIndex: 1,
    backgroundImage: `
      radial-gradient(ellipse at 20% 50%, rgba(0,200,120,0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 50%, rgba(160,0,255,0.08) 0%, transparent 60%)
    `,
  },
  ground: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: "22%", zIndex: 2,
    background: "linear-gradient(180deg, rgba(0,180,100,0.18) 0%, rgba(0,120,70,0.35) 100%)",
    borderTop: "1px solid rgba(0,220,120,0.2)",
  },
  groundLine: {
    position: "absolute", bottom: "22%", left: 0, right: 0, height: 1, zIndex: 3,
    background: "linear-gradient(90deg, transparent, rgba(0,220,120,0.4), transparent)",
  },
  floatBubble: {
    position: "absolute", zIndex: 3, padding: "8px 14px",
    borderRadius: "20px", fontSize: 12, color: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, whiteSpace: "nowrap",
    pointerEvents: "none", background: "rgba(255,255,255,0.09)",
  },
  brand: {
    position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)",
    zIndex: 20, display: "flex", alignItems: "center", gap: 10,
    opacity: 0, transition: "opacity .6s ease .4s",
  },
  brandIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
    transform: "rotate(-2deg)",
  },
  brandName: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 26,
    fontWeight: 900,
    background: "linear-gradient(to right, #fff, #fbcfe8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.04em",
    textTransform: "uppercase",
  },
  boyWalk: { left: "-20%" },
  boyForm: { left: "calc(50% - 310px)" },
  boyWrap: {
    position: "absolute", bottom: "14%", zIndex: 10,
    width: 160, transition: "left 1.6s cubic-bezier(.22,1,.36,1)",
  },
  girlWalk: { right: "-20%" },
  girlForm: { right: "calc(50% - 310px)" },
  girlWrap: {
    position: "absolute", bottom: "14%", zIndex: 10,
    width: 160, transition: "right 1.6s cubic-bezier(.22,1,.36,1)",
  },
  charSvg: { width: "100%", height: "auto", display: "block" },
  formCard: {
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 15,
    width: "min(390px, 88vw)",
    background: "rgba(10, 16, 28, 0.82)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 24,
    boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
    overflow: "hidden",
    transition: "opacity .5s ease, transform .5s cubic-bezier(.34,1.56,.64,1)",
  },
  cardGlow: {
    position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
    background: "linear-gradient(90deg, transparent, rgba(0,220,120,0.6), transparent)",
  },
  cardHeader: { padding: "32px 28px 0", textAlign: "center" },
  cardEmoji: { fontSize: 32, display: "block", marginBottom: 8 },
  cardTitle: {
    fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600,
    color: "#fff", margin: "0 0 4px", letterSpacing: "0.02em",
  },
  cardSub: { fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0 },
  form: { padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 12 },
  fieldWrap: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12, padding: "0 14px",
    transition: "border-color .2s, background .2s, box-shadow .2s",
  },
  fieldFocused: {
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,201,120,0.6)",
    background: "rgba(0,201,120,0.07)",
    boxShadow: "0 0 0 3px rgba(0,201,120,0.12)",
  },
  fieldIcon: { color: "rgba(255,255,255,0.35)", flexShrink: 0, transition: "color .2s" },
  fieldIconFocused: { color: "#00c978" },
  fieldInput: {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: "#fff", fontSize: 13.5, padding: "13px 0",
    fontFamily: "'DM Sans', sans-serif",
  },
  eyeBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "rgba(255,255,255,0.4)", padding: 0,
    display: "flex", alignItems: "center", transition: "color .2s",
  },
  forgotRow: {
    display: "flex", justifyContent: "flex-end", marginTop: -4,
  },
  forgotLink: {
    fontSize: 12, color: "rgba(0,201,120,0.8)",
    textDecoration: "none", fontWeight: 500, letterSpacing: "0.02em",
    transition: "color .2s",
  },
  submitBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "13px", borderRadius: 12, border: "none", cursor: "pointer",
    background: "linear-gradient(135deg, #00c978, #00a896)",
    color: "#fff", fontSize: 14, fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
    boxShadow: "0 4px 20px rgba(0,201,120,0.35)",
    transition: "transform .15s, box-shadow .15s, opacity .15s",
    marginTop: 4,
  },
  btnArrow: { fontSize: 16, transition: "transform .2s" },
  spinner: {
    width: 18, height: 18, display: "inline-block",
    borderWidth: 2, borderStyle: "solid",
    borderColor: "rgba(255,255,255,.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
  },
  registerLink: {
    textAlign: "center", fontSize: 12,
    color: "rgba(255,255,255,0.4)", margin: 0,
  },
  registerAnchor: {
    color: "#00c978", fontWeight: 600,
    textDecoration: "underline", textUnderlineOffset: 3,
  },
};

/* ─────────────────────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');

  .brand-show { opacity: 1 !important; }

  .card-hidden {
    opacity: 0 !important;
    transform: translate(-50%, -40%) scale(.94) !important;
    pointer-events: none;
  }
  .card-show {
    opacity: 1 !important;
    transform: translate(-50%, -50%) scale(1) !important;
  }

  .char-transition {
    transition: left 1.6s cubic-bezier(.22,1,.36,1),
                right 1.6s cubic-bezier(.22,1,.36,1);
  }

  .float-bubble {
    animation: floatUp 4s ease-in-out infinite;
  }
  @keyframes floatUp {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-10px); }
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0,201,120,.55) !important;
  }
  .submit-btn:active:not(:disabled) { transform: scale(.98); }
  .submit-btn:disabled { opacity: .65; cursor: not-allowed; }

  .spin { animation: spin .75s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  input::placeholder { color: rgba(255,255,255,0.25) !important; }

  a.forgot-link:hover { color: #00c978 !important; }

  @media (max-width: 600px) {
    .char-transition { width: 100px !important; }
  }
`;