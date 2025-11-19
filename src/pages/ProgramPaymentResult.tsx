// src/pages/ProgramPaymentResult.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, ArrowRight, Home } from "lucide-react";
import { toast } from "sonner";

const ProgramPaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get('status');
  const orderTrackingId = searchParams.get('order_tracking_id');
  const paymentId = searchParams.get('payment_id');
  const message = searchParams.get('message');

  useEffect(() => {
    console.log("💰 Program Payment Result:", { 
      status, 
      orderTrackingId, 
      paymentId, 
      message 
    });

    // Clear any pending storage
    sessionStorage.removeItem('pendingProgramPayment');
    sessionStorage.removeItem('pendingProgramRegistration');
    sessionStorage.removeItem('pendingProgramOrderTracking');

    // Show appropriate toast message
    if (status === 'completed') {
      toast.success(message || "Payment completed successfully!");
    } else if (status === 'failed') {
      toast.error(message || "Payment failed. Please try again.");
    } else if (status === 'pending') {
      toast.info(message || "Payment is still processing.");
    }
  }, [status, message]);

  const getStatusDetails = () => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: "Payment Completed!",
          message: "Your program payment was successful. You're all set!",
          bgColor: "bg-green-50",
          buttonText: "View Programs",
          buttonAction: () => navigate('/programs')
        };
      case 'failed':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: "Payment Failed",
          message: "Your payment could not be processed. Please try again.",
          bgColor: "bg-red-50",
          buttonText: "Try Again",
          buttonAction: () => navigate(-1)
        };
      case 'pending':
        return {
          icon: <Clock className="w-16 h-16 text-yellow-500" />,
          title: "Payment Processing",
          message: "Your payment is being processed. This may take a few minutes.",
          bgColor: "bg-yellow-50",
          buttonText: "Check Status",
          buttonAction: () => window.location.reload()
        };
      default:
        return {
          icon: <XCircle className="w-16 h-16 text-gray-500" />,
          title: "Payment Status Unknown",
          message: "Unable to determine payment status.",
          bgColor: "bg-gray-50",
          buttonText: "Go Home",
          buttonAction: () => navigate('/')
        };
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <Card className="max-w-md w-full shadow-elegant">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {statusDetails.icon}
            </div>
            <CardTitle className="text-2xl">{statusDetails.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">{statusDetails.message}</p>
            
            {/* Payment Details */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm text-left">
              <p><strong>Type:</strong> Program Payment</p>
              {orderTrackingId && (
                <p><strong>Order Tracking ID:</strong> {orderTrackingId}</p>
              )}
              {paymentId && (
                <p><strong>Payment ID:</strong> {paymentId}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button 
                onClick={statusDetails.buttonAction}
                className="flex items-center gap-2"
              >
                {statusDetails.buttonText}
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ProgramPaymentResult;