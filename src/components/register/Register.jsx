// import { useState, useEffect, useCallback } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import Cropper from "react-easy-crop";
// import { addUser } from "../../chatSlice";
// import { registerService } from "../../services/service";
// import toast, { Toaster } from "react-hot-toast";

// /* ─────────────────────────────────────────────────────────────
//    UTILITY — crop a canvas region and return BOTH a blob URL
//    (for preview) AND a File object (for upload)
// ───────────────────────────────────────────────────────────── */
// async function getCroppedImg(imageSrc, pixelCrop) {
//   const image = await new Promise((resolve, reject) => {
//     const img = new Image();
//     img.addEventListener("load", () => resolve(img));
//     img.addEventListener("error", reject);
//     img.src = imageSrc;
//   });

//   const canvas = document.createElement("canvas");
//   canvas.width  = pixelCrop.width;
//   canvas.height = pixelCrop.height;
//   const ctx = canvas.getContext("2d");

//   ctx.drawImage(
//     image,
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height,
//     0,
//     0,
//     pixelCrop.width,
//     pixelCrop.height,
//   );

//   return new Promise((resolve) => {
//     canvas.toBlob((blob) => {
//       const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
//       resolve({
//         previewUrl: URL.createObjectURL(blob), // for <img> preview
//         file,                                  // real File object for FormData
//       });
//     }, "image/jpeg", 0.9);
//   });
// }

// /* ─────────────────────────────────────────────────────────────
//    SVG ICONS
// ───────────────────────────────────────────────────────────── */
// const UserIcon = () => (
//   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round"
//       d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
//   </svg>
// );
// const MailIcon = () => (
//   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round"
//       d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
//   </svg>
// );
// const LockIcon = () => (
//   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round"
//       d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
//   </svg>
// );
// const EyeOn = () => (
//   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round"
//       d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );
// const EyeOff = () => (
//   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round"
//       d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
//   </svg>
// );

