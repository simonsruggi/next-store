import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Breadcrumbs,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/storefront/AddToCartButton';
import ProductFilters from '@/components/storefront/ProductFilters';
import type { Product, Category } from '@/types';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

async function getProducts(searchParams: {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      category:categories(*)
    `)
    .eq('is_active', true);

  // Filter by category
  if (searchParams.category) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', searchParams.category)
      .single();

    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  // Filter by search
  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`);
  }

  // Filter by price range
  if (searchParams.minPrice) {
    query = query.gte('price', parseFloat(searchParams.minPrice));
  }
  if (searchParams.maxPrice) {
    query = query.lte('price', parseFloat(searchParams.maxPrice));
  }

  // Sort
  switch (searchParams.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data } = await query;
  return data || [];
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return data || [];
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const currentCategory = categories.find((c) => c.slug === params.category);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/">
          <Typography color="text.secondary">Home</Typography>
        </Link>
        <Typography color="text.primary">
          {currentCategory ? currentCategory.name : 'Tutti i prodotti'}
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        {currentCategory ? currentCategory.name : 'Tutti i Prodotti'}
      </Typography>

      {currentCategory?.description && (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {currentCategory.description}
        </Typography>
      )}

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <ProductFilters
            categories={categories}
            currentCategory={params.category}
            currentSort={params.sort}
            currentSearch={params.search}
            currentMinPrice={params.minPrice}
            currentMaxPrice={params.maxPrice}
          />
        </Grid>

        {/* Products Grid */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography color="text.secondary">
              {products.length} prodott{products.length === 1 ? 'o' : 'i'} trovati
            </Typography>
          </Box>

          {products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Nessun prodotto trovato
              </Typography>
              <Typography color="text.secondary">
                Prova a modificare i filtri di ricerca
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 4 }}>
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
                      {product.category && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textTransform: 'uppercase' }}
                        >
                          {product.category.name}
                        </Typography>
                      )}
                      <Typography
                        variant="h6"
                        component={Link}
                        href={`/product/${product.slug}`}
                        sx={{
                          textDecoration: 'none',
                          color: 'inherit',
                          display: 'block',
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
                      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                        {product.type === 'digital' && (
                          <Chip label="Digitale" size="small" color="info" />
                        )}
                        {product.stock_quantity === 0 && (
                          <Chip label="Esaurito" size="small" color="error" />
                        )}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <AddToCartButton product={product} />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
