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
  const navigate = useNavigate();

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
      <div className="hidden lg:flex relative bg-gradient-to-br from-valasys-orange/10 via-valasys-blue/10 to-valasys-green/10 backdrop-blur-sm">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-valasys-orange/15 via-valasys-orange-light/10 to-valasys-blue/15"></div>

        <div className="relative z-10 flex flex-col justify-center space-y-8 p-8 w-full">
          {/* VAIS Highlights */}
          <div
            className={`space-y-4 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-2xl font-bold text-valasys-gray-900">
              Welcome back to <span className="text-valasys-orange">VAIS</span>
            </h2>
            <p className="text-valasys-gray-600">
              Access your AI-powered scoring platform to unlock deeper insights,
              accelerate decision-making, and drive meaningful business
              outcomes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    AI-Powered Insights
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Advanced algorithms that deliver actionable intelligence
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Scoring System
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    AI-driven lead and account ranking.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Campaign Management
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Campaign tracking with reports and insights.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Real-time Analytics
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Live data processing and instant reporting
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div
            className={`space-y-4 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-valasys-gray-900 flex items-center justify-center space-x-2">
                <Play className="h-6 w-6 text-valasys-orange" />
                <span>See VAIS in Action</span>
              </h2>
              <p className="text-valasys-gray-600">
                Watch how AI transforms your sales process
              </p>
            </div>

            {/* Video Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/10 backdrop-blur-sm border border-white/20">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-64 object-cover"
                poster="/placeholder.svg"
              >
                <source
                  src="https://cdn.builder.io/o/assets%2F30afb9e14ebd49aea9f5ae01cdf07930%2F8104f428ea2041e4b1e7817c489b1720?alt=media&token=183f0972-b931-4c24-bb07-a6086bd27c3a&apiKey=30afb9e14ebd49aea9f5ae01cdf07930"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Integrations + Association Section (side-by-side) */}
          <div
            className={`transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="md:block">
              {/* Left: Integrations (removed) */}
              <div className="space-y-4 hidden">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-valasys-gray-900 flex items-center justify-center space-x-2">
                    <Globe
                      className="h-5 w-5 text-valasys-blue animate-spin"
                      style={{ animationDuration: "6s" }}
                    />
                    <span>Powered by 50+ Integrations</span>
                  </h3>
                  <p className="text-valasys-gray-600 text-sm">
                    Connect seamlessly with your existing tech stack
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {integrations.map((integration, index) => (
                    <div
                      key={index}
                      className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/90 transition-all duration-300 group cursor-pointer hover:scale-105 transform shadow-lg border border-white/30 ${mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                      style={{ transitionDelay: `${400 + index * 100}ms` }}
                    >
                      <div className="h-10 w-10 mx-auto mb-3 bg-white rounded-lg p-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-200 shadow-md">
                        <img
                          src={integration.logo}
                          alt={integration.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement!.innerHTML = `<div class=\"w-full h-full ${integration.color} rounded flex items-center justify-center text-white text-xs font-bold\">${integration.name[0]}</div>`;
                          }}
                        />
                      </div>
                      <h4 className="font-semibold text-valasys-gray-900 text-sm group-hover:text-valasys-orange transition-colors duration-200">
                        {integration.name}
                      </h4>
                      <p className="text-xs text-valasys-gray-600 group-hover:text-valasys-gray-800 transition-colors duration-200">
                        {integration.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden" aria-hidden="true" />
              <div className="hidden" aria-hidden="true" />

              {/* Right: In Association With */}
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-valasys-gray-900 flex items-center justify-center space-x-2">
                    <Sparkles className="h-5 w-5 text-valasys-orange" />
                    <span>In Association With</span>
                  </h3>
                  <p className="text-valasys-gray-600 text-sm">
                    Trusted data and reviews partners
                  </p>
                </div>
                <AssociationPartners />
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div
            className={`flex items-center justify-center space-x-6 pt-6 border-t border-white/20 transform transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            style={{ transitionDelay: "1000ms" }}
          >
            <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-valasys-green" />
              </div>
              <span className="text-sm font-medium text-valasys-gray-800">
                SOC 2 Compliant
              </span>
            </div>
            <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Shield className="h-4 w-4 text-valasys-blue" />
              </div>
              <span className="text-sm font-medium text-valasys-gray-800">
                GDPR Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