// /* ─────────────────────────────────────────────────────────────
//    BOY CHARACTER
// ───────────────────────────────────────────────────────────── */
// function BoyCharacter({ style }) {
//   return (
//     <svg viewBox="0 0 120 220" style={style} xmlns="http://www.w3.org/2000/svg">
//       <ellipse cx="60" cy="215" rx="30" ry="5" fill="rgba(0,0,0,0.18)" />
//       <ellipse cx="48" cy="207" rx="11" ry="5" fill="#2d2d2d" />
//       <ellipse cx="72" cy="207" rx="11" ry="5" fill="#2d2d2d" />
//       <rect x="43" y="160" width="14" height="50" rx="7" fill="#1a6b3c" />
//       <rect x="63" y="160" width="14" height="50" rx="7" fill="#1a6b3c" />
//       <rect x="32" y="100" width="56" height="68" rx="14" fill="#25a244" />
//       <polygon points="52,100 60,115 68,100" fill="#fff" opacity="0.9" />
//       <rect x="14" y="105" width="20" height="48" rx="10" fill="#25a244" />
//       <ellipse cx="24" cy="155" rx="10" ry="10" fill="#f4a261" />
//       <rect x="86" y="88" width="20" height="48" rx="10" fill="#25a244" transform="rotate(-30 96 88)" />
//       <ellipse cx="104" cy="128" rx="10" ry="10" fill="#f4a261" transform="rotate(-30 96 88) translate(3,0)" />
//       <rect x="52" y="88" width="16" height="16" rx="5" fill="#f4a261" />
//       <ellipse cx="60" cy="70" rx="26" ry="28" fill="#f4a261" />
//       <ellipse cx="60" cy="44" rx="26" ry="14" fill="#3d1f00" />
//       <rect x="34" y="44" width="52" height="10" rx="5" fill="#3d1f00" />
//       <ellipse cx="51" cy="68" rx="4" ry="4.5" fill="#fff" />
//       <ellipse cx="69" cy="68" rx="4" ry="4.5" fill="#fff" />
//       <circle cx="52" cy="69" r="2.5" fill="#1a1a1a" />
//       <circle cx="70" cy="69" r="2.5" fill="#1a1a1a" />
//       <circle cx="53" cy="68" r="1" fill="#fff" />
//       <circle cx="71" cy="68" r="1" fill="#fff" />
//       <path d="M46 62 Q51 59 56 62" stroke="#3d1f00" strokeWidth="2" fill="none" strokeLinecap="round" />
//       <path d="M64 62 Q69 59 74 62" stroke="#3d1f00" strokeWidth="2" fill="none" strokeLinecap="round" />
//       <path d="M52 79 Q60 86 68 79" stroke="#c0603a" strokeWidth="2" fill="none" strokeLinecap="round" />
//       <rect x="75" y="20" width="44" height="28" rx="8" fill="#fff" opacity="0.95" />
//       <polygon points="85,48 90,48 85,56" fill="#fff" opacity="0.95" />
//       <text x="97" y="30" textAnchor="middle" fontSize="8" fill="#25a244" fontWeight="bold" fontFamily="sans-serif">Hi! 👋</text>
//       <text x="97" y="42" textAnchor="middle" fontSize="7" fill="#555" fontFamily="sans-serif">Join us!</text>
//     </svg>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    GIRL CHARACTER
// ───────────────────────────────────────────────────────────── */
// function GirlCharacter({ style }) {
//   return (
//     <svg viewBox="0 0 120 220" style={style} xmlns="http://www.w3.org/2000/svg">
//       <ellipse cx="60" cy="215" rx="30" ry="5" fill="rgba(0,0,0,0.18)" />
//       <ellipse cx="47" cy="208" rx="9" ry="4" fill="#b5179e" />
//       <ellipse cx="73" cy="208" rx="9" ry="4" fill="#b5179e" />
//       <rect x="42" y="168" width="13" height="42" rx="6" fill="#f9c6ea" />
//       <rect x="65" y="168" width="13" height="42" rx="6" fill="#f9c6ea" />
//       <ellipse cx="60" cy="168" rx="32" ry="10" fill="#e040fb" />
//       <rect x="30" y="100" width="60" height="72" rx="14" fill="#e040fb" />
//       <ellipse cx="60" cy="136" rx="28" ry="6" fill="#ce39e0" opacity="0.5" />
//       <rect x="10" y="88" width="22" height="48" rx="11" fill="#e040fb" transform="rotate(30 21 88)" />
//       <ellipse cx="13" cy="130" rx="10" ry="10" fill="#f9c6ea" transform="rotate(30 21 88) translate(-3,0)" />
//       <rect x="88" y="105" width="22" height="44" rx="11" fill="#e040fb" />
//       <ellipse cx="99" cy="151" rx="10" ry="10" fill="#f9c6ea" />
//       <rect x="52" y="88" width="16" height="16" rx="5" fill="#f9c6ea" />
//       <ellipse cx="60" cy="68" rx="27" ry="29" fill="#f9c6ea" />
//       <ellipse cx="60" cy="42" rx="27" ry="15" fill="#6b2d0e" />
//       <rect x="33" y="42" width="10" height="52" rx="5" fill="#6b2d0e" />
//       <rect x="77" y="42" width="10" height="52" rx="5" fill="#6b2d0e" />
//       <rect x="33" y="42" width="54" height="14" rx="7" fill="#6b2d0e" />
//       <ellipse cx="60" cy="42" rx="17" ry="5" fill="#f06292" />
//       <ellipse cx="50" cy="67" rx="4.5" ry="5" fill="#fff" />
//       <ellipse cx="70" cy="67" rx="4.5" ry="5" fill="#fff" />
//       <circle cx="51" cy="68" r="2.8" fill="#1a1a1a" />
//       <circle cx="71" cy="68" r="2.8" fill="#1a1a1a" />
//       <circle cx="52" cy="67" r="1" fill="#fff" />
//       <circle cx="72" cy="67" r="1" fill="#fff" />
//       <path d="M46 62 Q50 58 55 61" stroke="#3d1f00" strokeWidth="1.5" fill="none" />
//       <path d="M65 61 Q70 58 74 62" stroke="#3d1f00" strokeWidth="1.5" fill="none" />
//       <ellipse cx="42" cy="74" rx="6" ry="4" fill="#ffb3c6" opacity="0.6" />
//       <ellipse cx="78" cy="74" rx="6" ry="4" fill="#ffb3c6" opacity="0.6" />
//       <path d="M52 80 Q60 88 68 80" stroke="#d63384" strokeWidth="2" fill="none" strokeLinecap="round" />
//       <rect x="1" y="18" width="48" height="28" rx="8" fill="#fff" opacity="0.95" />
//       <polygon points="38,46 33,46 38,54" fill="#fff" opacity="0.95" />
//       <text x="25" y="28" textAnchor="middle" fontSize="8" fill="#e040fb" fontWeight="bold" fontFamily="sans-serif">Hello! 💜</text>
//       <text x="25" y="40" textAnchor="middle" fontSize="7" fill="#555" fontFamily="sans-serif">Let's chat!</text>
//     </svg>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    IMAGE CROPPER MODAL
// ───────────────────────────────────────────────────────────── */
// function CropModal({ imageSrc, onDone, onCancel }) {
//   const [crop, setCrop]               = useState({ x: 0, y: 0 });
//   const [zoom, setZoom]               = useState(1);
//   const [croppedArea, setCroppedArea] = useState(null);

//   const onCropComplete = useCallback((_, croppedAreaPixels) => {
//     setCroppedArea(croppedAreaPixels);
//   }, []);

