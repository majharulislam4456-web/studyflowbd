import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { lovable } from '@/integrations/lovable/index';
import logoImg from '@/assets/logo.jpg';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try { emailSchema.parse(email); } catch (e) {
      if (e instanceof z.ZodError) newErrors.email = e.errors[0].message;
    }
    try { passwordSchema.parse(password); } catch (e) {
      if (e instanceof z.ZodError) newErrors.password = e.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({ title: "Login Failed / লগইন ব্যর্থ", description: "Invalid email or password.", variant: "destructive" });
          } else if (error.message.includes('Email not confirmed')) {
            toast({ title: "Email Not Verified / ইমেইল যাচাই হয়নি", description: "Please check your email.", variant: "destructive" });
          } else {
            toast({ title: "Error", description: error.message, variant: "destructive" });
          }
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({ title: "Account Exists", description: "This email is already registered.", variant: "destructive" });
          } else {
            toast({ title: "Error", description: error.message, variant: "destructive" });
          }
        } else {
          toast({ title: "Account Created! / অ্যাকাউন্ট তৈরি হয়েছে!", description: "Please check your email to verify." });
          setIsLogin(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (error) toast({ title: "Google Sign-In Failed", description: error.message, variant: "destructive" });
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logoImg} alt="Study Tracker" className="w-20 h-20 mx-auto rounded-2xl shadow-lg mb-4 object-cover" />
          <h1 className="text-3xl font-bold text-foreground">Study Tracker</h1>
          <p className="text-muted-foreground font-bengali mt-1">স্টাডি ট্র্যাকার</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-sm text-muted-foreground font-bengali">
              {isLogin ? 'স্বাগতম!' : 'অ্যাকাউন্ট তৈরি করুন'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Name / <span className="font-bengali">নাম</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="pl-10" autoComplete="name" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email / <span className="font-bengali">ইমেইল</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })); }} placeholder="you@example.com" className={cn("pl-10", errors.email && "border-destructive")} autoComplete="email" required />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password / <span className="font-bengali">পাসওয়ার্ড</span></Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: undefined })); }} placeholder="••••••••" className={cn("pl-10 pr-10", errors.password && "border-destructive")} autoComplete={isLogin ? "current-password" : "new-password"} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLogin ? <>Login / <span className="font-bengali">লগইন</span></> : <>Sign Up / <span className="font-bengali">সাইন আপ</span></>}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or / <span className="font-bengali">অথবা</span></span>
              </div>
            </div>

            <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
              {isGoogleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google / <span className="font-bengali">গুগল দিয়ে লগইন</span>
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsLogin(!isLogin); setErrors({}); }} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {isLogin ? <>Don't have an account? <span className="text-primary font-medium">Sign Up</span></> : <>Already have an account? <span className="text-primary font-medium">Login</span></>}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">Study Tracker v4.8.6</p>
      </div>
    </div>
  );
}
