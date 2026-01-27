import Link from 'next/link';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import {
  TrendingUp as RevenueIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  People as CustomersIcon,
} from '@mui/icons-material';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order, PaymentStatus } from '@/types';

async function getStats() {
  const supabase = await createClient();

  const [orders, products, customers] = await Promise.all([
    supabase.from('orders').select('id, total, payment_status'),
    supabase.from('products').select('id', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
  ]);

  const paidOrders = orders.data?.filter((o: { payment_status: PaymentStatus; total: number }) => o.payment_status === 'paid') || [];
  const totalRevenue = paidOrders.reduce((sum: number, o: { total: number }) => sum + o.total, 0);

  return {
    totalRevenue,
    totalOrders: orders.data?.length || 0,
    totalProducts: products.count || 0,
    totalCustomers: customers.count || 0,
  };
}

async function getRecentOrders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return data || [];
}

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  refunded: 'error',
};

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([
    getStats(),
    getRecentOrders(),
  ]);

  const statCards = [
    {
      title: 'Fatturato',
      value: formatPrice(stats.totalRevenue),
      icon: <RevenueIcon sx={{ fontSize: 40 }} />,
      color: 'success.main',
    },
    {
      title: 'Ordini',
      value: stats.totalOrders.toString(),
      icon: <OrdersIcon sx={{ fontSize: 40 }} />,
      color: 'primary.main',
    },
    {
      title: 'Prodotti',
      value: stats.totalProducts.toString(),
      icon: <ProductsIcon sx={{ fontSize: 40 }} />,
      color: 'warning.main',
    },
    {
      title: 'Clienti',
      value: stats.totalCustomers.toString(),
      icon: <CustomersIcon sx={{ fontSize: 40 }} />,
      color: 'info.main',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Ordini Recenti</Typography>
            <Link href="/admin/orders">
              <Button size="small">
                Vedi tutti
              </Button>
            </Link>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ordine</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell>Pagamento</TableCell>
                  <TableCell align="right">Totale</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Nessun ordine
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order: Order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Link href={`/admin/orders/${order.id}`}>
                          #{order.order_number}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          color={statusColors[order.status] || 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.payment_status}
                          size="small"
                          variant="outlined"
                          color={order.payment_status === 'paid' ? 'success' : 'warning'}
                        />
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
    </Box>
  );
}