//   async function handleApply() {
//     try {
//       // getCroppedImg now returns { previewUrl, file }
//       const result = await getCroppedImg(imageSrc, croppedArea);
//       onDone(result);
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   return (
//     <div style={ms.backdrop}>
//       <div style={ms.modal}>
//         <div style={ms.header}>
//           <span style={ms.headerIcon}>✂️</span>
//           <span style={ms.headerTitle}>Crop your photo</span>
//         </div>
//         <div style={ms.cropArea}>
//           <Cropper
//             image={imageSrc}
//             crop={crop}
//             zoom={zoom}
//             aspect={1}
//             cropShape="round"
//             showGrid={false}
//             onCropChange={setCrop}
//             onZoomChange={setZoom}
//             onCropComplete={onCropComplete}
//           />
//         </div>
//         <div style={ms.sliderRow}>
//           <span style={ms.sliderLabel}>🔍</span>
//           <input
//             type="range"
//             min={1}
//             max={3}
//             step={0.05}
//             value={zoom}
//             onChange={(e) => setZoom(Number(e.target.value))}
//             style={ms.slider}
//           />
//           <span style={ms.sliderLabel}>🔎</span>
//         </div>
//         <div style={ms.actions}>
//           <button onClick={onCancel} style={ms.cancelBtn}>Cancel</button>
//           <button onClick={handleApply} style={ms.applyBtn}>Apply Crop ✓</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    REUSABLE INPUT FIELD
// ───────────────────────────────────────────────────────────── */
// function Field({ icon, placeholder, type, value, onChange, suffix }) {
//   const [focused, setFocused] = useState(false);
//   return (
//     <div style={{ ...s.fieldWrap, ...(focused ? s.fieldFocused : {}) }}>
//       <span style={{ ...s.fieldIcon, ...(focused ? s.fieldIconFocused : {}) }}>
//         {icon}
//       </span>
//       <input
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         onFocus={() => setFocused(true)}
//         onBlur={() => setFocused(false)}
//         style={s.fieldInput}
//       />
//       {suffix}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    MAIN REGISTER COMPONENT
// ───────────────────────────────────────────────────────────── */
// export default function Register() {
//   const [phase, setPhase]       = useState("walk"); // "walk" | "form"
//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//   const [showPw, setShowPw]     = useState(false);
//   const [loading, setLoading]   = useState(false);

//   /* ── image state ── */
//   const [rawImage, setRawImage]     = useState(null);  // DataURL for cropper
//   const [previewUrl, setPreviewUrl] = useState(null);  // blob URL for <img> preview
//   const [imageFile, setImageFile]   = useState(null);  // File object for FormData
//   const [cropOpen, setCropOpen]     = useState(false);

//   const dispatch = useDispatch();

//   /* Walk-in → show form */
//   useEffect(() => {
//     const t = setTimeout(() => setPhase("form"), 1900);
//     return () => clearTimeout(t);
//   }, []);

//   const set = (k) => (e) => setFormData((f) => ({ ...f, [k]: e.target.value }));

//   /* When user picks a file → open cropper */
//   function handleFileChange(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       setRawImage(reader.result);
//       setCropOpen(true);
//     };
//     reader.readAsDataURL(file);
//     e.target.value = "";
//   }

//   /* Cropper confirmed → store preview URL + File object separately */
//   function handleCropDone({ previewUrl, file }) {
//     setPreviewUrl(previewUrl);  // used only for the <img> avatar preview
//     setImageFile(file);         // real File object — never stringified
//     setCropOpen(false);
//     setRawImage(null);
//   }

//   /* Cropper cancelled */
//   function handleCropCancel() {
//     setCropOpen(false);
//     setRawImage(null);
//   }

//   /* ── Submit ── */
//   async function handleSubmit(e) {
//     e.preventDefault();
//     const { name, email, password } = formData;
//     if (!name || !email || !password) {
//       toast.error("All fields are required");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Build FormData so the image travels as a real File, not a string
//       const data = new FormData();
//       data.append("name", name);
//       data.append("email", email);
//       data.append("password", password);
//       if (imageFile) {
//         data.append("profileImage", imageFile); // File object — backend receives it as multipart
//       }

//       const response = await registerService(formData); // pass FormData to your service
//       dispatch(addUser(response ?? { name, email, image: previewUrl }));
//       toast.success("Welcome to ChatApp! 🎉");
//       setFormData({ name: "", email: "", password: "" });
//       setPreviewUrl(null);
//       setImageFile(null);
//     } catch (err) {
//       console.error(err);
//       toast.error("Registration failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ── Floating background bubbles ── */
//   const bubbles = [
//     { text: "Hey! 👋",         top: "12%",    left: "5%",   delay: "0s"   },
//     { text: "How are you? 😊", top: "25%",    right: "4%",  delay: "0.8s" },
//     { text: "Good morning ☀️", bottom: "30%", left: "3%",   delay: "1.4s" },
//     { text: "Let's chat! 💬",  bottom: "20%", right: "5%",  delay: "0.4s" },
//     { text: "Join us 🎉",      top: "8%",     right: "20%", delay: "1.8s" },
//   ];

//   return (
//     <div style={s.root}>
//       <Toaster position="top-center" />
//       <style>{CSS}</style>

//       {/* Background */}
//       <div style={s.sceneBg} />
//       <div style={s.sceneOverlay} />
//       <div style={s.ground} />
//       <div style={s.groundLine} />

//       {/* Floating bubbles */}
//       {bubbles.map((b, i) => (
//         <div
//           key={i}
//           className="float-bubble"
//           style={{
//             ...s.floatBubble,
//             top: b.top, bottom: b.bottom,
//             left: b.left, right: b.right,
//             animationDelay: b.delay,
//           }}
//         >
//           {b.text}
//         </div>
//       ))}

//       {/* Brand */}
//       <div style={s.brand} className={phase === "form" ? "brand-show" : ""}>
//         <div style={s.brandIcon}>💬</div>
//         <span style={s.brandName}>ChatApp</span>
//       </div>

//       {/* Characters */}
//       <div
//         className="char-transition"
//         style={{ ...s.boyWrap, ...(phase === "form" ? s.boyForm : s.boyWalk) }}
//       >
//         <BoyCharacter style={s.charSvg} />
//       </div>
//       <div
//         className="char-transition"
//         style={{ ...s.girlWrap, ...(phase === "form" ? s.girlForm : s.girlWalk) }}
//       >
//         <GirlCharacter style={s.charSvg} />
//       </div>

//       {/* ── Registration card ── */}
//       <div
//         style={s.formCard}
//         className={phase === "form" ? "card-show" : "card-hidden"}
//       >
//         <div style={s.cardGlow} />

//         <div style={s.cardHeader}>
//           <span style={s.cardEmoji}>✨</span>
//           <h1 style={s.cardTitle}>Create Account</h1>
//           <p style={s.cardSub}>Join the conversation</p>
//         </div>

//         <form onSubmit={handleSubmit} style={s.form}>

//           {/* ── Avatar upload + crop trigger ── */}
//           <label style={s.avatarLabel} className="avatar-hover">
//             <div style={s.avatarRing}>
//               <img
//                 src={previewUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
//                 alt="avatar"
//                 style={{
//                   ...s.avatarImg,
//                   filter: previewUrl ? "none" : "grayscale(1) opacity(.5)",
//                 }}
//               />
//               <div style={s.avatarBadge}>📷</div>
//             </div>
//             <span style={s.avatarText}>
//               {previewUrl ? "Change Photo" : "Upload & Crop"}
//             </span>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               style={{ display: "none" }}
//             />
//           </label>

//           {/* Name */}
//           <Field
//             icon={<UserIcon />}
//             placeholder="Full Name"
//             type="text"
//             value={formData.name}
//             onChange={set("name")}
//           />

//           {/* Email */}
//           <Field
//             icon={<MailIcon />}
//             placeholder="Email Address"
//             type="email"
//             value={formData.email}
//             onChange={set("email")}
//           />

//           {/* Password */}
//           <Field
//             icon={<LockIcon />}
//             placeholder="Password"
//             type={showPw ? "text" : "password"}
//             value={formData.password}
//             onChange={set("password")}
//             suffix={
//               <button
//                 type="button"
//                 onClick={() => setShowPw((v) => !v)}
//                 style={s.eyeBtn}
//               >
//                 {showPw ? <EyeOff /> : <EyeOn />}
//               </button>
//             }
//           />

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             style={s.submitBtn}
//             className="submit-btn"
//           >
//             {loading ? (
//               <span style={s.spinner} className="spin" />
//             ) : (
//               <>
//                 <span>Get Started</span>
//                 <span style={s.btnArrow}>→</span>
//               </>
//             )}
//           </button>

//           {/* Login link */}
//           <p style={s.loginLink}>
//             Already have an account?{" "}
//             <Link to="/" style={s.loginAnchor}>Sign in</Link>
//           </p>
//         </form>
//       </div>

//       {/* ── Crop modal ── */}
//       {cropOpen && rawImage && (
//         <CropModal
//           imageSrc={rawImage}
//           onDone={handleCropDone}
//           onCancel={handleCropCancel}
//         />
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    STYLES — page
// ───────────────────────────────────────────────────────────── */
// const s = {
//   root: {
//     position: "relative",
//     width: "100vw",
//     height: "100vh",
//     overflow: "hidden",
//     display: "flex",
//     alignItems: "flex-end",
//     justifyContent: "center",
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
//   floatBubble: {
//     position: "absolute", zIndex: 3, padding: "8px 14px",
//     borderRadius: "20px", fontSize: 12, color: "rgba(255,255,255,0.85)",
//     backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)",
//     fontFamily: "'DM Sans', sans-serif", fontWeight: 500, whiteSpace: "nowrap",
//     pointerEvents: "none", background: "rgba(255,255,255,0.09)",
//   },
//   brand: {
//     position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)",
//     zIndex: 20, display: "flex", alignItems: "center", gap: 10,
//     opacity: 0, transition: "opacity .6s ease .4s",
//   },
//   brandIcon: { fontSize: 28 },
//   brandName: {
//     fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700,
//     color: "#fff", letterSpacing: "0.04em",
//     textShadow: "0 2px 20px rgba(0,0,0,0.5)",
//   },
//   boyWalk: { left: "-20%" },
//   boyForm:  { left: "calc(50% - 340px)" },
//   boyWrap: {
//     position: "absolute", bottom: "14%", zIndex: 10,
//     width: 160, transition: "left 1.6s cubic-bezier(.22,1,.36,1)",
//   },
//   girlWalk: { right: "-20%" },
//   girlForm:  { right: "calc(50% - 340px)" },
//   girlWrap: {
//     position: "absolute", bottom: "14%", zIndex: 10,
//     width: 160, transition: "right 1.6s cubic-bezier(.22,1,.36,1)",
//   },
//   charSvg: { width: "100%", height: "auto", display: "block" },
//   formCard: {
//     position: "absolute", top: "50%", left: "50%",
//     transform: "translate(-50%, -50%)",
//     zIndex: 15,
//     width: "min(390px, 88vw)",
//     background: "rgba(10, 16, 28, 0.82)",
//     backdropFilter: "blur(28px)",
//     WebkitBackdropFilter: "blur(28px)",
//     borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
//     borderRadius: 24,
//     boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
//     overflow: "hidden",
//     transition: "opacity .5s ease, transform .5s cubic-bezier(.34,1.56,.64,1)",
//   },
//   cardGlow: {
//     position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
//     background: "linear-gradient(90deg, transparent, rgba(0,220,120,0.6), transparent)",
//   },
//   cardHeader: { padding: "28px 28px 0", textAlign: "center" },
//   cardEmoji: { fontSize: 28, display: "block", marginBottom: 6 },
//   cardTitle: {
//     fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600,
//     color: "#fff", margin: "0 0 4px", letterSpacing: "0.02em",
//   },
//   cardSub: { fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0 },
//   form: { padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 12 },
//   avatarLabel: {
//     display: "flex", flexDirection: "column", alignItems: "center",
//     cursor: "pointer", gap: 6,
//   },
//   avatarRing: {
//     width: 70, height: 70, borderRadius: "50%", padding: 3,
//     background: "linear-gradient(135deg, #00c978, #7b2ff7)",
//     position: "relative",
//   },
//   avatarImg: {
//     width: "100%", height: "100%", borderRadius: "50%",
//     objectFit: "cover", display: "block",
//   },
//   avatarBadge: {
//     position: "absolute", bottom: -2, right: -2,
//     width: 22, height: 22, borderRadius: "50%",
//     background: "#00c978", display: "flex", alignItems: "center",
//     justifyContent: "center", fontSize: 11,
//     borderWidth: 2, borderStyle: "solid", borderColor: "rgba(10,16,28,0.9)",
//   },
//   avatarText: { fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" },
//   fieldWrap: {
//     display: "flex", alignItems: "center", gap: 10,
//     background: "rgba(255,255,255,0.06)",
//     borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
//     borderRadius: 12, padding: "0 14px",
//     transition: "border-color .2s, background .2s, box-shadow .2s",
//   },
//   fieldFocused: {
//     borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,201,120,0.6)",
//     background: "rgba(0,201,120,0.07)",
//     boxShadow: "0 0 0 3px rgba(0,201,120,0.12)",
//   },
//   fieldIcon: { color: "rgba(255,255,255,0.35)", flexShrink: 0, transition: "color .2s" },
//   fieldIconFocused: { color: "#00c978" },
//   fieldInput: {
//     flex: 1, background: "transparent", border: "none", outline: "none",
//     color: "#fff", fontSize: 13.5, padding: "13px 0",
//     fontFamily: "'DM Sans', sans-serif",
//   },
//   eyeBtn: {
//     background: "none", border: "none", cursor: "pointer",
//     color: "rgba(255,255,255,0.4)", padding: 0,
//     display: "flex", alignItems: "center", transition: "color .2s",
//   },
//   submitBtn: {
//     display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//     padding: "13px", borderRadius: 12, border: "none", cursor: "pointer",
//     background: "linear-gradient(135deg, #00c978, #00a896)",
//     color: "#fff", fontSize: 14, fontWeight: 700,
//     fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
//     boxShadow: "0 4px 20px rgba(0,201,120,0.35)",
//     transition: "transform .15s, box-shadow .15s, opacity .15s",
//     marginTop: 2,
//   },
//   btnArrow: { fontSize: 16, transition: "transform .2s" },
//   spinner: {
//     width: 18, height: 18, display: "inline-block",
//     borderWidth: 2, borderStyle: "solid",
//     borderColor: "rgba(255,255,255,.3)",
//     borderTopColor: "#fff",
//     borderRadius: "50%",
//   },
//   loginLink: {
//     textAlign: "center", fontSize: 12,
//     color: "rgba(255,255,255,0.4)", margin: 0,
//   },
//   loginAnchor: {
//     color: "#00c978", fontWeight: 600,
//     textDecoration: "underline", textUnderlineOffset: 3,
//   },
// };

// /* ─────────────────────────────────────────────────────────────
//    STYLES — crop modal
// ───────────────────────────────────────────────────────────── */
// const ms = {
//   backdrop: {
//     position: "fixed", inset: 0, zIndex: 100,
//     background: "rgba(0,0,0,0.85)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     backdropFilter: "blur(6px)",
//   },
//   modal: {
//     width: "min(420px, 92vw)",
//     background: "rgba(10, 16, 28, 0.95)",
//     borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,201,120,0.25)",
//     borderRadius: 20,
//     boxShadow: "0 24px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)",
//     overflow: "hidden",
//     display: "flex", flexDirection: "column",
//   },
//   header: {
//     padding: "18px 22px 14px",
//     display: "flex", alignItems: "center", gap: 10,
//     borderBottom: "1px solid rgba(255,255,255,0.07)",
//   },
//   headerIcon: { fontSize: 18 },
//   headerTitle: {
//     fontSize: 15, fontWeight: 600, color: "#fff",
//     fontFamily: "'DM Sans', sans-serif",
//   },
//   cropArea: {
//     position: "relative",
//     width: "100%",
//     height: 300,
//     background: "#000",
//   },
//   sliderRow: {
//     display: "flex", alignItems: "center", gap: 10,
//     padding: "14px 22px",
//   },
//   sliderLabel: { fontSize: 16 },
//   slider: {
//     flex: 1, accentColor: "#00c978", cursor: "pointer", height: 4,
//   },
//   actions: {
//     display: "flex", gap: 10, padding: "0 22px 20px",
//   },
//   cancelBtn: {
//     flex: 1, padding: "11px", borderRadius: 10,
//     background: "rgba(255,255,255,0.07)",
//     borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.12)",
//     color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600,
//     cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
//     transition: "background .15s",
//   },
//   applyBtn: {
//     flex: 2, padding: "11px", borderRadius: 10,
//     background: "linear-gradient(135deg, #00c978, #00a896)",
//     border: "none",
//     color: "#fff", fontSize: 13, fontWeight: 700,
//     cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
//     boxShadow: "0 4px 16px rgba(0,201,120,0.35)",
//     transition: "transform .15s, box-shadow .15s",
//   },
// };

// /* ─────────────────────────────────────────────────────────────
//    GLOBAL CSS
// ───────────────────────────────────────────────────────────── */
// const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');

//   .brand-show { opacity: 1 !important; }

//   .card-hidden {
//     opacity: 0 !important;
//     transform: translate(-50%, -40%) scale(.94) !important;
//     pointer-events: none;
//   }
//   .card-show {
//     opacity: 1 !important;
//     transform: translate(-50%, -50%) scale(1) !important;
//   }

//   .char-transition {
//     transition: left 1.6s cubic-bezier(.22,1,.36,1),
//                 right 1.6s cubic-bezier(.22,1,.36,1);
//   }

//   .float-bubble {
//     animation: floatUp 4s ease-in-out infinite;
//   }
//   @keyframes floatUp {
//     0%, 100% { transform: translateY(0); }
//     50%       { transform: translateY(-10px); }
//   }

//   .avatar-hover:hover img {
//     transform: scale(1.05);
//     transition: transform .2s;
//   }

//   .submit-btn:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 28px rgba(0,201,120,.55) !important;
//   }
//   .submit-btn:active:not(:disabled) { transform: scale(.98); }
//   .submit-btn:disabled { opacity: .65; cursor: not-allowed; }

//   .spin { animation: spin .75s linear infinite; }
//   @keyframes spin { to { transform: rotate(360deg); } }

//   input::placeholder { color: rgba(255,255,255,0.25) !important; }

//   @media (max-width: 600px) {
//     .char-transition { width: 100px !important; }
//   }
// `;


import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cropper from "react-easy-crop";
import { addUser } from "../../chatSlice";
import { registerService } from "../../services/service";
import toast, { Toaster } from "react-hot-toast";

/* ─────────────────────────────────────────────────────────────
   UTILITY — crop a canvas region and return BOTH a blob URL
   (for preview) AND a File object (for upload)
───────────────────────────────────────────────────────────── */
async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width  = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0,
    pixelCrop.width, pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      resolve({ previewUrl: URL.createObjectURL(blob), file });
    }, "image/jpeg", 0.9);
  });
}

