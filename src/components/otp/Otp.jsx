// // // import { useState, useEffect, useRef, useCallback } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { useSelector } from "react-redux";
// // // import toast, { Toaster } from "react-hot-toast";

// // // /* ─────────────────────────────────────────────────────────────
// // //    ENVELOPE CHARACTER — animated SVG
// // // ───────────────────────────────────────────────────────────── */
// // // function EnvelopeCharacter({ opened }) {
// // //   return (
// // //     <svg viewBox="0 0 160 160" style={{ width: 120, height: 120, display: "block" }} xmlns="http://www.w3.org/2000/svg">
// // //       {/* Shadow */}
// // //       <ellipse cx="80" cy="148" rx="38" ry="7" fill="rgba(0,0,0,0.22)" />

// // //       {/* Envelope body */}
// // //       <rect x="18" y="55" width="124" height="84" rx="10" fill="#1a2a3a" stroke="rgba(0,201,120,0.5)" strokeWidth="1.5" />

// // //       {/* Envelope flap */}
// // //       <g style={{ transformOrigin: "80px 55px", transform: opened ? "rotateX(180deg)" : "rotateX(0deg)", transition: "transform 0.6s cubic-bezier(.4,2,.6,1)" }}>
// // //         <path d="M18 55 L80 100 L142 55 Z" fill="#203a43" stroke="rgba(0,201,120,0.35)" strokeWidth="1" />
// // //       </g>

// // //       {/* Envelope V lines */}
// // //       {!opened && (
// // //         <>
// // //           <line x1="18" y1="55" x2="80" y2="100" stroke="rgba(0,201,120,0.4)" strokeWidth="1.2" />
// // //           <line x1="142" y1="55" x2="80" y2="100" stroke="rgba(0,201,120,0.4)" strokeWidth="1.2" />
// // //         </>
// // //       )}

// // //       {/* Letter peeking out when opened */}
// // //       {opened && (
// // //         <g style={{ animation: "letterPeek 0.5s ease 0.4s both" }}>
// // //           <rect x="52" y="28" width="56" height="48" rx="4" fill="#fff" opacity="0.95" />
// // //           <line x1="61" y1="40" x2="99" y2="40" stroke="#00c978" strokeWidth="2.5" strokeLinecap="round" />
// // //           <line x1="61" y1="50" x2="99" y2="50" stroke="rgba(0,0,0,0.15)" strokeWidth="2" strokeLinecap="round" />
// // //           <line x1="61" y1="59" x2="85" y2="59" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />
// // //           {/* Stars on letter */}
// // //           <text x="88" y="62" fontSize="10">✨</text>
// // //         </g>
// // //       )}

// // //       {/* Face on envelope */}
// // //       <ellipse cx="63" cy="112" rx="5" ry="5.5" fill="#fff" />
// // //       <ellipse cx="97" cy="112" rx="5" ry="5.5" fill="#fff" />
// // //       <circle cx="64" cy="113" r="3" fill="#1a1a1a" />
// // //       <circle cx="98" cy="113" r="3" fill="#1a1a1a" />
// // //       <circle cx="65" cy="112" r="1" fill="#fff" />
// // //       <circle cx="99" cy="112" r="1" fill="#fff" />
// // //       {/* Eyebrows */}
// // //       <path d="M59 108 Q63 105 67 108" stroke="#3d5a6e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
// // //       <path d="M93 108 Q97 105 101 108" stroke="#3d5a6e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
// // //       {/* Mouth */}
// // //       <path
// // //         d={opened ? "M71 124 Q80 132 89 124" : "M71 122 Q80 118 89 122"}
// // //         stroke="#00c978"
// // //         strokeWidth="2"
// // //         fill="none"
// // //         strokeLinecap="round"
// // //         style={{ transition: "d 0.4s ease" }}
// // //       />
// // //       {/* Cheeks when happy */}
// // //       {opened && (
// // //         <>
// // //           <ellipse cx="54" cy="120" rx="7" ry="5" fill="rgba(255,100,100,0.25)" />
// // //           <ellipse cx="106" cy="120" rx="7" ry="5" fill="rgba(255,100,100,0.25)" />
// // //         </>
// // //       )}

// // //       {/* Speech bubble */}
// // //       <rect x="102" y="18" width="50" height="26" rx="8" fill="#fff" opacity="0.95" />
// // //       <polygon points="110,44 116,44 110,52" fill="#fff" opacity="0.95" />
// // //       <text x="127" y="28" textAnchor="middle" fontSize="8" fill="#00c978" fontWeight="bold" fontFamily="sans-serif">
// // //         {opened ? "Got it! 🎉" : "Check 📧"}
// // //       </text>
// // //       <text x="127" y="39" textAnchor="middle" fontSize="7" fill="#555" fontFamily="sans-serif">
// // //         {opened ? "Enter OTP" : "Email sent!"}
// // //       </text>
// // //     </svg>
// // //   );
// // // }

// // // /* ─────────────────────────────────────────────────────────────
// // //    SINGLE OTP INPUT BOX
// // // ───────────────────────────────────────────────────────────── */
// // // function OtpBox({ value, inputRef, onChange, onKeyDown, onPaste, isFilled, isActive }) {
// // //   return (
// // //     <div style={{
// // //       ...s.otpBox,
// // //       ...(isActive ? s.otpBoxActive : {}),
// // //       ...(isFilled ? s.otpBoxFilled : {}),
// // //     }}>
// // //       <input
// // //         ref={inputRef}
// // //         type="text"
// // //         inputMode="numeric"
// // //         maxLength={1}
// // //         value={value}
// // //         onChange={onChange}
// // //         onKeyDown={onKeyDown}
// // //         onPaste={onPaste}
// // //         style={s.otpInput}
// // //       />
// // //     </div>
// // //   );
// // // }

// // // /* ─────────────────────────────────────────────────────────────
// // //    MAIN OTP VERIFY COMPONENT
// // // ───────────────────────────────────────────────────────────── */
// // // export default function OtpVerify() {
// // //   const [otp, setOtp]               = useState(["", "", "", "", "", ""]);
// // //   const [opened, setOpened]         = useState(false);
// // //   const [loading, setLoading]       = useState(false);
// // //   const [resendTimer, setResendTimer] = useState(30);
// // //   const [canResend, setCanResend]   = useState(false);
// // //   const [shakeError, setShakeError] = useState(false);
// // //   const [phase, setPhase]           = useState("enter"); // "enter" | "success"

// // //   const inputRefs = useRef([]);
// // //   const navigate  = useNavigate();

// // //   // Trigger envelope open after mount
// // //   useEffect(() => {
// // //     const t = setTimeout(() => setOpened(true), 600);
// // //     return () => clearTimeout(t);
// // //   }, []);

// // //   // Resend countdown
// // //   useEffect(() => {
// // //     if (resendTimer === 0) { setCanResend(true); return; }
// // //     const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
// // //     return () => clearTimeout(t);
// // //   }, [resendTimer]);

// // //   // Auto-focus first input
// // //   useEffect(() => {
// // //     setTimeout(() => inputRefs.current[0]?.focus(), 800);
// // //   }, []);

// // //   const focusedIndex = otp.findIndex((v) => v === "") === -1 ? 5 : otp.findIndex((v) => v === "");

// // //   function handleChange(index, e) {
// // //     const val = e.target.value.replace(/\D/g, "").slice(-1);
// // //     const next = [...otp];
// // //     next[index] = val;
// // //     setOtp(next);
// // //     if (val && index < 5) {
// // //       inputRefs.current[index + 1]?.focus();
// // //     }
// // //   }

// // //   function handleKeyDown(index, e) {
// // //     if (e.key === "Backspace") {
// // //       if (otp[index]) {
// // //         const next = [...otp];
// // //         next[index] = "";
// // //         setOtp(next);
// // //       } else if (index > 0) {
// // //         inputRefs.current[index - 1]?.focus();
// // //         const next = [...otp];
// // //         next[index - 1] = "";
// // //         setOtp(next);
// // //       }
// // //     } else if (e.key === "ArrowLeft" && index > 0) {
// // //       inputRefs.current[index - 1]?.focus();
// // //     } else if (e.key === "ArrowRight" && index < 5) {
// // //       inputRefs.current[index + 1]?.focus();
// // //     }
// // //   }

// // //   function handlePaste(e) {
// // //     e.preventDefault();
// // //     const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
// // //     if (!pasted) return;
// // //     const next = [...otp];
// // //     for (let i = 0; i < 6; i++) next[i] = pasted[i] || "";
// // //     setOtp(next);
// // //     const lastFilled = Math.min(pasted.length, 5);
// // //     inputRefs.current[lastFilled]?.focus();
// // //   }

