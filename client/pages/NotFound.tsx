import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-valasys-orange mb-4" />
            <h1 className="text-6xl font-bold text-valasys-gray-900 mb-2">
              404
            </h1>
            <p className="text-xl text-valasys-gray-600 mb-2">Page not found</p>
            <p className="text-valasys-gray-500 mb-6">
              The page you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
