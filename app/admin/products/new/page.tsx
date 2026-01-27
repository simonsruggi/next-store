'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import type { Category } from '@/types';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compareAtPrice: '',
    type: 'physical',
    categoryId: '',
    sku: '',
    stockQuantity: '0',
    isActive: true,
    isFeatured: false,
    digitalFileUrl: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    setCategories(data || []);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from name
      if (field === 'name') {
        updated.slug = slugify(value as string);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error } = await supabase.from('products').insert({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        price: parseFloat(formData.price),
        compare_at_price: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        type: formData.type,
        category_id: formData.categoryId || null,
        sku: formData.sku || null,
        stock_quantity: parseInt(formData.stockQuantity, 10),
        is_active: formData.isActive,
        is_featured: formData.isFeatured,
        digital_file_url: formData.type === 'digital' ? formData.digitalFileUrl : null,
      });

      if (error) throw error;

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Errore durante la creazione del prodotto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Nuovo Prodotto
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informazioni Base
                </Typography>

                <TextField
                  fullWidth
                  label="Nome prodotto"
                  value={formData.name}
                  onChange={handleChange('name')}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Slug (URL)"
                  value={formData.slug}
                  onChange={handleChange('slug')}
                  required
                  helperText="Usato nell'URL del prodotto"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Descrizione"
                  value={formData.description}
                  onChange={handleChange('description')}
                  multiline
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Prezzi
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="Prezzo"
                      type="number"
                      value={formData.price}
                      onChange={handleChange('price')}
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="Prezzo originale (opzionale)"
                      type="number"
                      value={formData.compareAtPrice}
                      onChange={handleChange('compareAtPrice')}
                      inputProps={{ min: 0, step: 0.01 }}
                      helperText="Per mostrare uno sconto"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Inventario
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="SKU"
                      value={formData.sku}
                      onChange={handleChange('sku')}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="Quantità in stock"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleChange('stockQuantity')}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Organizzazione
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={formData.type}
                    label="Tipo"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <MenuItem value="physical">Fisico</MenuItem>
                    <MenuItem value="digital">Digitale</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={formData.categoryId}
                    label="Categoria"
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <MenuItem value="">Nessuna</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {formData.type === 'digital' && (
                  <TextField
                    fullWidth
                    label="URL file digitale"
                    value={formData.digitalFileUrl}
                    onChange={handleChange('digitalFileUrl')}
                    helperText="URL del file da scaricare"
                  />
                )}
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Stato
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleChange('isActive')}
                    />
                  }
                  label="Attivo (visibile nel negozio)"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={handleChange('isFeatured')}
                    />
                  }
                  label="In evidenza"
                />
              </CardContent>
            </Card>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Creazione...' : 'Crea Prodotto'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