// // //   async function handleVerify() {
// // //     const code = otp.join("");
// // //     if (code.length < 6) {
// // //       toast.error("Please enter all 6 digits");
// // //       triggerShake();
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     try {
// // //       // Replace with your actual OTP verification service call:
// // //       // await verifyOtpService({ otp: code });

// // //       // Simulated success:
// // //       await new Promise((r) => setTimeout(r, 1200));
// // //       setPhase("success");
// // //       toast.success("Email verified! 🎉");
// // //       setTimeout(() => navigate("/chat"), 2000);
// // //     } catch (err) {
// // //       console.error(err);
// // //       toast.error("Invalid OTP. Try again.");
// // //       triggerShake();
// // //       setOtp(["", "", "", "", "", ""]);
// // //       inputRefs.current[0]?.focus();
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   function triggerShake() {
// // //     setShakeError(true);
// // //     setTimeout(() => setShakeError(false), 600);
// // //   }

// // //   function handleResend() {
// // //     if (!canResend) return;
// // //     // Replace with your resend OTP service call
// // //     toast.success("OTP resent to your email!");
// // //     setOtp(["", "", "", "", "", ""]);
// // //     setResendTimer(30);
// // //     setCanResend(false);
// // //     inputRefs.current[0]?.focus();
// // //   }

// // //   /* ── Floating particles ── */
// // //   const particles = [
// // //     { emoji: "✉️", top: "10%",  left: "8%",  delay: "0s",   dur: "5s"  },
// // //     { emoji: "🔐", top: "20%",  right: "7%", delay: "1.2s", dur: "4s"  },
// // //     { emoji: "✨", bottom: "28%",left: "5%",  delay: "0.6s", dur: "6s"  },
// // //     { emoji: "💌", bottom: "18%",right: "6%", delay: "1.8s", dur: "4.5s"},
// // //     { emoji: "🔑", top: "7%",   right: "22%",delay: "2.2s", dur: "5.5s"},
// // //   ];

// // //   const isComplete = otp.every((v) => v !== "");
// // //   const email      = "user@example.com"; // Replace with: useSelector(state => state.chat.user?.email)

// // //   return (
// // //     <div style={s.root}>
// // //       <Toaster position="top-center" />
// // //       <style>{CSS}</style>

// // //       {/* Background layers */}
// // //       <div style={s.sceneBg} />
// // //       <div style={s.sceneOverlay} />
// // //       <div style={s.ground} />
// // //       <div style={s.groundLine} />

// // //       {/* Floating particles */}
// // //       {particles.map((p, i) => (
// // //         <div
// // //           key={i}
// // //           className="float-particle"
// // //           style={{
// // //             ...s.particle,
// // //             top: p.top, bottom: p.bottom,
// // //             left: p.left, right: p.right,
// // //             animationDelay: p.delay,
// // //             animationDuration: p.dur,
// // //           }}
// // //         >
// // //           {p.emoji}
// // //         </div>
// // //       ))}

// // //       {/* Brand */}
// // //       <div style={s.brand}>
// // //         <div style={s.brandIcon}>💬</div>
// // //         <span style={s.brandName}>ChatApp</span>
// // //       </div>

// // //       {/* Envelope character */}
// // //       <div style={s.envelopeWrap} className="envelope-float">
// // //         <EnvelopeCharacter opened={opened} />
// // //       </div>

// // //       {/* ── OTP Card ── */}
// // //       <div style={s.card} className={phase === "success" ? "card-success" : "card-visible"}>
// // //         <div style={s.cardGlow} />

// // //         {phase === "success" ? (
// // //           /* ── Success State ── */
// // //           <div style={s.successBody}>
// // //             <div style={s.successIcon} className="success-pop">✅</div>
// // //             <h2 style={s.successTitle}>Verified!</h2>
// // //             <p style={s.successSub}>Redirecting you to ChatApp…</p>
// // //             <div style={s.successDots}>
// // //               {[0,1,2].map(i => (
// // //                 <span key={i} className="dot-pulse" style={{ ...s.dot, animationDelay: `${i * 0.2}s` }} />
// // //               ))}
// // //             </div>
// // //           </div>
// // //         ) : (
// // //           /* ── OTP Entry State ── */
// // //           <>
// // //             <div style={s.cardHeader}>
// // //               <span style={s.cardEmoji}>📬</span>
// // //               <h1 style={s.cardTitle}>Verify your email</h1>
// // //               <p style={s.cardSub}>
// // //                 We sent a 6-digit code to<br />
// // //                 <span style={s.emailHighlight}>{email}</span>
// // //               </p>
// // //             </div>

// // //             <div style={s.cardBody}>
// // //               {/* OTP boxes */}
// // //               <div
// // //                 style={s.otpRow}
// // //                 className={shakeError ? "shake" : ""}
// // //               >
// // //                 {otp.map((val, i) => (
// // //                   <OtpBox
// // //                     key={i}
// // //                     value={val}
// // //                     inputRef={(el) => (inputRefs.current[i] = el)}
// // //                     onChange={(e) => handleChange(i, e)}
// // //                     onKeyDown={(e) => handleKeyDown(i, e)}
// // //                     onPaste={handlePaste}
// // //                     isFilled={!!val}
// // //                     isActive={focusedIndex === i}
// // //                   />
// // //                 ))}
// // //               </div>

// // //               {/* Progress dots */}
// // //               <div style={s.progressRow}>
// // //                 {otp.map((v, i) => (
// // //                   <div
// // //                     key={i}
// // //                     style={{
// // //                       ...s.progressDot,
// // //                       ...(v ? s.progressDotFilled : {}),
// // //                     }}
// // //                   />
// // //                 ))}
// // //               </div>

// // //               {/* Verify button */}
// // //               <button
// // //                 onClick={handleVerify}
// // //                 disabled={loading || !isComplete}
// // //                 style={{
// // //                   ...s.verifyBtn,
// // //                   ...(isComplete ? s.verifyBtnActive : {}),
// // //                 }}
// // //                 className="verify-btn"
// // //               >
// // //                 {loading ? (
// // //                   <span style={s.spinner} className="spin" />
// // //                 ) : (
// // //                   <>
// // //                     <span>Verify & Continue</span>
// // //                     <span style={s.btnArrow}>→</span>
// // //                   </>
// // //                 )}
// // //               </button>

// // //               {/* Resend */}
// // //               <div style={s.resendRow}>
// // //                 <span style={s.resendText}>Didn't receive it?&nbsp;</span>
// // //                 {canResend ? (
// // //                   <button onClick={handleResend} style={s.resendBtn} className="resend-btn">
// // //                     Resend OTP
// // //                   </button>
// // //                 ) : (
// // //                   <span style={s.timerText}>
// // //                     Resend in&nbsp;
// // //                     <span style={s.timerNum}>{String(resendTimer).padStart(2, "0")}s</span>
// // //                   </span>
// // //                 )}
// // //               </div>

// // //               {/* Back link */}
// // //               <p style={s.backRow}>
// // //                 Wrong email?{" "}
// // //                 <button onClick={() => navigate(-1)} style={s.backBtn}>
// // //                   Go back
// // //                 </button>
// // //               </p>
// // //             </div>
// // //           </>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /* ─────────────────────────────────────────────────────────────
// // //    STYLES
// // // ───────────────────────────────────────────────────────────── */
// // // const s = {
// // //   root: {
// // //     position: "relative",
// // //     width: "100vw",
// // //     height: "100vh",
// // //     overflow: "hidden",
// // //     display: "flex",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     fontFamily: "'DM Sans', sans-serif",
// // //   },
// // //   sceneBg: {
// // //     position: "absolute", inset: 0, zIndex: 0,
// // //     background: "linear-gradient(170deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
// // //   },
// // //   sceneOverlay: {
// // //     position: "absolute", inset: 0, zIndex: 1,
// // //     backgroundImage: `
// // //       radial-gradient(ellipse at 20% 50%, rgba(0,200,120,0.08) 0%, transparent 60%),
// // //       radial-gradient(ellipse at 80% 50%, rgba(160,0,255,0.08) 0%, transparent 60%)
// // //     `,
// // //   },
// // //   ground: {
// // //     position: "absolute", bottom: 0, left: 0, right: 0, height: "22%", zIndex: 2,
// // //     background: "linear-gradient(180deg, rgba(0,180,100,0.18) 0%, rgba(0,120,70,0.35) 100%)",
// // //     borderTop: "1px solid rgba(0,220,120,0.2)",
// // //   },
// // //   groundLine: {
// // //     position: "absolute", bottom: "22%", left: 0, right: 0, height: 1, zIndex: 3,
// // //     background: "linear-gradient(90deg, transparent, rgba(0,220,120,0.4), transparent)",
// // //   },
// // //   brand: {
// // //     position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)",
// // //     zIndex: 20, display: "flex", alignItems: "center", gap: 10,
// // //   },
// // //   brandIcon: { fontSize: 28 },
// // //   brandName: {
// // //     fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700,
// // //     color: "#fff", letterSpacing: "0.04em",
// // //     textShadow: "0 2px 20px rgba(0,0,0,0.5)",
// // //   },
// // //   particle: {
// // //     position: "absolute", zIndex: 3,
// // //     fontSize: 20, pointerEvents: "none",
// // //     opacity: 0.55,
// // //   },
// // //   envelopeWrap: {
// // //     position: "absolute", bottom: "18%", left: "50%",
// // //     transform: "translateX(-50%)",
// // //     zIndex: 5,
// // //   },
// // //   card: {
// // //     position: "relative", zIndex: 15,
// // //     width: "min(400px, 88vw)",
// // //     background: "rgba(10, 16, 28, 0.85)",
// // //     backdropFilter: "blur(28px)",
// // //     WebkitBackdropFilter: "blur(28px)",
// // //     borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
// // //     borderRadius: 24,
// // //     boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
// // //     overflow: "hidden",
// // //     marginBottom: "26%",
// // //   },
// // //   cardGlow: {
// // //     position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
// // //     background: "linear-gradient(90deg, transparent, rgba(0,220,120,0.6), transparent)",
// // //   },
// // //   cardHeader: {
// // //     padding: "28px 28px 0",
// // //     textAlign: "center",
// // //   },
// // //   cardEmoji: { fontSize: 28, display: "block", marginBottom: 6 },
// // //   cardTitle: {
// // //     fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600,
// // //     color: "#fff", margin: "0 0 8px", letterSpacing: "0.02em",
// // //   },
// // //   cardSub: {
// // //     fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0,
// // //     lineHeight: 1.7,
// // //   },
// // //   emailHighlight: {
// // //     color: "#00c978", fontWeight: 600,
// // //   },
// // //   cardBody: {
// // //     padding: "20px 28px 28px",
// // //     display: "flex", flexDirection: "column", gap: 14,
// // //     alignItems: "center",
// // //   },
// // //   otpRow: {
// // //     display: "flex", gap: 8, justifyContent: "center",
// // //     width: "100%",
// // //   },
// // //   otpBox: {
// // //     width: 48, height: 56,
// // //     borderRadius: 12,
// // //     background: "rgba(255,255,255,0.06)",
// // //     borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
// // //     display: "flex", alignItems: "center", justifyContent: "center",
// // //     transition: "all 0.2s ease",
// // //     flexShrink: 0,
// // //   },
// // //   otpBoxActive: {
// // //     borderColor: "rgba(0,201,120,0.6)",
// // //     background: "rgba(0,201,120,0.07)",
// // //     boxShadow: "0 0 0 3px rgba(0,201,120,0.12)",
// // //   },
// // //   otpBoxFilled: {
// // //     borderColor: "rgba(0,201,120,0.4)",
// // //     background: "rgba(0,201,120,0.1)",
// // //   },
// // //   otpInput: {
// // //     width: "100%", height: "100%",
// // //     background: "transparent", border: "none", outline: "none",
// // //     textAlign: "center",
// // //     fontSize: 22, fontWeight: 700,
// // //     color: "#fff",
// // //     fontFamily: "'DM Sans', sans-serif",
// // //     cursor: "text",
// // //   },
// // //   progressRow: {
// // //     display: "flex", gap: 6, justifyContent: "center",
// // //   },
// // //   progressDot: {
// // //     width: 6, height: 6, borderRadius: "50%",
// // //     background: "rgba(255,255,255,0.15)",
// // //     transition: "all 0.25s ease",
// // //   },
// // //   progressDotFilled: {
// // //     background: "#00c978",
// // //     boxShadow: "0 0 6px rgba(0,201,120,0.6)",
// // //     transform: "scale(1.3)",
// // //   },
// // //   verifyBtn: {
// // //     width: "100%",
// // //     display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
// // //     padding: "13px", borderRadius: 12, border: "none", cursor: "not-allowed",
// // //     background: "rgba(0,201,120,0.25)",
// // //     color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 700,
// // //     fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
// // //     transition: "all 0.3s ease",
// // //     marginTop: 2,
// // //   },
// // //   verifyBtnActive: {
// // //     background: "linear-gradient(135deg, #00c978, #00a896)",
// // //     color: "#fff", cursor: "pointer",
// // //     boxShadow: "0 4px 20px rgba(0,201,120,0.35)",
// // //   },
// // //   btnArrow: { fontSize: 16 },
// // //   spinner: {
// // //     width: 18, height: 18, display: "inline-block",
// // //     borderWidth: 2, borderStyle: "solid",
// // //     borderColor: "rgba(255,255,255,.3)",
// // //     borderTopColor: "#fff",
// // //     borderRadius: "50%",
// // //   },
// // //   resendRow: {
// // //     display: "flex", alignItems: "center", justifyContent: "center",
// // //     fontSize: 12,
// // //   },
// // //   resendText: { color: "rgba(255,255,255,0.35)" },
// // //   resendBtn: {
// // //     background: "none", border: "none", cursor: "pointer",
// // //     color: "#00c978", fontSize: 12, fontWeight: 600,
// // //     textDecoration: "underline", textUnderlineOffset: 3,
// // //     fontFamily: "'DM Sans', sans-serif", padding: 0,
// // //   },
// // //   timerText: {
// // //     color: "rgba(255,255,255,0.35)", fontSize: 12,
// // //     display: "flex", alignItems: "center", gap: 2,
// // //   },
// // //   timerNum: {
// // //     color: "rgba(0,201,120,0.7)", fontWeight: 700, fontVariantNumeric: "tabular-nums",
// // //   },
// // //   backRow: {
// // //     fontSize: 12, color: "rgba(255,255,255,0.4)",
// // //     margin: 0, textAlign: "center",
// // //   },
// // //   backBtn: {
// // //     background: "none", border: "none", cursor: "pointer",
// // //     color: "#00c978", fontSize: 12, fontWeight: 600,
// // //     fontFamily: "'DM Sans', sans-serif", padding: 0,
// // //     textDecoration: "underline", textUnderlineOffset: 3,
// // //   },
// // //   /* Success state */
// // //   successBody: {
// // //     padding: "40px 28px",
// // //     display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
// // //     textAlign: "center",
// // //   },
// // //   successIcon: { fontSize: 52 },
// // //   successTitle: {
// // //     fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700,
// // //     color: "#fff", margin: 0,
// // //   },
// // //   successSub: {
// // //     fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0,
// // //   },
// // //   successDots: {
// // //     display: "flex", gap: 8, marginTop: 4,
// // //   },
// // //   dot: {
// // //     width: 8, height: 8, borderRadius: "50%",
// // //     background: "#00c978",
// // //     display: "inline-block",
// // //   },
// // // };

// // // /* ─────────────────────────────────────────────────────────────
// // //    GLOBAL CSS
// // // ───────────────────────────────────────────────────────────── */
// // // const CSS = `
// // //   @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

// // //   .float-particle {
// // //     animation: particleFloat 5s ease-in-out infinite;
// // //   }
// // //   @keyframes particleFloat {
// // //     0%, 100% { transform: translateY(0) rotate(0deg); }
// // //     33%       { transform: translateY(-14px) rotate(8deg); }
// // //     66%       { transform: translateY(-6px) rotate(-6deg); }
// // //   }

// // //   .envelope-float {
// // //     animation: envelopeFloat 3s ease-in-out infinite;
// // //   }
// // //   @keyframes envelopeFloat {
// // //     0%, 100% { transform: translateX(-50%) translateY(0); }
// // //     50%       { transform: translateX(-50%) translateY(-8px); }
// // //   }

// // //   @keyframes letterPeek {
// // //     from { transform: translateY(20px); opacity: 0; }
// // //     to   { transform: translateY(0); opacity: 1; }
// // //   }

// // //   .shake {
// // //     animation: shake 0.55s cubic-bezier(.36,.07,.19,.97) both;
// // //   }
// // //   @keyframes shake {
// // //     10%, 90% { transform: translateX(-2px); }
// // //     20%, 80% { transform: translateX(4px); }
// // //     30%, 50%, 70% { transform: translateX(-6px); }
// // //     40%, 60% { transform: translateX(6px); }
// // //   }

// // //   .card-visible {
// // //     animation: cardIn 0.5s cubic-bezier(.34,1.56,.64,1) both;
// // //   }
// // //   @keyframes cardIn {
// // //     from { opacity: 0; transform: translateY(20px) scale(.95); }
// // //     to   { opacity: 1; transform: translateY(0) scale(1); }
// // //   }

// // //   .card-success {
// // //     animation: successPop 0.4s cubic-bezier(.34,1.56,.64,1) both;
// // //     border-color: rgba(0,201,120,0.35) !important;
// // //     box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,201,120,0.15) !important;
// // //   }

// // //   .success-pop {
// // //     animation: successPop 0.5s cubic-bezier(.34,1.56,.64,1) 0.1s both;
// // //   }
// // //   @keyframes successPop {
// // //     from { transform: scale(0); opacity: 0; }
// // //     to   { transform: scale(1); opacity: 1; }
// // //   }

// // //   .dot-pulse {
// // //     animation: dotPulse 1.2s ease-in-out infinite;
// // //   }
// // //   @keyframes dotPulse {
// // //     0%, 100% { transform: scale(1); opacity: 0.4; }
// // //     50%       { transform: scale(1.4); opacity: 1; }
// // //   }

// // //   .verify-btn:hover:not(:disabled) {
// // //     transform: translateY(-2px);
// // //     box-shadow: 0 8px 28px rgba(0,201,120,.55) !important;
// // //   }
// // //   .verify-btn:active:not(:disabled) { transform: scale(.98); }

// // //   .resend-btn:hover { opacity: 0.8; }

// // //   input::placeholder { color: rgba(255,255,255,0.25) !important; }
// // //   input[type="text"]::-webkit-outer-spin-button,
// // //   input[type="text"]::-webkit-inner-spin-button { -webkit-appearance: none; }
// // // `;
// // import { useState, useEffect, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import toast, { Toaster } from "react-hot-toast";

// // /* ─────────────────────────────────────────────────────────────
// //    ENVELOPE CHARACTER
// // ───────────────────────────────────────────────────────────── */
// // function EnvelopeCharacter({ opened }) {
// //   return (
// //     <svg viewBox="0 0 160 160" style={{ width: 110, height: 110, display: "block" }} xmlns="http://www.w3.org/2000/svg">
// //       <ellipse cx="80" cy="148" rx="38" ry="7" fill="rgba(0,0,0,0.22)" />
// //       <rect x="18" y="55" width="124" height="84" rx="10" fill="#1a2a3a" stroke="rgba(0,201,120,0.5)" strokeWidth="1.5" />
// //       <g style={{ transformOrigin: "80px 55px", transform: opened ? "rotateX(180deg)" : "rotateX(0deg)", transition: "transform 0.6s cubic-bezier(.4,2,.6,1)" }}>
// //         <path d="M18 55 L80 100 L142 55 Z" fill="#203a43" stroke="rgba(0,201,120,0.35)" strokeWidth="1" />
// //       </g>
// //       {!opened && (
// //         <>
// //           <line x1="18" y1="55" x2="80" y2="100" stroke="rgba(0,201,120,0.4)" strokeWidth="1.2" />
// //           <line x1="142" y1="55" x2="80" y2="100" stroke="rgba(0,201,120,0.4)" strokeWidth="1.2" />
// //         </>
// //       )}
// //       {opened && (
// //         <g style={{ animation: "letterPeek 0.5s ease 0.4s both" }}>
// //           <rect x="52" y="28" width="56" height="48" rx="4" fill="#fff" opacity="0.95" />
// //           <line x1="61" y1="40" x2="99" y2="40" stroke="#00c978" strokeWidth="2.5" strokeLinecap="round" />
// //           <line x1="61" y1="50" x2="99" y2="50" stroke="rgba(0,0,0,0.15)" strokeWidth="2" strokeLinecap="round" />
// //           <line x1="61" y1="59" x2="85" y2="59" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />
// //           <text x="88" y="62" fontSize="10">✨</text>
// //         </g>
// //       )}
// //       <ellipse cx="63" cy="112" rx="5" ry="5.5" fill="#fff" />
// //       <ellipse cx="97" cy="112" rx="5" ry="5.5" fill="#fff" />
// //       <circle cx="64" cy="113" r="3" fill="#1a1a1a" />
// //       <circle cx="98" cy="113" r="3" fill="#1a1a1a" />
// //       <circle cx="65" cy="112" r="1" fill="#fff" />
// //       <circle cx="99" cy="112" r="1" fill="#fff" />
// //       <path d="M59 108 Q63 105 67 108" stroke="#3d5a6e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
// //       <path d="M93 108 Q97 105 101 108" stroke="#3d5a6e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
// //       <path
// //         d={opened ? "M71 124 Q80 132 89 124" : "M71 122 Q80 118 89 122"}
// //         stroke="#00c978" strokeWidth="2" fill="none" strokeLinecap="round"
// //         style={{ transition: "d 0.4s ease" }}
// //       />
// //       {opened && (
// //         <>
// //           <ellipse cx="54" cy="120" rx="7" ry="5" fill="rgba(255,100,100,0.25)" />
// //           <ellipse cx="106" cy="120" rx="7" ry="5" fill="rgba(255,100,100,0.25)" />
// //         </>
// //       )}
// //       <rect x="102" y="18" width="50" height="26" rx="8" fill="#fff" opacity="0.95" />
// //       <polygon points="110,44 116,44 110,52" fill="#fff" opacity="0.95" />
// //       <text x="127" y="28" textAnchor="middle" fontSize="8" fill="#00c978" fontWeight="bold" fontFamily="sans-serif">
// //         {opened ? "Got it! 🎉" : "Check 📧"}
// //       </text>
// //       <text x="127" y="39" textAnchor="middle" fontSize="7" fill="#555" fontFamily="sans-serif">
// //         {opened ? "Enter OTP" : "Email sent!"}
// //       </text>
// //     </svg>
// //   );
// // }

// // /* ─────────────────────────────────────────────────────────────
// //    SINGLE OTP BOX
// // ───────────────────────────────────────────────────────────── */
// // function OtpBox({ value, inputRef, onChange, onKeyDown, onPaste, isFilled, isActive }) {
// //   return (
// //     <div style={{ ...s.otpBox, ...(isActive ? s.otpBoxActive : {}), ...(isFilled ? s.otpBoxFilled : {}) }}>
// //       <input
// //         ref={inputRef}
// //         type="text"
// //         inputMode="numeric"
// //         maxLength={1}
// //         value={value}
// //         onChange={onChange}
// //         onKeyDown={onKeyDown}
// //         onPaste={onPaste}
// //         style={s.otpInput}
// //       />
// //     </div>
// //   );
// // }

// // /* ─────────────────────────────────────────────────────────────
// //    MAIN OTP COMPONENT
// // ───────────────────────────────────────────────────────────── */
// // export default function OtpVerify() {
// //   const [otp, setOtp]                 = useState(["", "", "", "", "", ""]);
// //   const [opened, setOpened]           = useState(false);
// //   const [loading, setLoading]         = useState(false);
// //   const [resendTimer, setResendTimer] = useState(30);
// //   const [canResend, setCanResend]     = useState(false);
// //   const [shakeError, setShakeError]   = useState(false);
// //   const [phase, setPhase]             = useState("enter");
// //   const [smokeActive, setSmokeActive] = useState(false);
// //   const [cardLanded, setCardLanded]   = useState(false);

// //   const inputRefs = useRef([]);
// //   const navigate  = useNavigate();

// //   /* Sequence: card drops (0.75s) → smoke bursts at impact (0.62s) → envelope opens (1.2s) → focus input */
// //   useEffect(() => {
// //     const t1 = setTimeout(() => setSmokeActive(true),                620);
// //     const t2 = setTimeout(() => setCardLanded(true),                 760);
// //     const t3 = setTimeout(() => setSmokeActive(false),              2200);
// //     const t4 = setTimeout(() => setOpened(true),                    1200);
// //     const t5 = setTimeout(() => inputRefs.current[0]?.focus(),      1450);
// //     return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
// //   }, []);

// //   /* Resend countdown */
// //   useEffect(() => {
// //     if (resendTimer === 0) { setCanResend(true); return; }
// //     const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
// //     return () => clearTimeout(t);
// //   }, [resendTimer]);

// //   const focusedIndex = otp.findIndex((v) => v === "") === -1 ? 5 : otp.findIndex((v) => v === "");

// //   function handleChange(index, e) {
// //     const val = e.target.value.replace(/\D/g, "").slice(-1);
// //     const next = [...otp]; next[index] = val; setOtp(next);
// //     if (val && index < 5) inputRefs.current[index + 1]?.focus();
// //   }

// //   function handleKeyDown(index, e) {
// //     if (e.key === "Backspace") {
// //       if (otp[index]) { const n=[...otp]; n[index]=""; setOtp(n); }
// //       else if (index > 0) { inputRefs.current[index-1]?.focus(); const n=[...otp]; n[index-1]=""; setOtp(n); }
// //     } else if (e.key === "ArrowLeft"  && index > 0) inputRefs.current[index-1]?.focus();
// //     else if   (e.key === "ArrowRight" && index < 5) inputRefs.current[index+1]?.focus();
// //   }

// //   function handlePaste(e) {
// //     e.preventDefault();
// //     const p = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
// //     if (!p) return;
// //     const n=[...otp]; for(let i=0;i<6;i++) n[i]=p[i]||""; setOtp(n);
// //     inputRefs.current[Math.min(p.length,5)]?.focus();
// //   }

// //   async function handleVerify() {
// //     const code = otp.join("");
// //     if (code.length < 6) { toast.error("Please enter all 6 digits"); triggerShake(); return; }
// //     setLoading(true);
// //     try {
// //       await new Promise((r) => setTimeout(r, 1200)); // ← replace with: await verifyOtpService({ otp: code })
// //       setPhase("success");
// //       toast.success("Email verified! 🎉");
// //       setTimeout(() => navigate("/chat"), 2000);
// //     } catch {
// //       toast.error("Invalid OTP. Try again.");
// //       triggerShake();
// //       setOtp(["","","","","",""]);
// //       inputRefs.current[0]?.focus();
// //     } finally { setLoading(false); }
// //   }

// //   function triggerShake() {
// //     setShakeError(true); setTimeout(() => setShakeError(false), 600);
// //   }

// //   function handleResend() {
// //     if (!canResend) return;
// //     toast.success("OTP resent to your email!");
// //     setOtp(["","","","","",""]); setResendTimer(30); setCanResend(false);
// //     inputRefs.current[0]?.focus();
// //   }

// //   const isComplete = otp.every((v) => v !== "");
// //   const email = "user@example.com"; // Replace: useSelector(state => state.chat.user?.email)

// //   const particles = [
// //     { emoji: "✉️", top: "10%",   left: "8%",   delay: "0s",   dur: "5s"   },
// //     { emoji: "🔐", top: "20%",   right: "7%",  delay: "1.2s", dur: "4s"   },
// //     { emoji: "✨", bottom: "30%",left: "5%",   delay: "0.6s", dur: "6s"   },
// //     { emoji: "💌", bottom: "20%",right: "6%",  delay: "1.8s", dur: "4.5s" },
// //     { emoji: "🔑", top: "7%",    right: "22%", delay: "2.2s", dur: "5.5s" },
// //   ];

// //   /* 12 smoke puff configs: [offsetX, offsetY, size, hue-tint] */
// //   const smokeCfg = [
// //     [-70,  0,  88, 180], [ 70,  0,  88, 185],
// //     [-130,-10, 70, 175], [130,-10,  70, 190],
// //     [-180,-20, 55, 170], [180,-20,  55, 195],
// //     [ -30, -5,100, 182], [ 30, -5, 100, 178],
// //     [-100,-15, 65, 188], [100,-15,  65, 183],
// //     [ -50, -8, 78, 176], [ 50, -8,  78, 187],
// //   ];

// //   return (
// //     <div style={s.root}>
// //       <Toaster position="top-center" />
// //       <style>{CSS}</style>

// //       {/* ── Scene background ── */}
// //       <div style={s.sceneBg} />
// //       <div style={s.sceneOverlay} />
// //       <div style={s.ground} />
// //       <div style={s.groundLine} />

// //       {/* ── Floating particles ── */}
// //       {particles.map((p, i) => (
// //         <div key={i} className="float-particle" style={{
// //           ...s.particle, top: p.top, bottom: p.bottom,
// //           left: p.left, right: p.right,
// //           animationDelay: p.delay, animationDuration: p.dur,
// //         }}>{p.emoji}</div>
// //       ))}

// //       {/* ── Brand ── */}
// //       <div style={s.brand}>
// //         <span style={s.brandIcon}>💬</span>
// //         <span style={s.brandName}>ChatApp</span>
// //       </div>

// //       {/* ── Shockwave ring at impact ── */}
// //       {smokeActive && <div style={s.shockwave} className="shockwave-burst" />}

// //       {/* ── Smoke puffs ── */}
// //       {smokeCfg.map(([ox, oy, sz, hue], i) => (
// //         <div
// //           key={i}
// //           className={smokeActive ? `smoke-puff smoke-puff-${i}` : ""}
// //           style={{
// //             position: "absolute",
// //             bottom: "calc(26% + 20px)",
// //             left: `calc(50% + ${ox}px)`,
// //             marginLeft: -sz / 2,
// //             width: sz, height: sz,
// //             borderRadius: "50%",
// //             background: `radial-gradient(circle, hsla(${hue},30%,75%,0.6) 0%, hsla(${hue},20%,60%,0.25) 50%, transparent 72%)`,
// //             pointerEvents: "none",
// //             opacity: 0,
// //             zIndex: 13,
// //           }}
// //         />
// //       ))}

// //       {/* ══════════════════════════════
// //           DROP WRAPPER — falls from top
// //       ══════════════════════════════ */}
// //       <div style={s.dropWrapper} className="card-drop">

// //         {/* Envelope sits on top of card */}
// //         <div style={s.envelopeOnCard} className={cardLanded ? "envelope-idle" : ""}>
// //           <EnvelopeCharacter opened={opened} />
// //         </div>

// //         {/* OTP Card */}
// //         <div style={s.card} className={phase === "success" ? "card-success" : ""}>
// //           <div style={s.cardGlow} />

// //           {phase === "success" ? (
// //             <div style={s.successBody}>
// //               <div style={s.successIcon} className="success-pop">✅</div>
// //               <h2 style={s.successTitle}>Verified!</h2>
// //               <p style={s.successSub}>Redirecting you to ChatApp…</p>
// //               <div style={s.successDots}>
// //                 {[0,1,2].map(i => (
// //                   <span key={i} className="dot-pulse"
// //                     style={{ ...s.dot, animationDelay: `${i*0.2}s` }} />
// //                 ))}
// //               </div>
// //             </div>
// //           ) : (
// //             <>
// //               <div style={s.cardHeader}>
// //                 <span style={s.cardEmoji}>📬</span>
// //                 <h1 style={s.cardTitle}>Verify your email</h1>
// //                 <p style={s.cardSub}>
// //                   We sent a 6-digit code to<br />
// //                   <span style={s.emailHighlight}>{email}</span>
// //                 </p>
// //               </div>

// //               <div style={s.cardBody}>

// //                 <div style={s.otpRow} className={shakeError ? "shake" : ""}>
// //                   {otp.map((val, i) => (
// //                     <OtpBox key={i} value={val}
// //                       inputRef={(el) => (inputRefs.current[i] = el)}
// //                       onChange={(e) => handleChange(i, e)}
// //                       onKeyDown={(e) => handleKeyDown(i, e)}
// //                       onPaste={handlePaste}
// //                       isFilled={!!val}
// //                       isActive={focusedIndex === i}
// //                     />
// //                   ))}
// //                 </div>

// //                 <div style={s.progressRow}>
// //                   {otp.map((v, i) => (
// //                     <div key={i} style={{ ...s.progressDot, ...(v ? s.progressDotFilled : {}) }} />
// //                   ))}
// //                 </div>

// //                 <button
// //                   onClick={handleVerify}
// //                   disabled={loading || !isComplete}
// //                   style={{ ...s.verifyBtn, ...(isComplete ? s.verifyBtnActive : {}) }}
// //                   className="verify-btn"
// //                 >
// //                   {loading ? (
// //                     <span style={s.spinner} className="spin" />
// //                   ) : (
// //                     <><span>Verify & Continue</span><span style={s.btnArrow}>→</span></>
// //                   )}
// //                 </button>

// //                 <div style={s.resendRow}>
// //                   <span style={s.resendText}>Didn't receive it?&nbsp;</span>
// //                   {canResend ? (
// //                     <button onClick={handleResend} style={s.resendBtn} className="resend-btn">Resend OTP</button>
// //                   ) : (
// //                     <span style={s.timerText}>
// //                       Resend in&nbsp;
// //                       <span style={s.timerNum}>{String(resendTimer).padStart(2,"0")}s</span>
// //                     </span>
// //                   )}
// //                 </div>

// //                 <p style={s.backRow}>
// //                   Wrong email?{" "}
// //                   <button onClick={() => navigate(-1)} style={s.backBtn}>Go back</button>
// //                 </p>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //       {/* end dropWrapper */}

// //     </div>
// //   );
// // }

// // /* ─────────────────────────────────────────────────────────────
// //    STYLES
// // ───────────────────────────────────────────────────────────── */
// // const s = {
// //   root: {
// //     position: "relative", width: "100vw", height: "100vh",
// //     overflow: "hidden",
// //     display: "flex", alignItems: "center", justifyContent: "center",
// //     fontFamily: "'DM Sans', sans-serif",
// //   },
// //   sceneBg: {
// //     position: "absolute", inset: 0, zIndex: 0,
// //     background: "linear-gradient(170deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
// //   },
// //   sceneOverlay: {
// //     position: "absolute", inset: 0, zIndex: 1,
// //     backgroundImage: `
// //       radial-gradient(ellipse at 20% 50%, rgba(0,200,120,0.08) 0%, transparent 60%),
// //       radial-gradient(ellipse at 80% 50%, rgba(160,0,255,0.08) 0%, transparent 60%)
// //     `,
// //   },
// //   ground: {
// //     position: "absolute", bottom: 0, left: 0, right: 0, height: "22%", zIndex: 2,
// //     background: "linear-gradient(180deg, rgba(0,180,100,0.18) 0%, rgba(0,120,70,0.35) 100%)",
// //     borderTop: "1px solid rgba(0,220,120,0.2)",
// //   },
// //   groundLine: {
// //     position: "absolute", bottom: "22%", left: 0, right: 0, height: 1, zIndex: 3,
// //     background: "linear-gradient(90deg, transparent, rgba(0,220,120,0.4), transparent)",
// //   },
// //   brand: {
// //     position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)",
// //     zIndex: 20, display: "flex", alignItems: "center", gap: 10,
// //   },
// //   brandIcon: { fontSize: 28 },
// //   brandName: {
// //     fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700,
// //     color: "#fff", letterSpacing: "0.04em",
// //     textShadow: "0 2px 20px rgba(0,0,0,0.5)",
// //   },
// //   particle: {
// //     position: "absolute", zIndex: 3, fontSize: 20,
// //     pointerEvents: "none", opacity: 0.55,
// //   },
// //   /* The whole drop unit */
// //   dropWrapper: {
// //     position: "relative", zIndex: 15,
// //     display: "flex", flexDirection: "column", alignItems: "center",
// //     marginBottom: "6%",
// //   },
// //   envelopeOnCard: {
// //     zIndex: 16, marginBottom: -10, position: "relative",
// //   },
// //   card: {
// //     position: "relative",
// //     width: "min(400px, 88vw)",
// //     background: "rgba(10, 16, 28, 0.88)",
// //     backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
// //     borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
// //     borderRadius: 24,
// //     boxShadow: "0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
// //     overflow: "hidden",
// //   },
// //   cardGlow: {
// //     position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
// //     background: "linear-gradient(90deg, transparent, rgba(0,220,120,0.6), transparent)",
// //   },
// //   cardHeader: { padding: "28px 28px 0", textAlign: "center" },
// //   cardEmoji: { fontSize: 28, display: "block", marginBottom: 6 },
// //   cardTitle: {
// //     fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600,
// //     color: "#fff", margin: "0 0 8px", letterSpacing: "0.02em",
// //   },
// //   cardSub: { fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.7 },
// //   emailHighlight: { color: "#00c978", fontWeight: 600 },
// //   cardBody: {
// //     padding: "20px 28px 28px",
// //     display: "flex", flexDirection: "column", gap: 14, alignItems: "center",
// //   },
// //   otpRow: { display: "flex", gap: 8, justifyContent: "center", width: "100%" },
// //   otpBox: {
// //     width: 48, height: 56, borderRadius: 12,
// //     background: "rgba(255,255,255,0.06)",
// //     borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
// //     display: "flex", alignItems: "center", justifyContent: "center",
// //     transition: "all 0.2s ease", flexShrink: 0,
// //   },
// //   otpBoxActive: {
// //     borderColor: "rgba(0,201,120,0.6)", background: "rgba(0,201,120,0.07)",
// //     boxShadow: "0 0 0 3px rgba(0,201,120,0.12)",
// //   },
// //   otpBoxFilled: { borderColor: "rgba(0,201,120,0.4)", background: "rgba(0,201,120,0.1)" },
// //   otpInput: {
// //     width: "100%", height: "100%",
// //     background: "transparent", border: "none", outline: "none",
// //     textAlign: "center", fontSize: 22, fontWeight: 700, color: "#fff",
// //     fontFamily: "'DM Sans', sans-serif", cursor: "text",
// //   },
// //   progressRow: { display: "flex", gap: 6, justifyContent: "center" },
// //   progressDot: {
// //     width: 6, height: 6, borderRadius: "50%",
// //     background: "rgba(255,255,255,0.15)", transition: "all 0.25s ease",
// //   },
// //   progressDotFilled: {
// //     background: "#00c978", boxShadow: "0 0 6px rgba(0,201,120,0.6)", transform: "scale(1.3)",
// //   },
// //   verifyBtn: {
// //     width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
// //     padding: "13px", borderRadius: 12, border: "none", cursor: "not-allowed",
// //     background: "rgba(0,201,120,0.25)", color: "rgba(255,255,255,0.4)",
// //     fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
// //     letterSpacing: "0.04em", transition: "all 0.3s ease", marginTop: 2,
// //   },
// //   verifyBtnActive: {
// //     background: "linear-gradient(135deg, #00c978, #00a896)",
// //     color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,201,120,0.35)",
// //   },
// //   btnArrow: { fontSize: 16 },
// //   spinner: {
// //     width: 18, height: 18, display: "inline-block",
// //     borderWidth: 2, borderStyle: "solid",
// //     borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%",
// //   },
// //   resendRow: { display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 },
// //   resendText: { color: "rgba(255,255,255,0.35)" },
// //   resendBtn: {
// //     background: "none", border: "none", cursor: "pointer", color: "#00c978",
// //     fontSize: 12, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3,
// //     fontFamily: "'DM Sans', sans-serif", padding: 0,
// //   },
// //   timerText: { color: "rgba(255,255,255,0.35)", fontSize: 12, display: "flex", alignItems: "center", gap: 2 },
// //   timerNum: { color: "rgba(0,201,120,0.7)", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
// //   backRow: { fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, textAlign: "center" },
// //   backBtn: {
// //     background: "none", border: "none", cursor: "pointer", color: "#00c978",
// //     fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", padding: 0,
// //     textDecoration: "underline", textUnderlineOffset: 3,
// //   },
// //   successBody: {
// //     padding: "40px 28px", display: "flex", flexDirection: "column",
// //     alignItems: "center", gap: 12, textAlign: "center",
// //   },
// //   successIcon: { fontSize: 52 },
// //   successTitle: {
// //     fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "#fff", margin: 0,
// //   },
// //   successSub: { fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 },
// //   successDots: { display: "flex", gap: 8, marginTop: 4 },
// //   dot: { width: 8, height: 8, borderRadius: "50%", background: "#00c978", display: "inline-block" },
// //   shockwave: {
// //     position: "absolute",
// //     bottom: "calc(26% - 10px)",
// //     left: "50%",
// //     transform: "translateX(-50%)",
// //     width: 30, height: 30, borderRadius: "50%",
// //     border: "2px solid rgba(0,201,120,0.8)",
// //     zIndex: 14, pointerEvents: "none",
// //   },
// // };

// // /* ─────────────────────────────────────────────────────────────
// //    GLOBAL CSS
// // ───────────────────────────────────────────────────────────── */
// // const CSS = `
// //   @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

// //   /* ══════════════════════════════════════════
// //      CARD + ENVELOPE DROP FROM TOP
// //      Falls from -130vh, hits ground, bounces
// //   ══════════════════════════════════════════ */
// //   .card-drop {
// //     animation: cardDrop 0.78s cubic-bezier(0.2, 0, 0.4, 1) both;
// //   }

// //   @keyframes cardDrop {
// //     0%   { transform: translateY(-130vh);                              opacity: 0;   }
// //     55%  { transform: translateY(-130vh);                              opacity: 0;   }
// //     70%  { transform: translateY(-130vh);                              opacity: 1;   }
// //     82%  { transform: translateY(22px)  scaleX(1.05) scaleY(0.91);               }
// //     90%  { transform: translateY(-14px) scaleX(0.97) scaleY(1.05);               }
// //     95%  { transform: translateY(6px)   scaleX(1.01) scaleY(0.99);               }
// //     100% { transform: translateY(0)     scaleX(1)    scaleY(1);        opacity: 1;   }
// //   }

// //   /* ══════════════════════════════════════════
// //      SMOKE PUFFS
// //      Each puff bursts outward from impact point
// //   ══════════════════════════════════════════ */
// //   .smoke-puff {
// //     animation: smokeBurst 1.5s ease-out forwards;
// //   }

// //   /* Staggered delays for organic feel */
// //   .smoke-puff-0  { animation-delay: 0s;     --dy: -35px; }
// //   .smoke-puff-1  { animation-delay: 0.04s;  --dy: -35px; }
// //   .smoke-puff-2  { animation-delay: 0.09s;  --dy: -28px; }
// //   .smoke-puff-3  { animation-delay: 0.09s;  --dy: -28px; }
// //   .smoke-puff-4  { animation-delay: 0.15s;  --dy: -20px; }
// //   .smoke-puff-5  { animation-delay: 0.15s;  --dy: -20px; }
// //   .smoke-puff-6  { animation-delay: 0.02s;  --dy: -40px; }
// //   .smoke-puff-7  { animation-delay: 0.02s;  --dy: -40px; }
// //   .smoke-puff-8  { animation-delay: 0.11s;  --dy: -25px; }
// //   .smoke-puff-9  { animation-delay: 0.11s;  --dy: -25px; }
// //   .smoke-puff-10 { animation-delay: 0.06s;  --dy: -32px; }
// //   .smoke-puff-11 { animation-delay: 0.06s;  --dy: -32px; }

// //   @keyframes smokeBurst {
// //     0%   { opacity: 0;    transform: scale(0.15) translateY(0);                      }
// //     12%  { opacity: 0.7;  transform: scale(0.55) translateY(calc(var(--dy) * 0.3));  }
// //     35%  { opacity: 0.5;  transform: scale(1.0)  translateY(calc(var(--dy) * 0.7));  }
// //     65%  { opacity: 0.22; transform: scale(1.35) translateY(var(--dy));              }
// //     100% { opacity: 0;    transform: scale(1.7)  translateY(calc(var(--dy) * 1.5));  }
// //   }

// //   /* ══════════════════════════════════════════
// //      SHOCKWAVE RING — expands from impact point
// //   ══════════════════════════════════════════ */
// //   .shockwave-burst {
// //     animation: shockwaveRing 0.65s ease-out forwards;
// //   }
// //   @keyframes shockwaveRing {
// //     0%   { transform: translateX(-50%) scale(0.4); opacity: 1;   }
// //     100% { transform: translateX(-50%) scale(20);  opacity: 0;   }
// //   }

// //   /* ══════════════════════════════════════════
// //      ENVELOPE IDLE FLOAT (after landing)
// //   ══════════════════════════════════════════ */
// //   .envelope-idle {
// //     animation: envelopeIdle 3.2s ease-in-out infinite;
// //   }
// //   @keyframes envelopeIdle {
// //     0%, 100% { transform: translateY(0); }
// //     50%       { transform: translateY(-8px); }
// //   }

// //   /* ══════════════════════════════════════════
// //      LETTER PEEK inside envelope
// //   ══════════════════════════════════════════ */
// //   @keyframes letterPeek {
// //     from { transform: translateY(20px); opacity: 0; }
// //     to   { transform: translateY(0);    opacity: 1; }
// //   }

// //   /* ══════════════════════════════════════════
// //      FLOATING BACKGROUND PARTICLES
// //   ══════════════════════════════════════════ */
// //   .float-particle {
// //     position: absolute;
// //     animation: particleFloat 5s ease-in-out infinite;
// //   }
// //   @keyframes particleFloat {
// //     0%, 100% { transform: translateY(0)    rotate(0deg);  }
// //     33%       { transform: translateY(-14px) rotate(8deg); }
// //     66%       { transform: translateY(-6px)  rotate(-6deg);}
// //   }

// //   /* ══════════════════════════════════════════
// //      SUCCESS
// //   ══════════════════════════════════════════ */
// //   .card-success {
// //     border-color: rgba(0,201,120,0.35) !important;
// //     box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,201,120,0.15) !important;
// //   }
// //   .success-pop {
// //     animation: successPop 0.5s cubic-bezier(.34,1.56,.64,1) 0.1s both;
// //   }
// //   @keyframes successPop {
// //     from { transform: scale(0); opacity: 0; }
// //     to   { transform: scale(1); opacity: 1; }
// //   }
// //   .dot-pulse { animation: dotPulse 1.2s ease-in-out infinite; }
// //   @keyframes dotPulse {
// //     0%, 100% { transform: scale(1);   opacity: 0.4; }
// //     50%       { transform: scale(1.4); opacity: 1;   }
// //   }

// //   /* ══════════════════════════════════════════
// //      MISC
// //   ══════════════════════════════════════════ */
// //   .shake { animation: shake 0.55s cubic-bezier(.36,.07,.19,.97) both; }
// //   @keyframes shake {
// //     10%, 90% { transform: translateX(-2px); }
// //     20%, 80% { transform: translateX(4px);  }
// //     30%, 50%, 70% { transform: translateX(-6px); }
// //     40%, 60% { transform: translateX(6px);  }
// //   }

// //   .verify-btn:hover:not(:disabled) {
// //     transform: translateY(-2px);
// //     box-shadow: 0 8px 28px rgba(0,201,120,.55) !important;
// //   }
// //   .verify-btn:active:not(:disabled) { transform: scale(.98); }
// //   .resend-btn:hover { opacity: 0.8; }
// //   .spin { animation: spin .75s linear infinite; }
// //   @keyframes spin { to { transform: rotate(360deg); } }

// //   input::placeholder { color: rgba(255,255,255,0.25) !important; }
// //   input[type="text"]::-webkit-outer-spin-button,
// //   input[type="text"]::-webkit-inner-spin-button { -webkit-appearance: none; }
// // `;


// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";

// /* ─────────────────────────────────────────────────────────────
//    ENVELOPE CHARACTER
// ───────────────────────────────────────────────────────────── */
// function EnvelopeCharacter({ opened }) {
//   return (
//     <svg viewBox="0 0 160 160" style={{ width: 110, height: 110, display: "block" }} xmlns="http://www.w3.org/2000/svg">
//       <ellipse cx="80" cy="148" rx="38" ry="7" fill="rgba(0,0,0,0.22)" />
//       <rect x="18" y="55" width="124" height="84" rx="10" fill="#1a2a3a" stroke="rgba(0,201,120,0.5)" strokeWidth="1.5" />
//       <g style={{ transformOrigin: "80px 55px", transform: opened ? "rotateX(180deg)" : "rotateX(0deg)", transition: "transform 0.6s cubic-bezier(.4,2,.6,1)" }}>
//         <path d="M18 55 L80 100 L142 55 Z" fill="#203a43" stroke="rgba(0,201,120,0.35)" strokeWidth="1" />
//       </g>
//       {!opened && (
//         <>
//           <line x1="18" y1="55" x2="80" y2="100" stroke="rgba(0,201,120,0.4)" strokeWidth="1.2" />
//           <line x1="142" y1="55" x2="80" y2="100" stroke="rgba(0,201,120,0.4)" strokeWidth="1.2" />
//         </>
//       )}
//       {opened && (
//         <g style={{ animation: "letterPeek 0.5s ease 0.4s both" }}>
//           <rect x="52" y="28" width="56" height="48" rx="4" fill="#fff" opacity="0.95" />
//           <line x1="61" y1="40" x2="99" y2="40" stroke="#00c978" strokeWidth="2.5" strokeLinecap="round" />
//           <line x1="61" y1="50" x2="99" y2="50" stroke="rgba(0,0,0,0.15)" strokeWidth="2" strokeLinecap="round" />
//           <line x1="61" y1="59" x2="85" y2="59" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />
//           <text x="88" y="62" fontSize="10">✨</text>
//         </g>
//       )}
//       <ellipse cx="63" cy="112" rx="5" ry="5.5" fill="#fff" />
//       <ellipse cx="97" cy="112" rx="5" ry="5.5" fill="#fff" />
//       <circle cx="64" cy="113" r="3" fill="#1a1a1a" />
//       <circle cx="98" cy="113" r="3" fill="#1a1a1a" />
//       <circle cx="65" cy="112" r="1" fill="#fff" />
//       <circle cx="99" cy="112" r="1" fill="#fff" />
//       <path d="M59 108 Q63 105 67 108" stroke="#3d5a6e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
//       <path d="M93 108 Q97 105 101 108" stroke="#3d5a6e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
//       <path
//         d={opened ? "M71 124 Q80 132 89 124" : "M71 122 Q80 118 89 122"}
//         stroke="#00c978" strokeWidth="2" fill="none" strokeLinecap="round"
//         style={{ transition: "d 0.4s ease" }}
//       />
//       {opened && (
//         <>
//           <ellipse cx="54" cy="120" rx="7" ry="5" fill="rgba(255,100,100,0.25)" />
//           <ellipse cx="106" cy="120" rx="7" ry="5" fill="rgba(255,100,100,0.25)" />
//         </>
//       )}
//       <rect x="102" y="18" width="50" height="26" rx="8" fill="#fff" opacity="0.95" />
//       <polygon points="110,44 116,44 110,52" fill="#fff" opacity="0.95" />
//       <text x="127" y="28" textAnchor="middle" fontSize="8" fill="#00c978" fontWeight="bold" fontFamily="sans-serif">
//         {opened ? "Got it! 🎉" : "Check 📧"}
//       </text>
//       <text x="127" y="39" textAnchor="middle" fontSize="7" fill="#555" fontFamily="sans-serif">
//         {opened ? "Enter OTP" : "Email sent!"}
//       </text>
//     </svg>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    SINGLE OTP BOX
// ───────────────────────────────────────────────────────────── */
// function OtpBox({ value, inputRef, onChange, onKeyDown, onPaste, isFilled, isActive }) {
//   return (
//     <div style={{ ...s.otpBox, ...(isActive ? s.otpBoxActive : {}), ...(isFilled ? s.otpBoxFilled : {}) }}>
//       <input
//         ref={inputRef}
//         type="text"
//         inputMode="numeric"
//         maxLength={1}
//         value={value}
//         onChange={onChange}
//         onKeyDown={onKeyDown}
//         onPaste={onPaste}
//         style={s.otpInput}
//       />
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    MAIN OTP COMPONENT
// ───────────────────────────────────────────────────────────── */
// export default function OtpVerify() {
//   const [otp, setOtp]                 = useState(["", "", "", "", "", ""]);
//   const [opened, setOpened]           = useState(false);
//   const [loading, setLoading]         = useState(false);
//   const [resendTimer, setResendTimer] = useState(30);
//   const [canResend, setCanResend]     = useState(false);
//   const [shakeError, setShakeError]   = useState(false);
//   const [phase, setPhase]             = useState("enter");
//   const [smokeActive, setSmokeActive] = useState(false);
//   const [cardLanded, setCardLanded]   = useState(false);

//   const inputRefs = useRef([]);
//   const navigate  = useNavigate();
//   const location  = useLocation();

//   /* Email passed from Register via navigate("/verify-otp", { state: { email } }) */
//   const email = location.state?.email || "your email";


//   /* Sequence: card drops (0.75s) → smoke bursts at impact (0.62s) → envelope opens (1.2s) → focus input */
//   useEffect(() => {
//     const t1 = setTimeout(() => setSmokeActive(true),                620);
//     const t2 = setTimeout(() => setCardLanded(true),                 760);
//     const t3 = setTimeout(() => setSmokeActive(false),              2200);
//     const t4 = setTimeout(() => setOpened(true),                    1200);
//     const t5 = setTimeout(() => inputRefs.current[0]?.focus(),      1450);
//     return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
//   }, []);

//   /* Resend countdown */
//   useEffect(() => {
//     if (resendTimer === 0) { setCanResend(true); return; }
//     const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
//     return () => clearTimeout(t);
//   }, [resendTimer]);

//   const focusedIndex = otp.findIndex((v) => v === "") === -1 ? 5 : otp.findIndex((v) => v === "");

//   function handleChange(index, e) {
//     const val = e.target.value.replace(/\D/g, "").slice(-1);
//     const next = [...otp]; next[index] = val; setOtp(next);
//     if (val && index < 5) inputRefs.current[index + 1]?.focus();
//   }

//   function handleKeyDown(index, e) {
//     if (e.key === "Backspace") {
//       if (otp[index]) { const n=[...otp]; n[index]=""; setOtp(n); }
//       else if (index > 0) { inputRefs.current[index-1]?.focus(); const n=[...otp]; n[index-1]=""; setOtp(n); }
//     } else if (e.key === "ArrowLeft"  && index > 0) inputRefs.current[index-1]?.focus();
//     else if   (e.key === "ArrowRight" && index < 5) inputRefs.current[index+1]?.focus();
//   }

//   function handlePaste(e) {
//     e.preventDefault();
//     const p = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
//     if (!p) return;
//     const n=[...otp]; for(let i=0;i<6;i++) n[i]=p[i]||""; setOtp(n);
//     inputRefs.current[Math.min(p.length,5)]?.focus();
//   }

//   async function handleVerify() {
//     const code = otp.join("");
//     if (code.length < 6) { toast.error("Please enter all 6 digits"); triggerShake(); return; }
//     setLoading(true);
//     try {
//       await new Promise((r) => setTimeout(r, 1200)); // ← replace with: await verifyOtpService({ otp: code })
//       setPhase("success");
//       toast.success("Email verified! 🎉");
//       setTimeout(() => navigate("/chat"), 2000);
//     } catch {
//       toast.error("Invalid OTP. Try again.");
//       triggerShake();
//       setOtp(["","","","","",""]);
//       inputRefs.current[0]?.focus();
//     } finally { setLoading(false); }
//   }

//   function triggerShake() {
//     setShakeError(true); setTimeout(() => setShakeError(false), 600);
//   }

//   function handleResend() {
//     if (!canResend) return;
//     toast.success("OTP resent to your email!");
//     setOtp(["","","","","",""]); setResendTimer(30); setCanResend(false);
//     inputRefs.current[0]?.focus();
//   }

//   const isComplete = otp.every((v) => v !== "");

//   const particles = [
//     { emoji: "✉️", top: "10%",   left: "8%",   delay: "0s",   dur: "5s"   },
//     { emoji: "🔐", top: "20%",   right: "7%",  delay: "1.2s", dur: "4s"   },
//     { emoji: "✨", bottom: "30%",left: "5%",   delay: "0.6s", dur: "6s"   },
//     { emoji: "💌", bottom: "20%",right: "6%",  delay: "1.8s", dur: "4.5s" },
//     { emoji: "🔑", top: "7%",    right: "22%", delay: "2.2s", dur: "5.5s" },
//   ];

//   /* 12 smoke puff configs: [offsetX, offsetY, size, hue-tint] */
//   const smokeCfg = [
//     [-70,  0,  88, 180], [ 70,  0,  88, 185],
//     [-130,-10, 70, 175], [130,-10,  70, 190],
//     [-180,-20, 55, 170], [180,-20,  55, 195],
//     [ -30, -5,100, 182], [ 30, -5, 100, 178],
//     [-100,-15, 65, 188], [100,-15,  65, 183],
//     [ -50, -8, 78, 176], [ 50, -8,  78, 187],
//   ];

//   return (
//     <div style={s.root}>
//       <Toaster position="top-center" />
//       <style>{CSS}</style>

//       {/* ── Scene background ── */}
//       <div style={s.sceneBg} />
//       <div style={s.sceneOverlay} />
//       <div style={s.ground} />
//       <div style={s.groundLine} />

//       {/* ── Floating particles ── */}
//       {particles.map((p, i) => (
//         <div key={i} className="float-particle" style={{
//           ...s.particle, top: p.top, bottom: p.bottom,
//           left: p.left, right: p.right,
//           animationDelay: p.delay, animationDuration: p.dur,
//         }}>{p.emoji}</div>
//       ))}

//       {/* ── Brand ── */}
//       <div style={s.brand}>
//         <span style={s.brandIcon}>💬</span>
//         <span style={s.brandName}>ChatApp</span>
//       </div>

//       {/* ── Shockwave ring at impact ── */}
//       {smokeActive && <div style={s.shockwave} className="shockwave-burst" />}

//       {/* ── Smoke puffs ── */}
//       {smokeCfg.map(([ox, oy, sz, hue], i) => (
//         <div
//           key={i}
//           className={smokeActive ? `smoke-puff smoke-puff-${i}` : ""}
//           style={{
//             position: "absolute",
//             bottom: "calc(26% + 20px)",
//             left: `calc(50% + ${ox}px)`,
//             marginLeft: -sz / 2,
//             width: sz, height: sz,
//             borderRadius: "50%",
//             background: `radial-gradient(circle, hsla(${hue},30%,75%,0.6) 0%, hsla(${hue},20%,60%,0.25) 50%, transparent 72%)`,
//             pointerEvents: "none",
//             opacity: 0,
//             zIndex: 13,
//           }}
//         />
//       ))}

//       {/* ══════════════════════════════
//           DROP WRAPPER — falls from top
//       ══════════════════════════════ */}
//       <div style={s.dropWrapper} className="card-drop">

//         {/* Envelope sits on top of card */}
//         <div style={s.envelopeOnCard} className={cardLanded ? "envelope-idle" : ""}>
//           <EnvelopeCharacter opened={opened} />
//         </div>

//         {/* OTP Card */}
//         <div style={s.card} className={phase === "success" ? "card-success" : ""}>
//           <div style={s.cardGlow} />

//           {phase === "success" ? (
//             <div style={s.successBody}>
//               <div style={s.successIcon} className="success-pop">✅</div>
//               <h2 style={s.successTitle}>Verified!</h2>
//               <p style={s.successSub}>Redirecting you to ChatApp…</p>
//               <div style={s.successDots}>
//                 {[0,1,2].map(i => (
//                   <span key={i} className="dot-pulse"
//                     style={{ ...s.dot, animationDelay: `${i*0.2}s` }} />
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <>
//               <div style={s.cardHeader}>
//                 <span style={s.cardEmoji}>📬</span>
//                 <h1 style={s.cardTitle}>Verify your email</h1>
//                 <p style={s.cardSub}>
//                   We sent a 6-digit code to<br />
//                   <span style={s.emailHighlight}>{email}</span>
//                 </p>
//               </div>

//               <div style={s.cardBody}>

//                 <div style={s.otpRow} className={shakeError ? "shake" : ""}>
//                   {otp.map((val, i) => (
//                     <OtpBox key={i} value={val}
//                       inputRef={(el) => (inputRefs.current[i] = el)}
//                       onChange={(e) => handleChange(i, e)}
//                       onKeyDown={(e) => handleKeyDown(i, e)}
//                       onPaste={handlePaste}
//                       isFilled={!!val}
//                       isActive={focusedIndex === i}
//                     />
//                   ))}
//                 </div>

//                 <div style={s.progressRow}>
//                   {otp.map((v, i) => (
//                     <div key={i} style={{ ...s.progressDot, ...(v ? s.progressDotFilled : {}) }} />
//                   ))}
//                 </div>

//                 <button
//                   onClick={handleVerify}
//                   disabled={loading || !isComplete}
//                   style={{ ...s.verifyBtn, ...(isComplete ? s.verifyBtnActive : {}) }}
//                   className="verify-btn"
//                 >
//                   {loading ? (
//                     <span style={s.spinner} className="spin" />
//                   ) : (
//                     <><span>Verify & Continue</span><span style={s.btnArrow}>→</span></>
//                   )}
//                 </button>

//                 <div style={s.resendRow}>
//                   <span style={s.resendText}>Didn't receive it?&nbsp;</span>
//                   {canResend ? (
//                     <button onClick={handleResend} style={s.resendBtn} className="resend-btn">Resend OTP</button>
//                   ) : (
//                     <span style={s.timerText}>
//                       Resend in&nbsp;
//                       <span style={s.timerNum}>{String(resendTimer).padStart(2,"0")}s</span>
//                     </span>
//                   )}
//                 </div>

//                 <p style={s.backRow}>
//                   Wrong email?{" "}
//                   <button onClick={() => navigate(-1)} style={s.backBtn}>Go back</button>
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       {/* end dropWrapper */}

//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    STYLES
// ───────────────────────────────────────────────────────────── */
// const s = {
//   root: {
//     position: "relative", width: "100vw", height: "100vh",
//     overflow: "hidden",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontFamily: "'DM Sans', sans-serif",
//   },
//   sceneBg: {
//     position: "absolute", inset: 0, zIndex: 0,
//     background: "linear-gradient(170deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
//   },
//   sceneOverlay: {
//     position: "absolute", inset: 0, zIndex: 1,
//     backgroundImage: `
//       radial-gradient(ellipse at 20% 50%, rgba(0,200,120,0.08) 0%, transparent 60%),
//       radial-gradient(ellipse at 80% 50%, rgba(160,0,255,0.08) 0%, transparent 60%)
//     `,
//   },
//   ground: {
//     position: "absolute", bottom: 0, left: 0, right: 0, height: "22%", zIndex: 2,
//     background: "linear-gradient(180deg, rgba(0,180,100,0.18) 0%, rgba(0,120,70,0.35) 100%)",
//     borderTop: "1px solid rgba(0,220,120,0.2)",
//   },
//   groundLine: {
//     position: "absolute", bottom: "22%", left: 0, right: 0, height: 1, zIndex: 3,
//     background: "linear-gradient(90deg, transparent, rgba(0,220,120,0.4), transparent)",
//   },
//   brand: {
//     position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)",
//     zIndex: 20, display: "flex", alignItems: "center", gap: 10,
//   },
//   brandIcon: { fontSize: 28 },
//   brandName: {
//     fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700,
//     color: "#fff", letterSpacing: "0.04em",
//     textShadow: "0 2px 20px rgba(0,0,0,0.5)",
//   },
//   particle: {
//     position: "absolute", zIndex: 3, fontSize: 20,
//     pointerEvents: "none", opacity: 0.55,
//   },
//   /* The whole drop unit */
//   dropWrapper: {
//     position: "relative", zIndex: 15,
//     display: "flex", flexDirection: "column", alignItems: "center",
//     marginBottom: "6%",
//   },
//   envelopeOnCard: {
//     zIndex: 16, marginBottom: -10, position: "relative",
//   },
//   card: {
//     position: "relative",
//     width: "min(400px, 88vw)",
//     background: "rgba(10, 16, 28, 0.88)",
//     backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
//     borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
//     borderRadius: 24,
//     boxShadow: "0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
//     overflow: "hidden",
//   },
//   cardGlow: {
//     position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
//     background: "linear-gradient(90deg, transparent, rgba(0,220,120,0.6), transparent)",
//   },
//   cardHeader: { padding: "28px 28px 0", textAlign: "center" },
//   cardEmoji: { fontSize: 28, display: "block", marginBottom: 6 },
//   cardTitle: {
//     fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600,
//     color: "#fff", margin: "0 0 8px", letterSpacing: "0.02em",
//   },
//   cardSub: { fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.7 },
//   emailHighlight: { color: "#00c978", fontWeight: 600 },
//   cardBody: {
//     padding: "20px 28px 28px",
//     display: "flex", flexDirection: "column", gap: 14, alignItems: "center",
//   },
//   otpRow: { display: "flex", gap: 8, justifyContent: "center", width: "100%" },
//   otpBox: {
//     width: 48, height: 56, borderRadius: 12,
//     background: "rgba(255,255,255,0.06)",
//     borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     transition: "all 0.2s ease", flexShrink: 0,
//   },
//   otpBoxActive: {
//     borderColor: "rgba(0,201,120,0.6)", background: "rgba(0,201,120,0.07)",
//     boxShadow: "0 0 0 3px rgba(0,201,120,0.12)",
//   },
//   otpBoxFilled: { borderColor: "rgba(0,201,120,0.4)", background: "rgba(0,201,120,0.1)" },
//   otpInput: {
//     width: "100%", height: "100%",
//     background: "transparent", border: "none", outline: "none",
//     textAlign: "center", fontSize: 22, fontWeight: 700, color: "#fff",
//     fontFamily: "'DM Sans', sans-serif", cursor: "text",
//   },
//   progressRow: { display: "flex", gap: 6, justifyContent: "center" },
//   progressDot: {
//     width: 6, height: 6, borderRadius: "50%",
//     background: "rgba(255,255,255,0.15)", transition: "all 0.25s ease",
//   },
//   progressDotFilled: {
//     background: "#00c978", boxShadow: "0 0 6px rgba(0,201,120,0.6)", transform: "scale(1.3)",
//   },
//   verifyBtn: {
//     width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//     padding: "13px", borderRadius: 12, border: "none", cursor: "not-allowed",
//     background: "rgba(0,201,120,0.25)", color: "rgba(255,255,255,0.4)",
//     fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
//     letterSpacing: "0.04em", transition: "all 0.3s ease", marginTop: 2,
//   },
//   verifyBtnActive: {
//     background: "linear-gradient(135deg, #00c978, #00a896)",
//     color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,201,120,0.35)",
//   },
//   btnArrow: { fontSize: 16 },
//   spinner: {
//     width: 18, height: 18, display: "inline-block",
//     borderWidth: 2, borderStyle: "solid",
//     borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%",
//   },
//   resendRow: { display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 },
//   resendText: { color: "rgba(255,255,255,0.35)" },
//   resendBtn: {
//     background: "none", border: "none", cursor: "pointer", color: "#00c978",
//     fontSize: 12, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3,
//     fontFamily: "'DM Sans', sans-serif", padding: 0,
//   },
//   timerText: { color: "rgba(255,255,255,0.35)", fontSize: 12, display: "flex", alignItems: "center", gap: 2 },
//   timerNum: { color: "rgba(0,201,120,0.7)", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
//   backRow: { fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, textAlign: "center" },
//   backBtn: {
//     background: "none", border: "none", cursor: "pointer", color: "#00c978",
//     fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", padding: 0,
//     textDecoration: "underline", textUnderlineOffset: 3,
//   },
//   successBody: {
//     padding: "40px 28px", display: "flex", flexDirection: "column",
//     alignItems: "center", gap: 12, textAlign: "center",
//   },
//   successIcon: { fontSize: 52 },
//   successTitle: {
//     fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "#fff", margin: 0,
//   },
//   successSub: { fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 },
//   successDots: { display: "flex", gap: 8, marginTop: 4 },
//   dot: { width: 8, height: 8, borderRadius: "50%", background: "#00c978", display: "inline-block" },
//   shockwave: {
//     position: "absolute",
//     bottom: "calc(26% - 10px)",
//     left: "50%",
//     transform: "translateX(-50%)",
//     width: 30, height: 30, borderRadius: "50%",
//     border: "2px solid rgba(0,201,120,0.8)",
//     zIndex: 14, pointerEvents: "none",
//   },
// };

// /* ─────────────────────────────────────────────────────────────
//    GLOBAL CSS
// ───────────────────────────────────────────────────────────── */
// const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

//   /* ══════════════════════════════════════════
//      CARD + ENVELOPE DROP FROM TOP
//      Falls from -130vh, hits ground, bounces
//   ══════════════════════════════════════════ */
//   .card-drop {
//     animation: cardDrop 0.78s cubic-bezier(0.2, 0, 0.4, 1) both;
//   }

//   @keyframes cardDrop {
//     0%   { transform: translateY(-130vh);                              opacity: 0;   }
//     55%  { transform: translateY(-130vh);                              opacity: 0;   }
//     70%  { transform: translateY(-130vh);                              opacity: 1;   }
//     82%  { transform: translateY(22px)  scaleX(1.05) scaleY(0.91);               }
//     90%  { transform: translateY(-14px) scaleX(0.97) scaleY(1.05);               }
//     95%  { transform: translateY(6px)   scaleX(1.01) scaleY(0.99);               }
//     100% { transform: translateY(0)     scaleX(1)    scaleY(1);        opacity: 1;   }
//   }

//   /* ══════════════════════════════════════════
//      SMOKE PUFFS
//      Each puff bursts outward from impact point
//   ══════════════════════════════════════════ */
//   .smoke-puff {
//     animation: smokeBurst 1.5s ease-out forwards;
//   }

//   /* Staggered delays for organic feel */
//   .smoke-puff-0  { animation-delay: 0s;     --dy: -35px; }
//   .smoke-puff-1  { animation-delay: 0.04s;  --dy: -35px; }
//   .smoke-puff-2  { animation-delay: 0.09s;  --dy: -28px; }
//   .smoke-puff-3  { animation-delay: 0.09s;  --dy: -28px; }
//   .smoke-puff-4  { animation-delay: 0.15s;  --dy: -20px; }
//   .smoke-puff-5  { animation-delay: 0.15s;  --dy: -20px; }
//   .smoke-puff-6  { animation-delay: 0.02s;  --dy: -40px; }
//   .smoke-puff-7  { animation-delay: 0.02s;  --dy: -40px; }
//   .smoke-puff-8  { animation-delay: 0.11s;  --dy: -25px; }
//   .smoke-puff-9  { animation-delay: 0.11s;  --dy: -25px; }
//   .smoke-puff-10 { animation-delay: 0.06s;  --dy: -32px; }
//   .smoke-puff-11 { animation-delay: 0.06s;  --dy: -32px; }

//   @keyframes smokeBurst {
//     0%   { opacity: 0;    transform: scale(0.15) translateY(0);                      }
//     12%  { opacity: 0.7;  transform: scale(0.55) translateY(calc(var(--dy) * 0.3));  }
//     35%  { opacity: 0.5;  transform: scale(1.0)  translateY(calc(var(--dy) * 0.7));  }
//     65%  { opacity: 0.22; transform: scale(1.35) translateY(var(--dy));              }
//     100% { opacity: 0;    transform: scale(1.7)  translateY(calc(var(--dy) * 1.5));  }
//   }

//   /* ══════════════════════════════════════════
//      SHOCKWAVE RING — expands from impact point
//   ══════════════════════════════════════════ */
//   .shockwave-burst {
//     animation: shockwaveRing 0.65s ease-out forwards;
//   }
//   @keyframes shockwaveRing {
//     0%   { transform: translateX(-50%) scale(0.4); opacity: 1;   }
//     100% { transform: translateX(-50%) scale(20);  opacity: 0;   }
//   }

//   /* ══════════════════════════════════════════
//      ENVELOPE IDLE FLOAT (after landing)
//   ══════════════════════════════════════════ */
//   .envelope-idle {
//     animation: envelopeIdle 3.2s ease-in-out infinite;
//   }
//   @keyframes envelopeIdle {
//     0%, 100% { transform: translateY(0); }
//     50%       { transform: translateY(-8px); }
//   }

//   /* ══════════════════════════════════════════
//      LETTER PEEK inside envelope
//   ══════════════════════════════════════════ */
//   @keyframes letterPeek {
//     from { transform: translateY(20px); opacity: 0; }
//     to   { transform: translateY(0);    opacity: 1; }
//   }

//   /* ══════════════════════════════════════════
//      FLOATING BACKGROUND PARTICLES
//   ══════════════════════════════════════════ */
//   .float-particle {
//     position: absolute;
//     animation: particleFloat 5s ease-in-out infinite;
//   }
//   @keyframes particleFloat {
//     0%, 100% { transform: translateY(0)    rotate(0deg);  }
//     33%       { transform: translateY(-14px) rotate(8deg); }
//     66%       { transform: translateY(-6px)  rotate(-6deg);}
//   }

//   /* ══════════════════════════════════════════
//      SUCCESS
//   ══════════════════════════════════════════ */
//   .card-success {
//     border-color: rgba(0,201,120,0.35) !important;
//     box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,201,120,0.15) !important;
//   }
//   .success-pop {
//     animation: successPop 0.5s cubic-bezier(.34,1.56,.64,1) 0.1s both;
//   }
//   @keyframes successPop {
//     from { transform: scale(0); opacity: 0; }
//     to   { transform: scale(1); opacity: 1; }
//   }
//   .dot-pulse { animation: dotPulse 1.2s ease-in-out infinite; }
//   @keyframes dotPulse {
//     0%, 100% { transform: scale(1);   opacity: 0.4; }
//     50%       { transform: scale(1.4); opacity: 1;   }
//   }

//   /* ══════════════════════════════════════════
//      MISC
//   ══════════════════════════════════════════ */
//   .shake { animation: shake 0.55s cubic-bezier(.36,.07,.19,.97) both; }
//   @keyframes shake {
//     10%, 90% { transform: translateX(-2px); }
//     20%, 80% { transform: translateX(4px);  }
//     30%, 50%, 70% { transform: translateX(-6px); }
//     40%, 60% { transform: translateX(6px);  }
//   }

//   .verify-btn:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 28px rgba(0,201,120,.55) !important;
//   }
//   .verify-btn:active:not(:disabled) { transform: scale(.98); }
//   .resend-btn:hover { opacity: 0.8; }
//   .spin { animation: spin .75s linear infinite; }
//   @keyframes spin { to { transform: rotate(360deg); } }

//   input::placeholder { color: rgba(255,255,255,0.25) !important; }
//   input[type="text"]::-webkit-outer-spin-button,
//   input[type="text"]::-webkit-inner-spin-button { -webkit-appearance: none; }
// `;
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

/* ─────────────────────────────────────────────────────────────
   ENVELOPE CHARACTER
───────────────────────────────────────────────────────────── */
function EnvelopeCharacter({ opened }) {
  return (
    <svg viewBox="0 0 160 160" style={{ width: 120, height: 120, display: "block" }} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="148" rx="38" ry="7" fill="rgba(0,0,0,0.22)" />
      <rect x="18" y="55" width="124" height="84" rx="10" fill="#1a2a3a" stroke="rgba(0,201,120,0.5)" strokeWidth="1.5" />
      <g style={{ transformOrigin: "80px 55px", transform: opened ? "rotateX(180deg)" : "rotateX(0deg)", transition: "transform 0.6s cubic-bezier(.4,2,.6,1)" }}>
        <path d="M18 55 L80 100 L142 55 Z" fill="#203a43" stroke="rgba(0,201,120,0.35)" strokeWidth="1" />
      </g>
      {!opened && (
        <>
          <line x1="18" y1="55" x2="80" y2="100" stroke="rgba(0,201,120,0.4)" strokeWidth="1.2" />
          <line x1="142" y1="55" x2="80" y2="100" stroke="rgba(0,201,120,0.4)" strokeWidth="1.2" />
        </>
      )}
      {opened && (
        <g style={{ animation: "letterPeek 0.5s ease 0.4s both" }}>
          <rect x="52" y="28" width="56" height="48" rx="4" fill="#fff" opacity="0.95" />
          <line x1="61" y1="40" x2="99" y2="40" stroke="#00c978" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="61" y1="50" x2="99" y2="50" stroke="rgba(0,0,0,0.15)" strokeWidth="2" strokeLinecap="round" />
          <line x1="61" y1="59" x2="85" y2="59" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />
          <text x="88" y="62" fontSize="10">✨</text>
        </g>
      )}
      <ellipse cx="63" cy="112" rx="5" ry="5.5" fill="#fff" />
      <ellipse cx="97" cy="112" rx="5" ry="5.5" fill="#fff" />
      <circle cx="64" cy="113" r="3" fill="#1a1a1a" />
      <circle cx="98" cy="113" r="3" fill="#1a1a1a" />
      <circle cx="65" cy="112" r="1" fill="#fff" />
      <circle cx="99" cy="112" r="1" fill="#fff" />
      <path d="M59 108 Q63 105 67 108" stroke="#3d5a6e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M93 108 Q97 105 101 108" stroke="#3d5a6e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path
        d={opened ? "M71 124 Q80 132 89 124" : "M71 122 Q80 118 89 122"}
        stroke="#00c978" strokeWidth="2" fill="none" strokeLinecap="round"
        style={{ transition: "d 0.4s ease" }}
      />
      {opened && (
        <>
          <ellipse cx="54" cy="120" rx="7" ry="5" fill="rgba(255,100,100,0.25)" />
          <ellipse cx="106" cy="120" rx="7" ry="5" fill="rgba(255,100,100,0.25)" />
        </>
      )}
      <rect x="102" y="18" width="50" height="26" rx="8" fill="#fff" opacity="0.95" />
      <polygon points="110,44 116,44 110,52" fill="#fff" opacity="0.95" />
      <text x="127" y="28" textAnchor="middle" fontSize="8" fill="#00c978" fontWeight="bold" fontFamily="sans-serif">
        {opened ? "Got it! 🎉" : "Check 📧"}
      </text>
      <text x="127" y="39" textAnchor="middle" fontSize="7" fill="#555" fontFamily="sans-serif">
        {opened ? "Enter OTP" : "Email sent!"}
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   SINGLE OTP BOX
───────────────────────────────────────────────────────────── */
function OtpBox({ value, inputRef, onChange, onKeyDown, onPaste, isFilled, isActive }) {
  return (
    <div style={{ ...s.otpBox, ...(isActive ? s.otpBoxActive : {}), ...(isFilled ? s.otpBoxFilled : {}) }}>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        style={s.otpInput}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN OTP COMPONENT
───────────────────────────────────────────────────────────── */
export default function OtpVerify() {
  const [otp, setOtp]                 = useState(["", "", "", "", "", ""]);
  const [opened, setOpened]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend]     = useState(false);
  const [shakeError, setShakeError]   = useState(false);
  const [phase, setPhase]             = useState("enter");

  const inputRefs = useRef([]);
  const navigate  = useNavigate();
  const location  = useLocation();

  /* Email passed from Register via navigate("/verify-otp", { state: { email } }) */
  const email = location.state?.email || "your email";

  useEffect(() => {
    const t1 = setTimeout(() => setOpened(true),               600);
    const t2 = setTimeout(() => inputRefs.current[0]?.focus(), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* Resend countdown */
  useEffect(() => {
    if (resendTimer === 0) { setCanResend(true); return; }
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const focusedIndex = otp.findIndex((v) => v === "") === -1 ? 5 : otp.findIndex((v) => v === "");

  function handleChange(index, e) {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp]; next[index] = val; setOtp(next);
    if (val && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace") {
      if (otp[index]) { const n = [...otp]; n[index] = ""; setOtp(n); }
      else if (index > 0) { inputRefs.current[index - 1]?.focus(); const n = [...otp]; n[index - 1] = ""; setOtp(n); }
    } else if (e.key === "ArrowLeft"  && index > 0) inputRefs.current[index - 1]?.focus();
    else if   (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!p) return;
    const n = [...otp]; for (let i = 0; i < 6; i++) n[i] = p[i] || ""; setOtp(n);
    inputRefs.current[Math.min(p.length, 5)]?.focus();
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) { toast.error("Please enter all 6 digits"); triggerShake(); return; }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200)); // ← replace with: await verifyOtpService({ otp: code })
      setPhase("success");
      toast.success("Email verified! 🎉");
      setTimeout(() => navigate("/chat"), 2000);
    } catch {
      toast.error("Invalid OTP. Try again.");
      triggerShake();
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally { setLoading(false); }
  }

  function triggerShake() {
    setShakeError(true); setTimeout(() => setShakeError(false), 600);
  }

  function handleResend() {
    if (!canResend) return;
    toast.success("OTP resent to your email!");
    setOtp(["", "", "", "", "", ""]); setResendTimer(30); setCanResend(false);
    inputRefs.current[0]?.focus();
  }

  const isComplete = otp.every((v) => v !== "");

  const particles = [
    { emoji: "✉️", top: "10%",   left: "8%",   delay: "0s",   dur: "5s"   },
    { emoji: "🔐", top: "20%",   right: "7%",  delay: "1.2s", dur: "4s"   },
    { emoji: "✨", bottom: "30%",left: "5%",   delay: "0.6s", dur: "6s"   },
    { emoji: "💌", bottom: "20%",right: "6%",  delay: "1.8s", dur: "4.5s" },
    { emoji: "🔑", top: "7%",    right: "22%", delay: "2.2s", dur: "5.5s" },
  ];

  return (
    <div style={s.root}>
      <Toaster position="top-center" />
      <style>{CSS}</style>

      {/* ── Background (identical to Register) ── */}
      <div style={s.sceneBg} />
      <div style={s.sceneOverlay} />
      <div style={s.ground} />
      <div style={s.groundLine} />

      {/* ── Floating particles ── */}
      {particles.map((p, i) => (
        <div key={i} className="float-particle" style={{
          ...s.particle,
          top: p.top, bottom: p.bottom, left: p.left, right: p.right,
          animationDelay: p.delay, animationDuration: p.dur,
        }}>{p.emoji}</div>
      ))}

      {/* ── Brand ── */}
      <div style={s.brand}>
        <span style={s.brandIcon}>💬</span>
        <span style={s.brandName}>ChatApp</span>
      </div>

      {/* ── Envelope floats above card ── */}
      <div style={s.envelopeWrap} className="envelope-float">
        <EnvelopeCharacter opened={opened} />
      </div>

      {/* ── OTP Card ── */}
      <div style={s.card} className={phase === "success" ? "card-success" : "card-in"}>
        <div style={s.cardGlow} />

        {phase === "success" ? (
          <div style={s.successBody}>
            <div style={s.successIcon} className="success-pop">✅</div>
            <h2 style={s.successTitle}>Verified!</h2>
            <p style={s.successSub}>Redirecting you to ChatApp…</p>
            <div style={s.successDots}>
              {[0, 1, 2].map(i => (
                <span key={i} className="dot-pulse" style={{ ...s.dot, animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={s.cardHeader}>
              <span style={s.cardEmoji}>📬</span>
              <h1 style={s.cardTitle}>Verify your email</h1>
              <p style={s.cardSub}>
                We sent a 6-digit code to<br />
                <span style={s.emailHighlight}>{email}</span>
              </p>
            </div>

            <div style={s.cardBody}>

              {/* OTP boxes */}
              <div style={s.otpRow} className={shakeError ? "shake" : ""}>
                {otp.map((val, i) => (
                  <OtpBox
                    key={i} value={val}
                    inputRef={(el) => (inputRefs.current[i] = el)}
                    onChange={(e) => handleChange(i, e)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    isFilled={!!val}
                    isActive={focusedIndex === i}
                  />
                ))}
              </div>

              {/* Progress dots */}
              <div style={s.progressRow}>
                {otp.map((v, i) => (
                  <div key={i} style={{ ...s.progressDot, ...(v ? s.progressDotFilled : {}) }} />
                ))}
              </div>

              {/* Verify button */}
              <button
                onClick={handleVerify}
                disabled={loading || !isComplete}
                style={{ ...s.verifyBtn, ...(isComplete ? s.verifyBtnActive : {}) }}
                className="verify-btn"
              >
                {loading ? (
                  <span style={s.spinner} className="spin" />
                ) : (
                  <><span>Verify & Continue</span><span style={s.btnArrow}>→</span></>
                )}
              </button>

              {/* Resend */}
              <div style={s.resendRow}>
                <span style={s.resendText}>Didn't receive it?&nbsp;</span>
                {canResend ? (
                  <button onClick={handleResend} style={s.resendBtn} className="resend-btn">Resend OTP</button>
                ) : (
                  <span style={s.timerText}>
                    Resend in&nbsp;
                    <span style={s.timerNum}>{String(resendTimer).padStart(2, "0")}s</span>
                  </span>
                )}
              </div>

              {/* Back */}
              <p style={s.backRow}>
                Wrong email?{" "}
                <button onClick={() => navigate(-1)} style={s.backBtn}>Go back</button>
              </p>

            </div>
          </>
        )}
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const s = {
  root: {
    position: "relative", width: "100vw", height: "100vh",
    overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
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
  brand: {
    position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)",
    zIndex: 20, display: "flex", alignItems: "center", gap: 10,
  },
  brandIcon: { fontSize: 28 },
  brandName: {
    fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700,
    color: "#fff", letterSpacing: "0.04em",
    textShadow: "0 2px 20px rgba(0,0,0,0.5)",
  },
  particle: {
    position: "absolute", zIndex: 3, fontSize: 20,
    pointerEvents: "none", opacity: 0.55,
  },
  envelopeWrap: {
    position: "absolute",
    bottom: "calc(50% + 110px)",   /* sits just above the card */
    left: "50%", transform: "translateX(-50%)",
    zIndex: 16,
  },
  card: {
    position: "relative", zIndex: 15,
    width: "min(400px, 88vw)",
    background: "rgba(10, 16, 28, 0.85)",
    backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 24,
    boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
    background: "linear-gradient(90deg, transparent, rgba(0,220,120,0.6), transparent)",
  },
  cardHeader: { padding: "28px 28px 0", textAlign: "center" },
  cardEmoji: { fontSize: 28, display: "block", marginBottom: 6 },
  cardTitle: {
    fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600,
    color: "#fff", margin: "0 0 8px", letterSpacing: "0.02em",
  },
  cardSub: { fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.7 },
  emailHighlight: { color: "#00c978", fontWeight: 600 },
  cardBody: {
    padding: "20px 28px 28px",
    display: "flex", flexDirection: "column", gap: 14, alignItems: "center",
  },
  otpRow: { display: "flex", gap: 8, justifyContent: "center", width: "100%" },
  otpBox: {
    width: 48, height: 56, borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s ease", flexShrink: 0,
  },
  otpBoxActive: {
    borderColor: "rgba(0,201,120,0.6)", background: "rgba(0,201,120,0.07)",
    boxShadow: "0 0 0 3px rgba(0,201,120,0.12)",
  },
  otpBoxFilled: { borderColor: "rgba(0,201,120,0.4)", background: "rgba(0,201,120,0.1)" },
  otpInput: {
    width: "100%", height: "100%",
    background: "transparent", border: "none", outline: "none",
    textAlign: "center", fontSize: 22, fontWeight: 700, color: "#fff",
    fontFamily: "'DM Sans', sans-serif", cursor: "text",
  },
  progressRow: { display: "flex", gap: 6, justifyContent: "center" },
  progressDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "rgba(255,255,255,0.15)", transition: "all 0.25s ease",
  },
  progressDotFilled: {
    background: "#00c978", boxShadow: "0 0 6px rgba(0,201,120,0.6)", transform: "scale(1.3)",
  },
  verifyBtn: {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "13px", borderRadius: 12, border: "none", cursor: "not-allowed",
    background: "rgba(0,201,120,0.25)", color: "rgba(255,255,255,0.4)",
    fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.04em", transition: "all 0.3s ease", marginTop: 2,
  },
  verifyBtnActive: {
    background: "linear-gradient(135deg, #00c978, #00a896)",
    color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,201,120,0.35)",
  },
  btnArrow: { fontSize: 16 },
  spinner: {
    width: 18, height: 18, display: "inline-block",
    borderWidth: 2, borderStyle: "solid",
    borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%",
  },
  resendRow: { display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 },
  resendText: { color: "rgba(255,255,255,0.35)" },
  resendBtn: {
    background: "none", border: "none", cursor: "pointer", color: "#00c978",
    fontSize: 12, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3,
    fontFamily: "'DM Sans', sans-serif", padding: 0,
  },
  timerText: { color: "rgba(255,255,255,0.35)", fontSize: 12, display: "flex", alignItems: "center", gap: 2 },
  timerNum: { color: "rgba(0,201,120,0.7)", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  backRow: { fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, textAlign: "center" },
  backBtn: {
    background: "none", border: "none", cursor: "pointer", color: "#00c978",
    fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", padding: 0,
    textDecoration: "underline", textUnderlineOffset: 3,
  },
  successBody: {
    padding: "40px 28px", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 12, textAlign: "center",
  },
  successIcon: { fontSize: 52 },
  successTitle: {
    fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, color: "#fff", margin: 0,
  },
  successSub: { fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 },
  successDots: { display: "flex", gap: 8, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "#00c978", display: "inline-block" },
};

/* ─────────────────────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

  /* Card fades + scales in gently */
  .card-in {
    animation: cardIn 0.5s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px) scale(.95); }
    to   { opacity: 1; transform: translateY(0)    scale(1);   }
  }

  /* Envelope floats up and down */
  .envelope-float {
    animation: envelopeFloat 3s ease-in-out infinite;
  }
  @keyframes envelopeFloat {
    0%, 100% { transform: translateX(-50%) translateY(0);    }
    50%       { transform: translateX(-50%) translateY(-8px); }
  }

  /* Letter peek inside envelope */
  @keyframes letterPeek {
    from { transform: translateY(20px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  /* Floating background particles */
  .float-particle {
    position: absolute;
    animation: particleFloat 5s ease-in-out infinite;
  }
  @keyframes particleFloat {
    0%, 100% { transform: translateY(0)     rotate(0deg);  }
    33%       { transform: translateY(-14px) rotate(8deg);  }
    66%       { transform: translateY(-6px)  rotate(-6deg); }
  }

  /* Success state */
  .card-success {
    border-color: rgba(0,201,120,0.35) !important;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,201,120,0.15) !important;
  }
  .success-pop {
    animation: successPop 0.5s cubic-bezier(.34,1.56,.64,1) 0.1s both;
  }
  @keyframes successPop {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  .dot-pulse { animation: dotPulse 1.2s ease-in-out infinite; }
  @keyframes dotPulse {
    0%, 100% { transform: scale(1);   opacity: 0.4; }
    50%       { transform: scale(1.4); opacity: 1;   }
  }

  /* Shake on wrong OTP */
  .shake { animation: shake 0.55s cubic-bezier(.36,.07,.19,.97) both; }
  @keyframes shake {
    10%, 90% { transform: translateX(-2px); }
    20%, 80% { transform: translateX(4px);  }
    30%, 50%, 70% { transform: translateX(-6px); }
    40%, 60% { transform: translateX(6px);  }
  }

  .verify-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0,201,120,.55) !important;
  }
  .verify-btn:active:not(:disabled) { transform: scale(.98); }
  .resend-btn:hover { opacity: 0.8; }
  .spin { animation: spin .75s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  input::placeholder { color: rgba(255,255,255,0.25) !important; }
  input[type="text"]::-webkit-outer-spin-button,
  input[type="text"]::-webkit-inner-spin-button { -webkit-appearance: none; }
`;
