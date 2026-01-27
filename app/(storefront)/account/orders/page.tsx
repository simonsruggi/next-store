import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
} from '@mui/material';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate, formatOrderNumber } from '@/lib/utils';

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  refunded: 'error',
};

const statusLabels: Record<string, string> = {
  pending: 'In attesa',
  processing: 'In elaborazione',
  shipped: 'Spedito',
  delivered: 'Consegnato',
  cancelled: 'Annullato',
  refunded: 'Rimborsato',
};

export default async function AccountOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/account/orders');
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(count)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button component={Link} href="/account" variant="text">
          ← Account
        </Button>
        <Typography variant="h4" component="h1">
          I miei ordini
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ordine</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell align="right">Articoli</TableCell>
                  <TableCell align="right">Totale</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!orders || orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Non hai ancora effettuato ordini
                      </Typography>
                      <Button component={Link} href="/products" variant="contained">
                        Scopri i prodotti
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Link href={`/account/orders/${order.id}`}>
                          <Typography variant="body2" fontWeight={600}>
                            {formatOrderNumber(order.order_number)}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabels[order.status] || order.status}
                          size="small"
                          color={statusColors[order.status] || 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {order.items?.[0]?.count || 0}
                      </TableCell>
                      <TableCell align="right">
                        {formatPrice(order.total)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
}