/* ─────────────────────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────────────────────── */
const UserIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
  </svg>
);
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
   BOY CHARACTER
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
      <rect x="14" y="105" width="20" height="48" rx="10" fill="#25a244" />
      <ellipse cx="24" cy="155" rx="10" ry="10" fill="#f4a261" />
      <rect x="86" y="88" width="20" height="48" rx="10" fill="#25a244" transform="rotate(-30 96 88)" />
      <ellipse cx="104" cy="128" rx="10" ry="10" fill="#f4a261" transform="rotate(-30 96 88) translate(3,0)" />
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
      <path d="M52 79 Q60 86 68 79" stroke="#c0603a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="75" y="20" width="44" height="28" rx="8" fill="#fff" opacity="0.95" />
      <polygon points="85,48 90,48 85,56" fill="#fff" opacity="0.95" />
      <text x="97" y="30" textAnchor="middle" fontSize="8" fill="#25a244" fontWeight="bold" fontFamily="sans-serif">Hi! 👋</text>
      <text x="97" y="42" textAnchor="middle" fontSize="7" fill="#555" fontFamily="sans-serif">Join us!</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   GIRL CHARACTER
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
      <rect x="10" y="88" width="22" height="48" rx="11" fill="#e040fb" transform="rotate(30 21 88)" />
      <ellipse cx="13" cy="130" rx="10" ry="10" fill="#f9c6ea" transform="rotate(30 21 88) translate(-3,0)" />
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
      <path d="M52 80 Q60 88 68 80" stroke="#d63384" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="1" y="18" width="48" height="28" rx="8" fill="#fff" opacity="0.95" />
      <polygon points="38,46 33,46 38,54" fill="#fff" opacity="0.95" />
      <text x="25" y="28" textAnchor="middle" fontSize="8" fill="#e040fb" fontWeight="bold" fontFamily="sans-serif">Hello! 💜</text>
      <text x="25" y="40" textAnchor="middle" fontSize="7" fill="#555" fontFamily="sans-serif">Let's chat!</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   IMAGE CROPPER MODAL
