'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Carrello
        </Typography>
        <Typography>Caricamento...</Typography>
      </Container>
    );
  }

  const subtotal = getSubtotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Carrello
        </Typography>
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography variant="h1" sx={{ mb: 2 }}>
              🛒
            </Typography>
            <Typography variant="h5" gutterBottom>
              Il tuo carrello è vuoto
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Aggiungi qualche prodotto per iniziare!
            </Typography>
            <Button
              component={Link}
              href="/products"
              variant="contained"
              size="large"
            >
              Scopri i prodotti
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Carrello ({items.length} {items.length === 1 ? 'articolo' : 'articoli'})
        </Typography>
        <Button color="error" onClick={clearCart}>
          Svuota carrello
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid size={{ xs: 12, md: 8 }}>
          {items.map((item) => {
            const price = item.variant?.price ?? item.product.price;
            const maxStock = item.variant?.stock_quantity ?? item.product.stock_quantity;

            return (
              <Card key={item.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Product Image */}
                    <Grid size={{ xs: 3, sm: 2 }}>
                      <Box
                        component={Link}
                        href={`/product/${item.product.slug}`}
                        sx={{
                          display: 'block',
                          width: '100%',
                          paddingTop: '100%',
                          position: 'relative',
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                        }}
                      >
                        {item.product.images && item.product.images[0] ? (
                          <Box
                            component="img"
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            📦
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    {/* Product Info */}
                    <Grid size={{ xs: 9, sm: 4 }}>
                      <Typography
                        variant="h6"
                        component={Link}
                        href={`/product/${item.product.slug}`}
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {item.product.name}
                      </Typography>
                      {item.variant && (
                        <Typography variant="body2" color="text.secondary">
                          {item.variant.name}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {formatPrice(price)} cad.
                      </Typography>
                    </Grid>

                    {/* Quantity */}
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (value >= 1 && value <= maxStock) {
                              updateQuantity(item.id, value);
                            }
                          }}
                          inputProps={{
                            min: 1,
                            max: maxStock,
                            style: { textAlign: 'center', width: 40 },
                          }}
                          sx={{ mx: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= maxStock}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>

                    {/* Total & Remove */}
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="h6" sx={{ mr: 2 }}>
                          {formatPrice(price * item.quantity)}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => removeItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Riepilogo Ordine
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotale</Typography>
                <Typography>{formatPrice(subtotal)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Spedizione</Typography>
                <Typography>
                  {shipping === 0 ? 'Gratuita' : formatPrice(shipping)}
                </Typography>
              </Box>

              {shipping > 0 && subtotal < 50 && (
                <Alert severity="info" sx={{ my: 2 }}>
                  Aggiungi {formatPrice(50 - subtotal)} per la spedizione gratuita!
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Totale</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(total)}
                </Typography>
              </Box>

              <Button
                component={Link}
                href="/checkout"
                variant="contained"
                size="large"
                fullWidth
              >
                Procedi al Checkout
              </Button>

              <Button
                component={Link}
                href="/products"
                variant="text"
                fullWidth
                sx={{ mt: 1 }}
              >
                Continua lo shopping
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
