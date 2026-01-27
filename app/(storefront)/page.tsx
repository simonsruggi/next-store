import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import { formatPrice } from '@/lib/utils';
import { isDemoMode, mockProducts, mockCategories, getMockFeaturedProducts } from '@/lib/mock-data';
import AddToCartButton from '@/components/storefront/AddToCartButton';
import type { Product, Category } from '@/types';

async function getFeaturedProducts(): Promise<Product[]> {
  if (isDemoMode()) {
    return getMockFeaturedProducts();
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  return data || [];
}

async function getCategories(): Promise<Category[]> {
  if (isDemoMode()) {
    return mockCategories;
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return data || [];
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 8, md: 12 },
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                Benvenuto su Next Store
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Scopri i nostri prodotti di qualità. Spedizione gratuita per
                ordini superiori a 50€.
              </Typography>
              <Button
                component={Link}
                href="/products"
                variant="contained"
                color="secondary"
                size="large"
              >
                Scopri i Prodotti
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 400,
                    height: 300,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h1">🛒</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      {categories.length > 0 && (
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            Categorie
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                component={Link}
                href={`/products?category=${category.slug}`}
                clickable
                sx={{ fontSize: '1rem', py: 2.5, px: 1 }}
              />
            ))}
          </Box>
        </Container>
      )}

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2">
            Prodotti in Evidenza
          </Typography>
          <Button component={Link} href="/products" color="primary">
            Vedi tutti
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                <CardMedia
                  component={Link}
                  href={`/product/${product.slug}`}
                  sx={{
                    height: 200,
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {product.images && product.images[0] ? (
                    <Box
                      component="img"
                      src={product.images[0].url}
                      alt={product.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Typography variant="h2" color="text.secondary">
                      📦
                    </Typography>
                  )}
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    component={Link}
                    href={`/product/${product.slug}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    >
                      {formatPrice(product.price)}
                    </Typography>
                    {product.compare_at_price && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {formatPrice(product.compare_at_price)}
                      </Typography>
                    )}
                  </Box>
                  {product.type === 'digital' && (
                    <Chip
                      label="Digitale"
                      size="small"
                      color="info"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <AddToCartButton product={product} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  🚚
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Spedizione Gratuita
                </Typography>
                <Typography color="text.secondary">
                  Per ordini superiori a 50€
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  🔒
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Pagamenti Sicuri
                </Typography>
                <Typography color="text.secondary">
                  Stripe, PayPal e Contrassegno
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  📞
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Assistenza Dedicata
                </Typography>
                <Typography color="text.secondary">
                  Supporto clienti disponibile
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
