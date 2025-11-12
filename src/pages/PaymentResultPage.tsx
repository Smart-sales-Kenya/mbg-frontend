// src/pages/PaymentResultPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Home, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

const PaymentResultPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const status = searchParams.get('status');
  const message = searchParams.get('message');
  const orderTrackingId = searchParams.get('order_tracking_id');

  useEffect(() => {
    console.log('Payment result parameters:', {
      status,
      message,
      orderTrackingId
    });

    // Show appropriate toast message
    if (status === 'completed') {
      toast.success('Payment completed successfully!');
    } else if (status === 'failed') {
      toast.error('Payment failed. Please try again.');
    } else if (status === 'pending') {
      toast.info('Payment is still processing...');
    } else if (status === 'error') {
      toast.error(message || 'An error occurred during payment processing.');
    }

    setLoading(false);

    // Auto-redirect to home for successful payments
    if (status === 'completed') {
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000); // Redirect after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [status, message, navigate]);

  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          description: 'Thank you for your payment. Your registration is now confirmed.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          buttonText: 'Go to Homepage',
          autoRedirect: true
        };
      case 'failed':
        return {
          icon: XCircle,
          title: 'Payment Failed',
          description: message || 'Your payment could not be processed. Please try again.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          buttonText: 'Try Again',
          autoRedirect: false
        };
      case 'pending':
        return {
          icon: Clock,
          title: 'Payment Processing',
          description: message || 'Your payment is being processed. This may take a few moments.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          buttonText: 'Check Status',
          autoRedirect: false
        };
      default:
        return {
          icon: XCircle,
          title: 'Payment Error',
          description: message || 'An unexpected error occurred during payment processing.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          buttonText: 'Go to Homepage',
          autoRedirect: false
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const handleAction = () => {
    if (status === 'completed' || status === 'error') {
      navigate('/');
    } else if (status === 'failed' || status === 'pending') {
      navigate('/events');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p>Loading payment status...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className={`w-20 h-20 ${statusConfig.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <StatusIcon className={`w-10 h-10 ${statusConfig.color}`} />
          </div>
          
          <h1 className="text-3xl font-bold">{statusConfig.title}</h1>
          
          <p className="text-muted-foreground text-lg">
            {statusConfig.description}
          </p>

          {orderTrackingId && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-mono">Reference: {orderTrackingId}</p>
            </div>
          )}

          {statusConfig.autoRedirect && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                You will be automatically redirected to the homepage in 5 seconds...
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-center pt-4">
            <Button
              onClick={handleAction}
              className="flex items-center gap-2"
              variant={status === 'completed' ? 'default' : 'outline'}
            >
              <Home className="h-4 w-4" />
              {statusConfig.buttonText}
            </Button>
            
            <Button
              onClick={() => navigate('/events')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Browse Events
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentResultPage;