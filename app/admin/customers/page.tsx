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
  Avatar,
} from '@mui/material';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

async function getCustomers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select(`
      *,
      orders:orders(count)
    `)
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Clienti
      </Typography>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefono</TableCell>
                  <TableCell>Ruolo</TableCell>
                  <TableCell align="right">Ordini</TableCell>
                  <TableCell>Registrazione</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      Nessun cliente registrato
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {(customer.full_name || customer.email || 'U')[0].toUpperCase()}
                          </Avatar>
                          <Typography>
                            {customer.full_name || 'Nome non disponibile'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={customer.role === 'admin' ? 'Admin' : 'Cliente'}
                          size="small"
                          color={customer.role === 'admin' ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {customer.orders?.[0]?.count || 0}
                      </TableCell>
                      <TableCell>{formatDate(customer.created_at)}</TableCell>
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
