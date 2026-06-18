import React, { useState } from 'react';

export default function AuthPage({ onLoginSuccess }) {
  const [step, setStep] = useState('login'); // 'login', 'signup', or 'otp'
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form Submissions
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email.split('@')[0]);
    }, 1200);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(firstName || "Trader");
    }, 1200);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value !== '' && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 flex items-center justify-center relative overflow-hidden font-sans select-none bg-[url('/chart-bg.png')] bg-cover bg-center px-4 sm:px-8 py-12">
      
      {/* 
        LIGHTER BACKDROP OVERLAY 
        Reduced opacity to 50% so the background image pops brightly behind the layout.
      */}
      <div className="absolute inset-0 bg-[#020408]/50 backdrop-blur-[2px] pointer-events-none z-0" />
      
      {/* GLOW EFFECTS */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] left-[10%] w-[700px] h-[700px] bg-emerald-600/15 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* 
        THE SEAMLESS GLASS CONTAINER
        Removed the internal borders and replaced them with a massive, 
        unified frosted glass card that perfectly blends both sections.
      */}
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-between bg-white/[0.03] border border-white/[0.08] rounded-[2.5rem] p-8 lg:p-16 backdrop-blur-xl relative shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 gap-16 lg:gap-24">
        
        {/* LEFT COMPONENT: Bold, Eye-Catching Branding */}
        <div className="w-full lg:w-1/2 flex flex-col items-start justify-center space-y-1 pl-8 lg:pl-12 lg:-mt-20">
          
          <svg className="w-24 h-24 lg:w-28 lg:h-28 drop-shadow-[0_0_30px_rgba(0,223,115,0.6)] transition-transform duration-300 hover:scale-105" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 8L16 30L21 19L11 8H6Z" fill="#00df73" />
            <path d="M23.5 8L18.5 19L23.5 30L33.5 8H23.5Z" fill="#00df73" />
          </svg>

          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
              VYRO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00df73] to-[#00ff85] drop-shadow-[0_0_15px_rgba(0,223,115,0.4)]">JOURNAL</span>
            </h1>
            <p className="text-sm sm:text-base font-extrabold tracking-[0.3em] text-emerald-400 uppercase drop-shadow-lg">
              Track. Analyze. Dominate.
            </p>
          </div>
        </div>

        {/* RIGHT COMPONENT: The Seamless Form */}
        <div className="w-full lg:w-1/2 max-w-[420px] relative">
          
          <div className="space-y-8">

            {/* --- VIEW STATE 1: SIGN IN --- */}
            {step === 'login' && (
              <>
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">Welcome Back</h2>
                  <p className="text-sm font-bold text-slate-400">Access your trading dashboard</p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">Email</label>
                    <input
                      type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-5 py-4 text-base font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] focus:ring-4 focus:ring-[#00df73]/10 transition-all duration-200 shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-5 py-4 text-base font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] focus:ring-4 focus:ring-[#00df73]/10 transition-all duration-200 shadow-inner"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-5 text-slate-400 hover:text-[#00df73] transition-colors font-bold text-xs uppercase tracking-wider">
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm font-bold pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded accent-[#00df73] bg-slate-900 border-slate-700 focus:ring-0" />
                      Remember me
                    </label>
                    <button type="button" className="text-[#00df73] hover:text-[#00ff85] hover:underline transition-colors">Forgot Password?</button>
                  </div>

                  <button
                    type="submit" disabled={isLoading}
                    className="w-full bg-[#00df73] text-[#020408] font-black uppercase tracking-wider py-4 rounded-xl transition-all duration-300 hover:bg-[#00ff85] hover:shadow-[0_0_30px_rgba(0,223,115,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 text-base mt-6"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-4 border-[#020408] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="text-center text-sm font-bold text-slate-400 pt-6 border-t border-slate-800">
                  New to Vyro? {' '}
                  <button onClick={() => setStep('signup')} className="text-[#00df73] hover:text-[#00ff85] hover:underline transition-colors ml-1">Create Account</button>
                </div>
              </>
            )}

            {/* --- VIEW STATE 2: REGISTRATION --- */}
            {step === 'signup' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">Create Account</h2>
                  <p className="text-sm font-bold text-slate-400">Join the elite trading community</p>
                </div>

                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">First Name</label>
                      <input
                        type="text" required placeholder=" " value={firstName} onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">Last Name</label>
                      <input
                        type="text" placeholder=" " value={lastName} onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">Email</label>
                    <input
                      type="email" required placeholder="name@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">Password</label>
                    <input
                      type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all duration-200"
                    />
                  </div>

                  <button
                    type="submit" disabled={isLoading}
                    className="w-full bg-[#00df73] text-[#020408] font-black uppercase tracking-wider py-4 rounded-xl transition-all duration-300 hover:bg-[#00ff85] hover:shadow-[0_0_30px_rgba(0,223,115,0.5)] active:scale-[0.98] text-base mt-4"
                  >
                    {isLoading ? <div className="h-5 w-5 border-4 border-[#020408] border-t-transparent rounded-full animate-spin mx-auto"></div> : "Register Account"}
                  </button>
                </form>

                <div className="text-center text-sm font-bold text-slate-400 pt-4 border-t border-slate-800">
                  Already registered? {' '}
                  <button onClick={() => setStep('login')} className="text-[#00df73] hover:underline transition-colors ml-1">Sign In</button>
                </div>
              </div>
            )}

            {/* --- VIEW STATE 3: OTP VERIFICATION --- */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">Security Code</h2>
                  <p className="text-sm font-bold text-slate-400 leading-relaxed">
                    Enter the 6-digit access token sent to your email.
                  </p>
                </div>

                <div className="flex justify-between gap-3 py-2">
                  {otp.map((data, index) => (
                    <input
                      key={index} type="text" maxLength={1} value={data} onChange={(e) => handleOtpChange(e.target, index)} onFocus={(e) => e.target.select()}
                      className="w-full aspect-square text-center text-3xl font-black bg-[#0a0e17]/90 border-2 border-slate-700/50 rounded-xl text-[#00df73] focus:outline-none focus:border-[#00df73] focus:ring-4 focus:ring-[#00df73]/20 transition-all shadow-inner"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    className="w-full bg-[#00df73] text-[#020408] font-black uppercase tracking-wider py-4 rounded-xl transition-all duration-300 hover:bg-[#00ff85] hover:shadow-[0_0_30px_rgba(0,223,115,0.5)] active:scale-[0.98] text-base"
                  >
                    Verify & Enter
                  </button>
                  
                  <button type="button" onClick={() => setStep('login')} className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-300 transition-colors py-2">
                    &larr; Cancel
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
      
      {/* COPYRIGHT */}
      <div className="absolute bottom-6 w-full text-center text-xs font-bold text-slate-500/70 tracking-widest z-10">
        &copy; 2026 VYRO LABS. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}