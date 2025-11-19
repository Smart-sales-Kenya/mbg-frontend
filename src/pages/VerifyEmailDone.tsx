import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";

const VerifyEmailDone = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent you a verification link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Mail className="h-12 w-12 text-blue-500" />
          <p className="text-center text-muted-foreground">
            Please check your email inbox and click on the verification link to activate your account.
          </p>
          <div className="text-sm text-muted-foreground text-center space-y-2">
            <p>Didn't receive the email?</p>
            <ul className="text-left space-y-1">
              <li>• Check your spam folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Wait a few minutes and try again</li>
            </ul>
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/register">Back to Register</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/register">Go to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailDone;