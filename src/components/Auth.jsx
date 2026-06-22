// file: src/components/Auth.jsx
import React, { useState } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload
} from 'firebase/auth';
import { auth } from '../firebase';

export default function AuthPage({ user }) {
  // If user exists but email isn't verified, force them to the verify screen
  const [step, setStep] = useState(user && !user.emailVerified ? 'verify' : 'login');

  // Form States
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(user?.displayName?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.displayName?.split(' ')[1] || '');
  const [showPassword, setShowPassword] = useState(false);
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [formError, setFormError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // 1. EMAIL LOGIN
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setFormError('Invalid email or password.');
      } else {
        setFormError('Failed to login. Please try again.');
      }
      setIsLoading(false);
    }
  };

  // 2. EMAIL SIGN UP
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !email || !password) return;
    setIsLoading(true);
    setFormError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: firstName + (lastName ? ' ' + lastName : '')
      });

      // SEND FIREBASE VERIFICATION EMAIL
      await sendEmailVerification(userCredential.user);
      
      // Move to verify screen
      setStep('verify');
      setIsLoading(false);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setFormError('This email is already registered. Try logging in.');
      } else if (error.code === 'auth/weak-password') {
        setFormError('Password should be at least 6 characters.');
      } else {
        setFormError('Failed to create account. Try again.');
      }
      setIsLoading(false);
    }
  };

  // 3. CHECK VERIFICATION STATUS
  const handleCheckVerification = async () => {
    setIsLoading(true);
    setFormError('');
    setInfoMessage('');
    
    try {
      await reload(auth.currentUser); // Forces Firebase to check if user clicked the link
      if (!auth.currentUser?.emailVerified) {
        setFormError('Your email is not verified yet. Please check your inbox.');
        setIsLoading(false);
      }
      // If verified, App.jsx will automatically catch it and redirect to Dashboard!
    } catch (error) {
      setFormError('Error checking verification status.');
      setIsLoading(false);
    }
  };

  // 4. RESEND VERIFICATION
  const handleResendEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setInfoMessage('Verification email sent! Check your inbox.');
      setFormError('');
    } catch (error) {
      setFormError('Failed to resend email. Try again later.');
    }
  };

  // 5. FORGOT PASSWORD
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');
    setInfoMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setInfoMessage('Password reset link sent! Check your email.');
      setStep('login');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setFormError('No account found with this email.');
      } else {
        setFormError('Failed to send reset email.');
      }
    }
    setIsLoading(false);
  };

  // 6. GOOGLE SIGN IN
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError('');
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error) {
      setGoogleError(
        error?.code === 'auth/popup-closed-by-user'
          ? 'Google sign-in popup was closed.'
          : 'Google sign-in failed. Try again.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 flex items-center justify-center relative overflow-hidden font-sans select-none bg-[url('/chart-bg.png')] bg-cover bg-center px-4 sm:px-8 py-12">
      <div className="absolute inset-0 bg-[#020408]/50 backdrop-blur-[2px] pointer-events-none z-0" />
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] left-[10%] w-[700px] h-[700px] bg-emerald-600/15 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-between bg-white/[0.03] border border-white/[0.08] rounded-[2.5rem] p-8 lg:p-16 backdrop-blur-xl relative shadow-[0_0_100px_rgba(0,0,0,0.8)] z-10 gap-16 lg:gap-24">
        
        {/* LEFT SIDE - BRANDING */}
        <div className="w-full lg:w-1/2 flex flex-col items-start justify-center pl-8 lg:pl-12">
          <img src="/logo2.png" alt="Vyro Logo" className="w-24 h-auto object-contain mb-8 drop-shadow-[0_0_15px_rgba(0,223,115,0.2)]" />
          <div className="space-y-5">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
              VYRO{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00df73] to-[#00ff85] drop-shadow-[0_0_15px_rgba(0,223,115,0.4)]">
                JOURNAL
              </span>
            </h1>
            <p className="text-sm sm:text-base font-extrabold tracking-[0.3em] text-emerald-400 uppercase drop-shadow-lg">
              Track. Analyze. Dominate.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - FORMS */}
        <div className="w-full lg:w-1/2 max-w-[420px] relative">
          <div className="space-y-8">
            
            {/* LOGIN SCREEN */}
            {step === 'login' && (
              <>
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white">Welcome Back</h2>
                  <p className="text-sm font-bold text-slate-400">Access your trading dashboard</p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">Email</label>
                    <input
                      type="email" required placeholder="you@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-5 py-4 text-base font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] focus:ring-4 focus:ring-[#00df73]/10 transition-all duration-200 shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-5 py-4 text-base font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] focus:ring-4 focus:ring-[#00df73]/10 transition-all duration-200 shadow-inner"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-5 text-slate-400 hover:text-[#00df73] transition-colors font-bold text-xs uppercase tracking-wider">
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  {formError && <p className="text-sm text-red-400 text-center font-semibold">{formError}</p>}
                  {infoMessage && <p className="text-sm text-emerald-400 text-center font-semibold">{infoMessage}</p>}

                  <div className="flex items-center justify-between text-sm font-bold pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded accent-[#00df73] bg-slate-900 border-slate-700 focus:ring-0" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => { setStep('forgot'); setFormError(''); setInfoMessage(''); }} className="text-[#00df73] hover:text-[#00ff85] hover:underline transition-colors">
                      Forgot Password?
                    </button>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full bg-[#00df73] text-[#020408] font-black uppercase tracking-wider py-4 rounded-xl transition-all duration-300 hover:bg-[#00ff85] hover:shadow-[0_0_30px_rgba(0,223,115,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 text-base mt-6">
                    {isLoading ? <div className="h-5 w-5 border-4 border-[#020408] border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
                  </button>
                </form>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-800" />
                  <span className="mx-4 text-xs font-bold text-slate-500 uppercase tracking-[0.25em]">or</span>
                  <div className="flex-grow border-t border-slate-800" />
                </div>

                <button type="button" onClick={handleGoogleSignIn} disabled={googleLoading} className="w-full bg-white text-black font-black uppercase tracking-wider py-4 rounded-xl transition-all duration-300 hover:bg-slate-100 active:scale-[0.98] flex items-center justify-center gap-3 text-base disabled:opacity-70 disabled:cursor-not-allowed">
                  {googleLoading ? <div className="h-5 w-5 border-4 border-black border-t-transparent rounded-full animate-spin"></div> : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.4 6.3 14.7z" />
                        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.1C29.3 35.4 26.8 36 24 36c-5.3 0-9.8-3.3-11.3-8.1l-6.5 5C9.5 39.7 16.1 44 24 44z" />
                        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-3 5-5.8 6.7l.1-.1 6.2 5.1C35.3 38 44 31 44 24c0-1.3-.1-2.4-.4-3.5z" />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>
                {googleError && <p className="text-sm text-red-400 text-center">{googleError}</p>}

                <div className="text-center text-sm font-bold text-slate-400 pt-6 border-t border-slate-800">
                  New to Vyro?{' '}
                  <button onClick={() => { setStep('signup'); setFormError(''); setInfoMessage(''); }} className="text-[#00df73] hover:text-[#00ff85] hover:underline transition-colors ml-1">
                    Create Account
                  </button>
                </div>
              </>
            )}

            {/* SIGNUP SCREEN */}
            {step === 'signup' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white">Create Account</h2>
                  <p className="text-sm font-bold text-slate-400">Join the elite trading community</p>
                </div>
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">First Name</label>
                      <input type="text" required placeholder=" " value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all duration-200" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">Last Name</label>
                      <input type="text" placeholder=" " value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all duration-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">Email</label>
                    <input type="email" required placeholder="name@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">Password</label>
                    <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all duration-200" />
                  </div>
                  {formError && <p className="text-sm text-red-400 text-center font-semibold">{formError}</p>}
                  <button type="submit" disabled={isLoading} className="w-full bg-[#00df73] text-[#020408] font-black uppercase tracking-wider py-4 rounded-xl transition-all duration-300 hover:bg-[#00ff85] hover:shadow-[0_0_30px_rgba(0,223,115,0.5)] active:scale-[0.98] text-base mt-4 flex items-center justify-center gap-2">
                    {isLoading ? <div className="h-5 w-5 border-4 border-[#020408] border-t-transparent rounded-full animate-spin mx-auto"></div> : 'Register Account'}
                  </button>
                </form>
                <div className="text-center text-sm font-bold text-slate-400 pt-4 border-t border-slate-800">
                  Already registered?{' '}
                  <button onClick={() => { setStep('login'); setFormError(''); setInfoMessage(''); }} className="text-[#00df73] hover:underline transition-colors ml-1">Sign In</button>
                </div>
              </div>
            )}

            {/* VERIFY EMAIL SCREEN */}
            {step === 'verify' && (
              <div className="space-y-8 text-center flex flex-col items-center">
                
                {/* Animated Envelope Icon */}
                <div className="relative w-20 h-20 flex items-center justify-center mb-4">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
                  <div className="relative w-16 h-16 border-2 border-emerald-500/30 rounded-2xl bg-[#0a0e17]/80 flex items-center justify-center shadow-[0_0_30px_rgba(0,223,115,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00df73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white">Verify Your Email</h2>
                  <p className="text-sm font-bold text-slate-400 leading-relaxed px-4">
                    We sent a secure verification link to <br/>
                    <span className="text-emerald-400 font-bold">{auth.currentUser?.email}</span>. <br/>
                    Please check your inbox and spam folder to activate your account.
                  </p>
                </div>

                {formError && <p className="text-sm text-red-400 text-center font-semibold">{formError}</p>}
                {infoMessage && <p className="text-sm text-emerald-400 text-center font-semibold">{infoMessage}</p>}

                <div className="space-y-4 w-full">
                  <button onClick={handleCheckVerification} disabled={isLoading} className="w-full bg-[#00df73] text-[#020408] font-black uppercase tracking-wider py-4 rounded-xl transition-all duration-300 hover:bg-[#00ff85] hover:shadow-[0_0_30px_rgba(0,223,115,0.5)] active:scale-[0.98] text-base flex items-center justify-center gap-2">
                    {isLoading ? <div className="h-5 w-5 border-4 border-[#020408] border-t-transparent rounded-full animate-spin"></div> : "I've Verified My Email"}
                  </button>

                  <button onClick={handleResendEmail} className="w-full text-center text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors py-2">
                    Resend Verification Email
                  </button>

                  <button onClick={() => auth.signOut()} className="w-full text-center text-sm font-bold text-red-400 hover:text-red-300 transition-colors py-2">
                    Cancel & Logout
                  </button>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD SCREEN */}
            {step === 'forgot' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white">Reset Password</h2>
                  <p className="text-sm font-bold text-slate-400">Enter your email to receive a reset link.</p>
                </div>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 tracking-wider uppercase">Email</label>
                    <input type="email" required placeholder="name@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0a0e17]/80 border-2 border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00df73] transition-all duration-200" />
                  </div>
                  {formError && <p className="text-sm text-red-400 text-center font-semibold">{formError}</p>}
                  <button type="submit" disabled={isLoading} className="w-full bg-[#00df73] text-[#020408] font-black uppercase tracking-wider py-4 rounded-xl transition-all duration-300 hover:bg-[#00ff85] hover:shadow-[0_0_30px_rgba(0,223,115,0.5)] active:scale-[0.98] text-base mt-4 flex items-center justify-center gap-2">
                    {isLoading ? <div className="h-5 w-5 border-4 border-[#020408] border-t-transparent rounded-full animate-spin mx-auto"></div> : 'Send Reset Link'}
                  </button>
                </form>
                <div className="text-center text-sm font-bold text-slate-400 pt-4 border-t border-slate-800">
                  Remembered it?{' '}
                  <button onClick={() => { setStep('login'); setFormError(''); setInfoMessage(''); }} className="text-[#00df73] hover:underline transition-colors ml-1">Back to Login</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      <div className="absolute bottom-6 w-full text-center text-xs font-bold text-slate-500/70 tracking-widest z-10">
        &copy; 2026 VYRO LABS. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}