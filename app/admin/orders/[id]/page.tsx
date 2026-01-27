import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDateTime } from '@/lib/utils';
import OrderStatusUpdate from '@/components/admin/OrderStatusUpdate';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      profile:profiles(full_name, email, phone),
      items:order_items(*),
      shipping_address:addresses!orders_shipping_address_id_fkey(*),
      billing_address:addresses!orders_billing_address_id_fkey(*)
    `)
    .eq('id', id)
    .single();

  return data;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          component={Link}
          href="/admin/orders"
          startIcon={<BackIcon />}
          variant="text"
        >
          Ordini
        </Button>
        <Typography variant="h4" component="h1">
          Ordine #{order.order_number}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Order Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Articoli</Typography>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Prodotto</TableCell>
                      <TableCell align="right">Prezzo</TableCell>
                      <TableCell align="right">Qtà</TableCell>
                      <TableCell align="right">Totale</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.product_name}
                          {item.variant_name && (
                            <Typography variant="body2" color="text.secondary">
                              {item.variant_name}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {formatPrice(item.unit_price)}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {formatPrice(item.total_price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 200, mb: 1 }}>
                  <Typography>Subtotale</Typography>
                  <Typography>{formatPrice(order.subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 200, mb: 1 }}>
                  <Typography>Spedizione</Typography>
                  <Typography>
                    {order.shipping_cost === 0 ? 'Gratuita' : formatPrice(order.shipping_cost)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 200, mb: 1 }}>
                  <Typography>IVA</Typography>
                  <Typography>{formatPrice(order.tax)}</Typography>
                </Box>
                <Divider sx={{ width: 200, my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 200 }}>
                  <Typography variant="h6">Totale</Typography>
                  <Typography variant="h6" color="primary">
                    {formatPrice(order.total)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Indirizzo di Spedizione
                  </Typography>
                  {order.shipping_address ? (
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
                      {order.shipping_address.state && ` (${order.shipping_address.state})`}
                      <br />
                      {order.shipping_address.country}
                      {order.shipping_address.phone && (
                        <>
                          <br />
                          Tel: {order.shipping_address.phone}
                        </>
                      )}
                    </Typography>
                  ) : (
                    <Typography color="text.secondary">Non disponibile</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Indirizzo di Fatturazione
                  </Typography>
                  {order.billing_address ? (
                    <Typography>
                      {order.billing_address.full_name}
                      <br />
                      {order.billing_address.address_line1}
                      {order.billing_address.address_line2 && (
                        <>
                          <br />
                          {order.billing_address.address_line2}
                        </>
                      )}
                      <br />
                      {order.billing_address.postal_code} {order.billing_address.city}
                      <br />
                      {order.billing_address.country}
                    </Typography>
                  ) : (
                    <Typography color="text.secondary">
                      Stesso dell'indirizzo di spedizione
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Riepilogo
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Data
                </Typography>
                <Typography>{formatDateTime(order.created_at)}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Stato Ordine
                </Typography>
                <Chip
                  label={order.status}
                  color={
                    order.status === 'delivered' ? 'success' :
                    order.status === 'cancelled' ? 'error' : 'info'
                  }
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Stato Pagamento
                </Typography>
                <Chip
                  label={order.payment_status}
                  color={order.payment_status === 'paid' ? 'success' : 'warning'}
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Metodo Pagamento
                </Typography>
                <Typography sx={{ textTransform: 'uppercase' }}>
                  {order.payment_method}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cliente
              </Typography>
              {order.profile ? (
                <>
                  <Typography>{order.profile.full_name || 'Nome non disponibile'}</Typography>
                  <Typography color="text.secondary">{order.profile.email}</Typography>
                  {order.profile.phone && (
                    <Typography color="text.secondary">{order.profile.phone}</Typography>
                  )}
                </>
              ) : (
                <Typography color="text.secondary">Guest checkout</Typography>
              )}
            </CardContent>
          </Card>

          <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
        </Grid>
      </Grid>
    </Box>
  );
}
