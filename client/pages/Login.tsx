import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Brain,
  Cpu,
  Sparkles,
  Network,
  Zap,
  Shield,
  Globe,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Play,
  Activity,
  TrendingUp,
  Megaphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "@/lib/utils";
import IntegrationsFooter from "@/components/auth/IntegrationsFooter";
import AssociationPartners from "@/components/auth/AssociationPartners";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const navigate = useNavigate();

  const testimonials = [
    {
      id: 1,
      name: "James Martin",
      title: "VP Sales, TechCorp",
      quote: "VAIS completely transformed how we prioritize leads",
      review: "ROI increased by 40% in just 3 months.",
      initials: "JM",
      color: "from-valasys-orange to-valasys-orange-light",
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah Rodriguez",
      title: "Director, Sales Growth",
      quote: "The AI insights are incredible",
      review: "We're closing deals 2x faster with better quality leads.",
      initials: "SR",
      color: "from-valasys-blue to-valasys-blue-light",
      rating: 5,
    },
    {
      id: 3,
      name: "Michael Kim",
      title: "CEO, Growth Ventures",
      quote: "Best investment we've made",
      review: "Immediate impact on pipeline quality and team efficiency.",
      initials: "MK",
      color: "from-valasys-green to-valasys-green-light",
      rating: 5,
    },
    {
      id: 4,
      name: "Brian M.",
      title: "Sales Development Rep",
      quote: "Finding Hot Leads Has Never Been This Easy",
      review: "I like how Valasys AI tells me which companies are actually ready to hear from us. As an Sales Development Rep, I need to know who to call first. The score makes that super clear. I also like the contact lists—it helps me find the right people in each company so I don't waste time hunting them down.",
      initials: "BM",
      color: "from-valasys-orange to-valasys-orange-light",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % (testimonials.length - 1));
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + (testimonials.length - 1)) % (testimonials.length - 1));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (show2FA && resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0) {
      setCanResendOTP(true);
    }
  }, [show2FA, resendCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Login attempt:", { email, password, rememberMe });
    setIsLoading(false);
    try {
      localStorage.setItem("valasys-open-mastery-once", "1");
    } catch {}
    navigate("/");
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== 6) return;

    setIsVerifying(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("2FA verification:", { otpValue });
    setIsVerifying(false);

    // Here you would redirect to dashboard
    // For demo, we'll just reset
    setShow2FA(false);
    setOtpValue("");
  };

  const handleResendOTP = async () => {
    setCanResendOTP(false);
    setResendCountdown(30);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Resending OTP");
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  const handleMagicLink = () => {
    console.log("Send magic link to:", email);
  };

  // AI/ML themed floating elements
  const aiElements = [
    {
      top: "10%",
      left: "15%",
      delay: "0s",
      size: "w-3 h-3",
      color: "bg-valasys-orange/30",
    },
    {
      top: "25%",
      right: "20%",
      delay: "1s",
      size: "w-2 h-2",
      color: "bg-valasys-blue/40",
    },
    {
      top: "40%",
      left: "8%",
      delay: "2s",
      size: "w-4 h-4",
      color: "bg-valasys-green/25",
    },
    {
      top: "60%",
      right: "12%",
      delay: "3s",
      size: "w-2.5 h-2.5",
      color: "bg-valasys-orange/35",
    },
    {
      top: "75%",
      left: "25%",
      delay: "4s",
      size: "w-3.5 h-3.5",
      color: "bg-valasys-blue/30",
    },
    {
      top: "85%",
      right: "35%",
      delay: "0.5s",
      size: "w-2 h-2",
      color: "bg-valasys-green/40",
    },
  ];

  // Integration partners data
  const integrations = [
    {
      name: "Salesforce",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
      description: "CRM Integration",
      color: "bg-blue-500",
    },
    {
      name: "HubSpot",
      logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
      description: "Marketing Automation",
      color: "bg-orange-500",
    },
  ];

  if (show2FA) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-valasys-gray-50 via-white to-valasys-orange/5 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background AI Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {aiElements.map((element, index) => (
            <div
              key={index}
              className={`absolute ${element.size} ${element.color} rounded-full animate-pulse`}
              style={{
                top: element.top,
                left: element.left,
                right: element.right,
                animationDelay: element.delay,
              }}
            />
          ))}
        </div>

        {/* 2FA Card */}
        <Card className="w-full max-w-md border-valasys-gray-200 shadow-xl bg-white/95 backdrop-blur-sm relative z-10">
          <CardHeader className="text-center space-y-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F76d83d63beb8455692b1855a78aa9524%2F5ee47be8ea214f9c9b220b553ddb9ad1?format=webp&width=800"
              alt="Valasys AI Score logo"
              className="mx-auto h-16 w-auto object-contain"
            />
            <div>
              <CardTitle className="text-xl font-semibold text-valasys-gray-900">
                Two-Factor Authentication
              </CardTitle>
              <p className="text-valasys-gray-600 text-sm mt-2">
                Enter the 6-digit verification code sent to your device
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-valasys-gray-700">
                  Verification Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={setOtpValue}
                    className="gap-2"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20"
                      />
                      <InputOTPSlot
                        index={1}
                        className="border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20"
                      />
                      <InputOTPSlot
                        index={2}
                        className="border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20"
                      />
                      <InputOTPSlot
                        index={3}
                        className="border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20"
                      />
                      <InputOTPSlot
                        index={4}
                        className="border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20"
                      />
                      <InputOTPSlot
                        index={5}
                        className="border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isVerifying || otpValue.length !== 6}
                className="w-full bg-valasys-orange hover:bg-valasys-orange-light text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102"
              >
                {isVerifying ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Code
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <button
                onClick={handleResendOTP}
                disabled={!canResendOTP}
                className={`text-sm font-medium transition-colors ${
                  canResendOTP
                    ? "text-valasys-orange hover:text-valasys-orange-light"
                    : "text-valasys-gray-400 cursor-not-allowed"
                }`}
              >
                {canResendOTP ? (
                  <div className="flex items-center justify-center space-x-1">
                    <RefreshCw className="h-3 w-3" />
                    <span>Resend code</span>
                  </div>
                ) : (
                  `Resend code in ${resendCountdown}s`
                )}
              </button>
            </div>

            <button
              onClick={() => setShow2FA(false)}
              className="w-full text-sm text-valasys-gray-600 hover:text-valasys-gray-800 transition-colors"
            >
              ← Back to login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-valasys-gray-50 via-white to-valasys-orange/5 lg:grid lg:grid-cols-2 relative overflow-hidden">
      {/* Background AI/Neural Network Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient mesh background with subtle brand colors */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(255,106,0,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(26,115,232,0.12),transparent_50%),radial-gradient(ellipse_at_top_right,rgba(0,196,140,0.12),transparent_40%)]"></div>
        {/* Glowing orbs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-valasys-orange/25 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-valasys-blue/25 blur-3xl"></div>

        {aiElements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.size} ${element.color} rounded-full animate-pulse`}
            style={{
              top: element.top,
              left: element.left,
              right: element.right,
              animationDelay: element.delay,
            }}
          />
        ))}

        {/* Neural Network Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="neural-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#1A73E8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00C48C" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M50,200 Q200,100 350,200 T650,200"
            stroke="url(#neural-gradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M100,300 Q300,200 500,300 T800,300"
            stroke="url(#neural-gradient)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <path
            d="M0,400 Q200,300 400,400 T700,400"
            stroke="url(#neural-gradient)"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </svg>
      </div>

      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center p-8 relative z-10">
        <div
          className={`w-full max-w-md space-y-6 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <div className="flex justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F426248ed656b441dac67bed7c1e875db%2F18bb5a938b5c412bb089e8da7936d067?format=webp&width=800"
              alt="Valasys AI Score logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>
          {/* Login Card */}
          <Card className="border-valasys-gray-200 shadow-xl hover:shadow-2xl transition-all duration-400 backdrop-blur-sm bg-white/95">
            <CardHeader className="space-y-1 pb-4 text-center">
              <CardTitle className="text-lg font-semibold text-valasys-gray-900">
                Sign in
              </CardTitle>
              <p className="text-sm text-valasys-gray-600">
                to your Valasys AI Score account
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-valasys-gray-700 flex items-center space-x-1"
                  >
                    <Mail className="h-3 w-3" />
                    <span>Email Address</span>
                  </Label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 ${focusedField === "email" ? "text-valasys-orange" : "text-valasys-gray-400"}`}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-valasys-gray-700 flex items-center space-x-1"
                  >
                    <Lock className="h-3 w-3" />
                    <span>Password</span>
                  </Label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 ${focusedField === "password" ? "text-valasys-orange" : "text-valasys-gray-400"}`}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 pr-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-valasys-gray-400 hover:text-valasys-orange transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(v) => setRememberMe(Boolean(v))}
                      className="border-valasys-gray-300 hover:border-valasys-orange transition-colors duration-200"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-valasys-gray-600 cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-valasys-orange hover:text-valasys-orange-light font-medium transition-colors duration-200 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Google reCAPTCHA Placeholder */}
                <div className="bg-valasys-gray-50 border border-valasys-gray-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 text-valasys-gray-600">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">reCAPTCHA verification</span>
                  </div>
                  <p className="text-xs text-valasys-gray-500 mt-1">
                    Protected by Google reCAPTCHA
                  </p>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-valasys-orange hover:bg-valasys-orange-light text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Account signup text - moved inside card */}
              <div className="text-center pt-4">
                <p
                  className="text-valasys-gray-600"
                  style={{ fontSize: "16px" }}
                >
                  Don't have an account?{" "}
                  <Link
                    to="/free-trial"
                    className="font-medium text-valasys-orange hover:text-valasys-orange-light transition-colors"
                  >
                    Start My Free Trial
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Powered by 50+ Integrations (below form) */}
          <div className="pt-4">
            <IntegrationsFooter />
          </div>
        </div>
      </div>

      {/* Right Side - Video & Integrations */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-valasys-orange/5 via-white to-valasys-blue/5 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-valasys-orange/10 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-valasys-blue/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col w-full h-full px-16 py-12">
          {/* Header Section */}
          <div
            className={`mb-8 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"}`}
          >
            <p className="text-sm font-semibold text-valasys-orange tracking-widest uppercase mb-2">
              Welcome Back
            </p>
            <h2 className="text-3xl font-bold text-valasys-gray-900 leading-tight">
              Your AI Scoring <br />
              <span className="text-valasys-orange">Revolution Starts Here</span>
            </h2>
          </div>

          {/* Main Content Container */}
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {/* Premium Video Showcase */}
            <div
              className={`transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                {/* Video with overlay */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  poster="/placeholder.svg"
                >
                  <source
                    src="https://cdn.builder.io/o/assets%2F30afb9e14ebd49aea9f5ae01cdf07930%2F8104f428ea2041e4b1e7817c489b1720?alt=media&token=183f0972-b931-4c24-bb07-a6086bd27c3a&apiKey=30afb9e14ebd49aea9f5ae01cdf07930"
                    type="video/mp4"
                  />
                </video>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Play Icon Badge */}
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="p-4 rounded-full bg-valasys-orange/90 backdrop-blur-sm group-hover:bg-valasys-orange transition-colors duration-300">
                    <Play className="h-6 w-6 text-white" fill="currentColor" />
                  </div>
                </div>

                {/* Stats Badges Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
                    <p className="font-semibold text-valasys-gray-900">AI-Powered</p>
                  </div>
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
                    <p className="font-semibold text-valasys-gray-900">Real-time</p>
                  </div>
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
                    <p className="font-semibold text-valasys-gray-900">Smart</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-valasys-gray-600 mt-4 text-center">
                See how VAIS transforms your sales intelligence
              </p>
            </div>

            {/* Customer Testimonials Section */}
            <div
              className={`transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
              style={{ transitionDelay: "150ms" }}
            >
              {/* Section Title */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-valasys-gray-900">
                  What Our Customers Say
                </h3>
                <p className="text-xs text-valasys-gray-600 mt-1">
                  Trusted by leading sales teams
                </p>
              </div>
            </div>

            {/* Customer Testimonials Carousel */}
            <div
              className={`transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
              style={{ transitionDelay: "200ms" }}
            >
              {/* Carousel Container */}
              <div className="relative">
                {/* Testimonial Cards Grid (2 visible) */}
                <div className="grid grid-cols-2 gap-6">
                  {[currentTestimonialIndex, (currentTestimonialIndex + 1) % testimonials.length].map((index) => {
                    const testimonial = testimonials[index];
                    return (
                      <div
                        key={testimonial.id}
                        className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-7 border border-white/50 hover:border-valasys-orange/40 hover:from-white/90 hover:to-white/75 transition-all duration-300 shadow-lg hover:shadow-xl group"
                      >
                        {/* Header: Avatar and Name */}
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md`}>
                              {testimonial.initials}
                            </div>
                            <div className="flex-1 pt-1">
                              <h4 className="font-bold text-sm text-valasys-gray-900 leading-tight">
                                {testimonial.name}
                              </h4>
                              <p className="text-xs text-valasys-gray-600 mt-0.5">
                                {testimonial.title}
                              </p>
                            </div>
                          </div>
                          {/* G2 Badge Icon */}
                          <div className="w-10 h-10 rounded-full bg-valasys-orange/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-valasys-orange text-xs font-bold">G2</span>
                          </div>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex gap-0.5 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-valasys-orange text-lg leading-none">★</span>
                          ))}
                          <span className="text-xs text-valasys-gray-600 ml-2 font-medium">5.0 out of 5</span>
                        </div>

                        {/* Review Title/Quote */}
                        <h5 className="font-bold text-sm text-valasys-gray-900 mb-3 leading-snug">
                          "{testimonial.quote}"
                        </h5>

                        {/* Review Text */}
                        <p className="text-xs text-valasys-gray-700 leading-relaxed mb-0">
                          {testimonial.review}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevTestimonial}
                  className="absolute -left-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/30 hover:bg-white/90 hover:border-valasys-orange/30 transition-all duration-300 group"
                >
                  <svg className="w-4 h-4 text-valasys-gray-600 group-hover:text-valasys-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextTestimonial}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/30 hover:bg-white/90 hover:border-valasys-orange/30 transition-all duration-300 group"
                >
                  <svg className="w-4 h-4 text-valasys-gray-600 group-hover:text-valasys-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                  {[...Array(testimonials.length - 1)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonialIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentTestimonialIndex
                          ? "w-8 bg-valasys-orange"
                          : "w-2 bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Partnerships & Trust */}
          <div
            className={`space-y-4 mt-8 pt-6 border-t border-white/20 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            style={{ transitionDelay: "300ms" }}
          >
            {/* Partners Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-valasys-orange" />
                <p className="text-xs font-semibold text-valasys-gray-900 uppercase tracking-wide">
                  Trusted By Industry Leaders
                </p>
              </div>
              <AssociationPartners />
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-valasys-green flex-shrink-0" />
                <span className="text-xs text-valasys-gray-700 font-medium">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-valasys-blue flex-shrink-0" />
                <span className="text-xs text-valasys-gray-700 font-medium">GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
