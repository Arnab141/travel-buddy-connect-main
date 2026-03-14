import { useState, useEffect } from "react";
import { Eye, EyeOff, MapPin, Compass, Car, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import travelHero from "@/assets/travel-hero.jpg";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  const {register, generateOTP, verifyOTP, login} = useUser();

  // ✅ OTP States
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  // ✅ Timer state
  const [otpTimer, setOtpTimer] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fake OTP Send (Replace with backend API later)
 const handleSendOtp = async () => {
  if (!email) {
    toast.error("Please enter email first!",{position: "top-center"});
    return;
  }

  try {
    setOtpLoading(true);

    const response = await generateOTP(email);
    //console.log("OTP Response:", response);

   // ✅ If backend says success
    if (response?.success) {
      setIsOtpSent(true);
      setIsOtpVerified(false);
      setOtp("");
      setOtpTimer(60); // start 60 sec timer

      toast.success("OTP sent successfully to your email!",{position: "top-center"});
    } else {
      toast.error(response?.message || "Failed to send OTP!",{position: "top-center"});
    }
  } catch (error) {
    console.error("Send OTP Error:", error);
    toast.error("Something went wrong while sending OTP!",{position: "top-center"});
  } finally {
    setOtpLoading(false);
  }
};


  // ✅ Fake OTP Verify (Replace with backend API later)
const handleVerifyOtp = async () => {
  if (!otp) {
    toast.error("Please enter OTP!", { position: "top-center" });
    return;
  }

  try {
    setVerifyOtpLoading(true);

    const response = await verifyOTP(email, otp);
    console.log("Verify OTP Response:", response);

    if (response?.success) {
      setIsOtpVerified(true);
      toast.success(response?.message || "OTP Verified Successfully", {
        position: "top-center",
      });
    } else {
      setIsOtpVerified(false);
      toast.error(response?.message || "Invalid OTP", {
        position: "top-center",
      });
    }
  } catch (error) {
    console.log("Verify OTP Error:", error.response?.data || error.message);

    setIsOtpVerified(false);
    toast.error(error.response?.data?.message || "Invalid OTP", {
      position: "top-center",
    });
  } finally {
    setVerifyOtpLoading(false);
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();

  setIsLoading(true);

  try {
    // ✅ LOGIN
    if (isLogin) {
      await login(email, password);
      return; // 🔥 important: stop here, don't run signup code
    }

    // ✅ SIGNUP validation: OTP must be verified
    if (!isOtpVerified) {
      toast.error("Please verify OTP before creating account!", {
        position: "top-center",
      });
      return;
    }

    // ✅ Phone validation
    if (phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits!", {
        position: "top-center",
      });
      return;
    }

    // ✅ REGISTER
    await register({ name, email, password, gender, phone });

  } catch (err) {
    console.error("Auth Error:", err);
    toast.error("Authentication failed! Please try again.", {
      position: "top-center",
    });
  } finally {
    setIsLoading(false);
  }
};


 
  // ✅ OTP Timer Logic
  useEffect(() => {
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={travelHero}
          alt="Beautiful travel destination"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

        <div className="absolute top-8 left-8 flex items-center gap-2 animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Car className="w-5 h-5 text-primary-foreground" />
          </div>
          <Link to="/" className="text-primary-foreground font-bold text-xl">
            Travel Buddy
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-12 animate-slide-up">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            Discover Your Next
            <br />
            <span className="text-sunset">Adventure</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Connect with fellow travelers, share experiences, and explore the
            world together.
          </p>

          <div className="flex gap-8 mt-8">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-primary-foreground/90">195+ Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <span className="text-primary-foreground/90">10K+ Adventures</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-foreground">
              Travel Buddy
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome back" : "Join the adventure"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to continue your journey"
                : "Create an account to start exploring"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-muted border-border focus:border-primary focus:ring-primary"
                  required={!isLogin}
                />
              </div>
            )}

            {/* ✅ Email + Send OTP Button */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>

              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-muted border-border focus:border-primary focus:ring-primary"
                  required
                  disabled={!isLogin && isOtpVerified}
                />

                {/* Only in Signup */}
                {!isLogin && (
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    className="h-12 px-4"
                    disabled={
                      otpLoading ||
                      !email ||
                      isOtpVerified ||
                      otpTimer > 0
                    }
                  >
                    {otpLoading
                      ? "Sending..."
                      : otpTimer > 0
                        ? `Resend in ${otpTimer}s`
                        : isOtpSent
                          ? "Resend OTP"
                          : "Send OTP"}
                  </Button>
                )}
              </div>
            </div>

            {/* ✅ OTP Input */}
            {!isLogin && isOtpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-foreground">
                  Enter OTP
                </Label>

                <div className="flex gap-2">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-12 bg-muted border-border focus:border-primary focus:ring-primary"
                    maxLength={6}
                    disabled={isOtpVerified}
                    required
                  />

                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="h-12 px-4"
                    disabled={verifyOtpLoading || !otp || isOtpVerified}
                  >
                    {verifyOtpLoading
                      ? "Verifying..."
                      : isOtpVerified
                        ? "Verified"
                        : "Verify"}
                  </Button>
                </div>

                {isOtpVerified && (
                  <p className="text-sm text-green-600 font-medium">
                    ✅ OTP verified successfully!
                  </p>
                )}
              </div>
            )}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground">
                  Gender
                </Label>

                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required={!isLogin}
                  className="h-12 w-full rounded-md bg-muted border border-border px-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  Phone Number
                </Label>

                <div className="flex">
                  {/* +91 Fixed */}
                  <div className="h-12 px-4 flex items-center rounded-l-md bg-muted border border-border text-foreground font-medium">
                    +91
                  </div>

                  {/* 10 digit input */}
                  <Input
                    id="phone"
                    type="text"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => {
                      // ✅ only digits
                      let value = e.target.value.replace(/\D/g, "");

                      // ✅ max 10 digits
                      if (value.length > 10) value = value.slice(0, 10);

                      setPhone(value);
                    }}
                    className="h-12 rounded-l-none bg-muted border-border focus:border-primary focus:ring-primary"
                    required={!isLogin}
                    maxLength={10}
                    inputMode="numeric"
                  />
                </div>

                {/* Validation Message */}
                {phone.length > 0 && phone.length < 10 && (
                  <p className="text-sm text-red-500 font-medium">
                    Phone number must be exactly 10 digits.
                  </p>
                )}
              </div>
            )}




            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-muted border-border focus:border-primary focus:ring-primary pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Toggle Auth Mode */}
          <p className="text-center mt-8 text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);

                // reset
                setPhone("");
                setGender("");
                setOtp("");
                setIsOtpSent(false);
                setIsOtpVerified(false);
                setOtpTimer(0);
              }}
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
