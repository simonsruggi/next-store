import Link from 'next/link';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import { CheckCircle as SuccessIcon } from '@mui/icons-material';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatOrderNumber } from '@/lib/utils';

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Ordine non trovato
            </Typography>
            <Button component={Link} href="/" variant="contained">
              Torna alla Home
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const supabase = await createClient();
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*),
      shipping_address:addresses!orders_shipping_address_id_fkey(*)
    `)
    .eq('id', orderId)
    .single();

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Ordine non trovato
            </Typography>
            <Button component={Link} href="/" variant="contained">
              Torna alla Home
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SuccessIcon
              sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              Grazie per il tuo ordine!
            </Typography>
            <Typography color="text.secondary">
              Il tuo ordine {formatOrderNumber(order.order_number)} è stato ricevuto.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Numero Ordine
            </Typography>
            <Typography variant="h6">
              {formatOrderNumber(order.order_number)}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Stato Ordine
            </Typography>
            <Typography>
              {order.payment_method === 'cod'
                ? 'In attesa di pagamento alla consegna'
                : order.payment_status === 'paid'
                ? 'Pagamento confermato'
                : 'In elaborazione'}
            </Typography>
          </Box>

          {order.shipping_address && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Indirizzo di Spedizione
              </Typography>
              <Typography>
                {order.shipping_address.full_name}
                <br />
                {order.shipping_address.address_line1}
                {order.shipping_address.address_line2 && (
                  <>
                    <br />
                    {order.shipping_address.address_line2}
                  </>
                )}
                <br />
                {order.shipping_address.postal_code} {order.shipping_address.city}
                <br />
                {order.shipping_address.country}
              </Typography>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Riepilogo
            </Typography>
            {order.items.map((item: any) => (
              <Box
                key={item.id}
                sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}
              >
                <Typography>
                  {item.product_name}
                  {item.variant_name && ` - ${item.variant_name}`}
                  {' x '}{item.quantity}
                </Typography>
                <Typography>{formatPrice(item.total_price)}</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography>Subtotale</Typography>
              <Typography>{formatPrice(order.subtotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography>Spedizione</Typography>
              <Typography>
                {order.shipping_cost === 0 ? 'Gratuita' : formatPrice(order.shipping_cost)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography>IVA</Typography>
              <Typography>{formatPrice(order.tax)}</Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant="h6">Totale</Typography>
              <Typography variant="h6" color="primary">
                {formatPrice(order.total)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              component={Link}
              href="/account/orders"
              variant="outlined"
              fullWidth
            >
              I miei ordini
            </Button>
            <Button
              component={Link}
              href="/products"
              variant="contained"
              fullWidth
            >
              Continua lo shopping
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
