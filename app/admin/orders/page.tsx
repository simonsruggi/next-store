import Link from 'next/link';
import {
  Box,
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
  IconButton,
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils';

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  refunded: 'error',
};

const paymentStatusColors: Record<string, 'default' | 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  paid: 'success',
  failed: 'error',
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

const paymentStatusLabels: Record<string, string> = {
  pending: 'In attesa',
  paid: 'Pagato',
  failed: 'Fallito',
  refunded: 'Rimborsato',
};

async function getOrders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      profile:profiles(full_name, email),
      items:order_items(count)
    `)
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Ordini
      </Typography>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ordine</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell>Pagamento</TableCell>
                  <TableCell>Metodo</TableCell>
                  <TableCell align="right">Totale</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      Nessun ordine
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Typography variant="body2" fontWeight={600}>
                            #{order.order_number}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        {order.profile?.full_name || order.profile?.email || 'Guest'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabels[order.status] || order.status}
                          size="small"
                          color={statusColors[order.status] || 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={paymentStatusLabels[order.payment_status] || order.payment_status}
                          size="small"
                          variant="outlined"
                          color={paymentStatusColors[order.payment_status] || 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                          {order.payment_method}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={Link}
                          href={`/admin/orders/${order.id}`}
                          size="small"
                        >
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
