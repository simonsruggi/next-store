'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { createClient } from '@/lib/supabase/client';
import { useCartStore } from '@/lib/store/cart';

export default function PayPalCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      setError('Ordine non trovato');
    } else {
      setOrder(data);
    }
    setLoading(false);
  };

  const createPayPalOrder = async () => {
    const response = await fetch('/api/checkout/paypal/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.paypalOrderId;
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch('/api/checkout/paypal/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paypalOrderId: data.orderID,
        }),
      });

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      clearCart();
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (err: any) {
      setError(err.message || 'Errore durante il pagamento');
    }
  };

  if (!orderId) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error">ID ordine mancante</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Caricamento...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Paga con PayPal
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ mb: 4 }}>
            Completa il pagamento in modo sicuro con PayPal
          </Typography>

          {order && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                €{order.total.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ordine #{order.order_number}
              </Typography>
            </Box>
          )}

          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
              currency: 'EUR',
            }}
          >
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={createPayPalOrder}
              onApprove={onApprove}
              onError={(err) => setError('Errore durante il pagamento PayPal')}
            />
          </PayPalScriptProvider>
        </CardContent>
      </Card>
    </Container>
  );
}