───────────────────────────────────────────────────────────── */
function CropModal({ imageSrc, onDone, onCancel }) {
  const [crop, setCrop]               = useState({ x: 0, y: 0 });
  const [zoom, setZoom]               = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  async function handleApply() {
    try {
      const result = await getCroppedImg(imageSrc, croppedArea);
      onDone(result);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div style={ms.backdrop}>
      <div style={ms.modal}>
        <div style={ms.header}>
          <span style={ms.headerIcon}>✂️</span>
          <span style={ms.headerTitle}>Crop your photo</span>
        </div>
        <div style={ms.cropArea}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div style={ms.sliderRow}>
          <span style={ms.sliderLabel}>🔍</span>
          <input
            type="range" min={1} max={3} step={0.05} value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={ms.slider}
          />
          <span style={ms.sliderLabel}>🔎</span>
        </div>
        <div style={ms.actions}>
          <button onClick={onCancel} style={ms.cancelBtn}>Cancel</button>
          <button onClick={handleApply} style={ms.applyBtn}>Apply Crop ✓</button>
        </div>
      </div>
    </div>
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
        style={s.fieldInput}
      />
      {suffix}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUBMIT BUTTON — 3-phase animation: loading → fly-out → navigate
───────────────────────────────────────────────────────────── */
function SubmitButton({ loading, launching }) {
  return (
    <button
      type="submit"
      disabled={loading || launching}
      style={s.submitBtn}
      className={`submit-btn${launching ? " btn-launch" : ""}`}
    >
      {launching ? (
        /* rocket flies up while card exits */
        <span style={s.rocket}>🚀</span>
      ) : loading ? (
        <span style={s.spinner} className="spin" />
      ) : (
        <>
          <span>Get Started</span>
          <span style={s.btnArrow}>→</span>
        </>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN REGISTER COMPONENT
───────────────────────────────────────────────────────────── */
export default function Register() {
  const [phase, setPhase]       = useState("walk"); // "walk" | "form"
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [launching, setLaunching] = useState(false); // card fly-out phase

  /* image state */
  const [rawImage, setRawImage]     = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile]   = useState(null);
  const [cropOpen, setCropOpen]     = useState(false);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  /* Walk-in → show form */
  useEffect(() => {
    const t = setTimeout(() => setPhase("form"), 1900);
    return () => clearTimeout(t);
  }, []);

  const set = (k) => (e) => setFormData((f) => ({ ...f, [k]: e.target.value }));

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setRawImage(reader.result); setCropOpen(true); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleCropDone({ previewUrl, file }) {
    setPreviewUrl(previewUrl);
    setImageFile(file);
    setCropOpen(false);
    setRawImage(null);
  }

  function handleCropCancel() { setCropOpen(false); setRawImage(null); }

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    let success = false;

    try {
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);
      if (imageFile) data.append("profileImage", imageFile);

      const response = await registerService(data);
      dispatch(addUser(response ?? { name, email, image: previewUrl }));

      // Mark success only AFTER the API resolves without throwing
      success = true;

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Registration failed. Try again.");

    } finally {
      setLoading(false);
    }

    // Navigate ONLY when registration succeeded — never on error
    if (success) {
      setLaunching(true);
      setTimeout(() => navigate("/verify-otp", { state: { email, name } }), 700);
    }
  }

  /* Floating bubbles */
  const bubbles = [
    { text: "Hey! 👋",         top: "12%",    left: "5%",   delay: "0s"   },
    { text: "How are you? 😊", top: "25%",    right: "4%",  delay: "0.8s" },
    { text: "Good morning ☀️", bottom: "30%", left: "3%",   delay: "1.4s" },
    { text: "Let's chat! 💬",  bottom: "20%", right: "5%",  delay: "0.4s" },
    { text: "Join us 🎉",      top: "8%",     right: "20%", delay: "1.8s" },
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
        <div key={i} className="float-bubble" style={{
          ...s.floatBubble,
          top: b.top, bottom: b.bottom, left: b.left, right: b.right,
          animationDelay: b.delay,
        }}>
          {b.text}
        </div>
      ))}

      {/* Brand */}
      <div style={s.brand} className={phase === "form" ? "brand-show" : ""}>
        <div style={s.brandIcon}>💬</div>
        <span style={s.brandName}>ChatApp</span>
      </div>

      {/* Characters */}
      <div className="char-transition"
        style={{ ...s.boyWrap, ...(phase === "form" ? s.boyForm : s.boyWalk) }}>
        <BoyCharacter style={s.charSvg} />
      </div>
      <div className="char-transition"
        style={{ ...s.girlWrap, ...(phase === "form" ? s.girlForm : s.girlWalk) }}>
        <GirlCharacter style={s.charSvg} />
      </div>

      {/* ── Registration card ── */}
      <div
        style={s.formCard}
        className={
          launching       ? "card-launch"  :
          phase === "form"? "card-show"    : "card-hidden"
        }
      >
        <div style={s.cardGlow} />

        <div style={s.cardHeader}>
          <span style={s.cardEmoji}>✨</span>
          <h1 style={s.cardTitle}>Create Account</h1>
          <p style={s.cardSub}>Join the conversation</p>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>

          {/* Avatar upload */}
          <label style={s.avatarLabel} className="avatar-hover">
            <div style={s.avatarRing}>
              <img
                src={previewUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="avatar"
                style={{ ...s.avatarImg, filter: previewUrl ? "none" : "grayscale(1) opacity(.5)" }}
              />
              <div style={s.avatarBadge}>📷</div>
            </div>
            <span style={s.avatarText}>{previewUrl ? "Change Photo" : "Upload & Crop"}</span>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          </label>

          <Field icon={<UserIcon />} placeholder="Full Name"      type="text"     value={formData.name}     onChange={set("name")} />
          <Field icon={<MailIcon />} placeholder="Email Address"  type="email"    value={formData.email}    onChange={set("email")} />
          <Field
            icon={<LockIcon />} placeholder="Password"
            type={showPw ? "text" : "password"}
            value={formData.password} onChange={set("password")}
            suffix={
              <button type="button" onClick={() => setShowPw((v) => !v)} style={s.eyeBtn}>
                {showPw ? <EyeOff /> : <EyeOn />}
              </button>
            }
          />

          <SubmitButton loading={loading} launching={launching} />

          <p style={s.loginLink}>
            Already have an account?{" "}
            <Link to="/" style={s.loginAnchor}>Sign in</Link>
          </p>
        </form>
      </div>

      {/* Crop modal */}
      {cropOpen && rawImage && (
        <CropModal imageSrc={rawImage} onDone={handleCropDone} onCancel={handleCropCancel} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STYLES — page  (unchanged from original except additions)
───────────────────────────────────────────────────────────── */
const s = {
  root: {
    position: "relative", width: "100vw", height: "100vh",
    overflow: "hidden", display: "flex",
    alignItems: "flex-end", justifyContent: "center",
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
  brandIcon: { fontSize: 28 },
  brandName: {
    fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700,
    color: "#fff", letterSpacing: "0.04em", textShadow: "0 2px 20px rgba(0,0,0,0.5)",
  },
  boyWalk: { left: "-20%" },
  boyForm:  { left: "calc(50% - 340px)" },
  boyWrap: {
    position: "absolute", bottom: "14%", zIndex: 10,
    width: 160, transition: "left 1.6s cubic-bezier(.22,1,.36,1)",
  },
  girlWalk: { right: "-20%" },
  girlForm:  { right: "calc(50% - 340px)" },
  girlWrap: {
    position: "absolute", bottom: "14%", zIndex: 10,
    width: 160, transition: "right 1.6s cubic-bezier(.22,1,.36,1)",
  },
  charSvg: { width: "100%", height: "auto", display: "block" },
  formCard: {
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 15, width: "min(390px, 88vw)",
    background: "rgba(10, 16, 28, 0.82)",
    backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
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
  cardHeader: { padding: "28px 28px 0", textAlign: "center" },
  cardEmoji: { fontSize: 28, display: "block", marginBottom: 6 },
  cardTitle: {
    fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600,
    color: "#fff", margin: "0 0 4px", letterSpacing: "0.02em",
  },
  cardSub: { fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0 },
  form: { padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 12 },
  avatarLabel: { display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", gap: 6 },
  avatarRing: {
    width: 70, height: 70, borderRadius: "50%", padding: 3,
    background: "linear-gradient(135deg, #00c978, #7b2ff7)", position: "relative",
  },
  avatarImg: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" },
  avatarBadge: {
    position: "absolute", bottom: -2, right: -2,
    width: 22, height: 22, borderRadius: "50%",
    background: "#00c978", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 11,
    borderWidth: 2, borderStyle: "solid", borderColor: "rgba(10,16,28,0.9)",
  },
  avatarText: { fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" },
  fieldWrap: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12, padding: "0 14px",
    transition: "border-color .2s, background .2s, box-shadow .2s",
  },
  fieldFocused: {
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,201,120,0.6)",
    background: "rgba(0,201,120,0.07)", boxShadow: "0 0 0 3px rgba(0,201,120,0.12)",
  },
  fieldIcon: { color: "rgba(255,255,255,0.35)", flexShrink: 0, transition: "color .2s" },
  fieldIconFocused: { color: "#00c978" },
  fieldInput: {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: "#fff", fontSize: 13.5, padding: "13px 0", fontFamily: "'DM Sans', sans-serif",
  },
  eyeBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "rgba(255,255,255,0.4)", padding: 0,
    display: "flex", alignItems: "center", transition: "color .2s",
  },
  submitBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "13px", borderRadius: 12, border: "none", cursor: "pointer",
    background: "linear-gradient(135deg, #00c978, #00a896)",
    color: "#fff", fontSize: 14, fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
    boxShadow: "0 4px 20px rgba(0,201,120,0.35)",
    transition: "transform .15s, box-shadow .15s, opacity .15s",
    marginTop: 2,
  },
  rocket: { fontSize: 20, display: "inline-block", animation: "rocketUp .7s ease-in forwards" },
  btnArrow: { fontSize: 16, transition: "transform .2s" },
  spinner: {
    width: 18, height: 18, display: "inline-block",
    borderWidth: 2, borderStyle: "solid",
    borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%",
  },
  loginLink: { textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 },
  loginAnchor: { color: "#00c978", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 },
};

/* ─────────────────────────────────────────────────────────────
   STYLES — crop modal
───────────────────────────────────────────────────────────── */
const ms = {
  backdrop: {
    position: "fixed", inset: 0, zIndex: 100,
    background: "rgba(0,0,0,0.85)",
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(6px)",
  },
  modal: {
    width: "min(420px, 92vw)",
    background: "rgba(10, 16, 28, 0.95)",
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,201,120,0.25)",
    borderRadius: 20,
    boxShadow: "0 24px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)",
    overflow: "hidden", display: "flex", flexDirection: "column",
  },
  header: {
    padding: "18px 22px 14px", display: "flex", alignItems: "center", gap: 10,
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  headerIcon: { fontSize: 18 },
  headerTitle: { fontSize: 15, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif" },
  cropArea: { position: "relative", width: "100%", height: 300, background: "#000" },
  sliderRow: { display: "flex", alignItems: "center", gap: 10, padding: "14px 22px" },
  sliderLabel: { fontSize: 16 },
  slider: { flex: 1, accentColor: "#00c978", cursor: "pointer", height: 4 },
  actions: { display: "flex", gap: 10, padding: "0 22px 20px" },
  cancelBtn: {
    flex: 1, padding: "11px", borderRadius: 10,
    background: "rgba(255,255,255,0.07)",
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background .15s",
  },
  applyBtn: {
    flex: 2, padding: "11px", borderRadius: 10,
    background: "linear-gradient(135deg, #00c978, #00a896)", border: "none",
    color: "#fff", fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 16px rgba(0,201,120,0.35)", transition: "transform .15s, box-shadow .15s",
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

  /* Card flies up and out when launching to OTP */
  .card-launch {
    opacity: 0 !important;
    transform: translate(-50%, -120%) scale(.9) !important;
    transition: opacity .6s ease, transform .65s cubic-bezier(.4,0,.2,1) !important;
    pointer-events: none;
  }

  /* Rocket emoji on submit button zooms up */
  @keyframes rocketUp {
    0%   { transform: translateY(0)    scale(1);   opacity: 1; }
    60%  { transform: translateY(-8px) scale(1.3); opacity: 1; }
    100% { transform: translateY(-40px) scale(.6); opacity: 0; }
  }

  .btn-launch {
    background: linear-gradient(135deg, #00c978, #7b2ff7) !important;
    overflow: hidden;
  }

  .char-transition {
    transition: left 1.6s cubic-bezier(.22,1,.36,1),
                right 1.6s cubic-bezier(.22,1,.36,1);
  }

  .float-bubble { animation: floatUp 4s ease-in-out infinite; }
  @keyframes floatUp {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-10px); }
  }

  .avatar-hover:hover img {
    transform: scale(1.05);
    transition: transform .2s;
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

  @media (max-width: 600px) {
    .char-transition { width: 100px !important; }
  }
`;
