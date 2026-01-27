import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Breadcrumbs,
  Divider,
} from '@mui/material';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import ProductImageGallery from '@/components/storefront/ProductImageGallery';
import ProductVariantSelector from '@/components/storefront/ProductVariantSelector';
import type { Product } from '@/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*),
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  return data;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Prodotto non trovato' };
  }

  return {
    title: `${product.name} | Next Store`,
    description: product.description || `Acquista ${product.name} su Next Store`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/">
          <Typography color="text.secondary">Home</Typography>
        </Link>
        <Link href="/products">
          <Typography color="text.secondary">Prodotti</Typography>
        </Link>
        {product.category && (
          <Link href={`/products?category=${product.category.slug}`}>
            <Typography color="text.secondary">{product.category.name}</Typography>
          </Link>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ProductImageGallery images={product.images || []} productName={product.name} />
        </Grid>

        {/* Product Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            {product.category && (
              <Typography
                variant="overline"
                color="text.secondary"
                component={Link}
                href={`/products?category=${product.category.slug}`}
              >
                {product.category.name}
              </Typography>
            )}

            <Typography variant="h3" component="h1" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                {formatPrice(product.price)}
              </Typography>
              {product.compare_at_price && (
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {formatPrice(product.compare_at_price)}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {product.type === 'digital' && (
                <Chip label="Prodotto Digitale" color="info" />
              )}
              {isOutOfStock ? (
                <Chip label="Esaurito" color="error" />
              ) : (
                <Chip
                  label={`Disponibile: ${product.stock_quantity}`}
                  color="success"
                  variant="outlined"
                />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Variant Selector and Add to Cart */}
            <ProductVariantSelector
              product={product}
              variants={product.variants || []}
            />

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            {product.description && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Descrizione
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-wrap' }}
                >
                  {product.description}
                </Typography>
              </Box>
            )}

            {/* SKU */}
            {product.sku && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  SKU: {product.sku}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
