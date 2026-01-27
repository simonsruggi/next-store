import Link from 'next/link';
import {
  Box,
  Typography,
  Button,
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
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import type { Product } from '@/types';

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      category:categories(name)
    `)
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Prodotti
        </Typography>
        <Link href="/admin/products/new" style={{ textDecoration: 'none' }}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nuovo Prodotto
          </Button>
        </Link>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Prodotto</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Prezzo</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      Nessun prodotto. Inizia aggiungendone uno!
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={product.images?.[0]?.url}
                            variant="rounded"
                            sx={{ width: 48, height: 48 }}
                          >
                            📦
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {product.name}
                            </Typography>
                            {product.sku && (
                              <Typography variant="caption" color="text.secondary">
                                SKU: {product.sku}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {product.category?.name || '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.type === 'digital' ? 'Digitale' : 'Fisico'}
                          size="small"
                          color={product.type === 'digital' ? 'info' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          color={product.stock_quantity <= 5 ? 'error' : 'inherit'}
                        >
                          {product.stock_quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.is_active ? 'Attivo' : 'Bozza'}
                          size="small"
                          color={product.is_active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Link
                          href={`/admin/products/${product.id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
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
