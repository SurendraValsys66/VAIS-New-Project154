import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Brain,
  Globe,
  Sparkles,
  CheckCircle,
  Shield,
  Play,
  Activity,
  TrendingUp,
  Megaphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "@/lib/utils";
import IntegrationsFooter from "@/components/auth/IntegrationsFooter";
import AssociationPartners from "@/components/auth/AssociationPartners";

export default function FreeTrial() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    // Success flow could redirect or show toast; keep demo simple
  };

  // Reuse subtle floating dots configuration from Login page
  const aiElements = [
    {
      top: "12%",
      left: "10%",
      delay: "0s",
      size: "w-3 h-3",
      color: "bg-valasys-orange/30",
    },
    {
      top: "28%",
      right: "18%",
      delay: "1s",
      size: "w-2 h-2",
      color: "bg-valasys-blue/40",
    },
    {
      top: "42%",
      left: "6%",
      delay: "2s",
      size: "w-4 h-4",
      color: "bg-valasys-green/25",
    },
  ];

  // Right-side integrations data (limited to Salesforce & HubSpot)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-valasys-gray-50 via-white to-valasys-orange/5 lg:grid lg:grid-cols-2 relative overflow-hidden">
      {/* Background visuals (left) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(255,106,0,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(26,115,232,0.12),transparent_50%),radial-gradient(ellipse_at_top_right,rgba(0,196,140,0.12),transparent_40%)]"></div>
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-valasys-orange/25 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-valasys-blue/25 blur-3xl"></div>
        {aiElements.map((e, i) => (
          <div
            key={i}
            className={`absolute ${e.size} ${e.color} rounded-full animate-pulse`}
            style={{
              top: e.top,
              left: e.left as any,
              right: (e as any).right,
              animationDelay: e.delay,
            }}
          />
        ))}
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

      {/* Left: Trial form */}
      <div
        className={`flex items-center justify-center p-8 relative z-10 transform transition-all duration-700 ${mounted ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"}`}
      >
        <div className="w-full max-w-md space-y-6">
          <Card className="border-valasys-gray-200 shadow-xl hover:shadow-2xl transition-all duration-400 backdrop-blur-sm bg-white/95">
            <CardHeader className="space-y-1 pb-4 text-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F76d83d63beb8455692b1855a78aa9524%2F5ee47be8ea214f9c9b220b553ddb9ad1?format=webp&width=800"
                alt="Valasys AI Score logo"
                className="mx-auto h-12 w-auto object-contain mb-4"
              />
              <CardTitle className="text-lg font-semibold text-valasys-gray-900">
                Start your free trial
              </CardTitle>
              <p className="text-sm text-valasys-gray-600">
                Enter your email to get started
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      try {
                        if (email) localStorage.setItem("signupEmail", email);
                      } catch (e) {}
                      navigate("/create-account", { state: { email } });
                    }}
                    disabled={isLoading}
                    className="bg-valasys-orange hover:bg-valasys-orange-light text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" /> Sign In{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Powered by 50+ Integrations (below form) */}
          <div className="pt-4">
            <IntegrationsFooter />
          </div>
        </div>
      </div>

      {/* Right: same content as Login with opposite slide-in */}
      <div
        className={`hidden lg:flex relative bg-gradient-to-br from-valasys-orange/10 via-valasys-blue/10 to-valasys-green/10 backdrop-blur-sm transform transition-all duration-700 ${mounted ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-valasys-orange/15 via-valasys-orange-light/10 to-valasys-blue/15"></div>
        <div className="relative z-10 flex flex-col justify-center space-y-8 p-8 w-full">
          {/* Highlights */}
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

          {/* Video */}
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
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Integrations + Association */}
          <div
            className={`transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="md:block">
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
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                            (
                              e.currentTarget.parentElement as HTMLElement
                            ).innerHTML =
                              `<div class='w-full h-full ${integration.color} rounded flex items-center justify-center text-white text-xs font-bold'>${integration.name[0]}</div>`;
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
              <div className="hidden" aria-hidden="true" />
              <div className="hidden" aria-hidden="true" />
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

          {/* Trust badges */}
          <div
            className={`flex items-center justify-center space-x-6 pt-6 border-t border-white/20 transform transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            style={{ transitionDelay: "1000ms" }}
          >
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-valasys-green" />
              </div>
              <span className="text-sm font-medium text-valasys-gray-800">
                SOC 2 Compliant
              </span>
            </div>
            <div className="flex items-center space-x-2">
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
