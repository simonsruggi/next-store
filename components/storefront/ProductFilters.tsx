'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Skeleton,
} from '@mui/material';
import type { Category } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

function ProductFiltersContent({
  categories,
  currentCategory,
  currentSort,
  currentSearch,
  currentMinPrice,
  currentMaxPrice,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filtri
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        label="Cerca prodotti"
        defaultValue={currentSearch || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length >= 2 || value.length === 0) {
            updateFilters('search', value || null);
          }
        }}
        sx={{ mb: 3 }}
      />

      {/* Sort */}
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>Ordina per</InputLabel>
        <Select
          value={currentSort || 'newest'}
          label="Ordina per"
          onChange={(e) => updateFilters('sort', e.target.value)}
        >
          <MenuItem value="newest">Più recenti</MenuItem>
          <MenuItem value="price_asc">Prezzo crescente</MenuItem>
          <MenuItem value="price_desc">Prezzo decrescente</MenuItem>
          <MenuItem value="name">Nome A-Z</MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      {/* Categories */}
      <Typography variant="subtitle2" gutterBottom>
        Categorie
      </Typography>
      <List dense disablePadding>
        <ListItem disablePadding>
          <ListItemButton
            selected={!currentCategory}
            onClick={() => updateFilters('category', null)}
          >
            <ListItemText primary="Tutte le categorie" />
          </ListItemButton>
        </ListItem>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton
              selected={currentCategory === category.slug}
              onClick={() => updateFilters('category', category.slug)}
            >
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Price Range */}
      <Typography variant="subtitle2" gutterBottom>
        Prezzo
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          size="small"
          label="Min"
          type="number"
          defaultValue={currentMinPrice || ''}
          onChange={(e) => updateFilters('minPrice', e.target.value || null)}
          inputProps={{ min: 0 }}
        />
        <TextField
          size="small"
          label="Max"
          type="number"
          defaultValue={currentMaxPrice || ''}
          onChange={(e) => updateFilters('maxPrice', e.target.value || null)}
          inputProps={{ min: 0 }}
        />
      </Box>

      <Button fullWidth variant="outlined" onClick={clearFilters}>
        Rimuovi filtri
      </Button>
    </Paper>
  );
}

function FiltersSkeleton() {
  return (
    <Paper sx={{ p: 2 }}>
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="rectangular" height={40} sx={{ mb: 3, mt: 2 }} />
      <Skeleton variant="rectangular" height={40} sx={{ mb: 3 }} />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="rectangular" height={200} sx={{ mt: 1 }} />
    </Paper>
  );
}

export default function ProductFilters(props: ProductFiltersProps) {
  return (
    <Suspense fallback={<FiltersSkeleton />}>
      <ProductFiltersContent {...props} />
    </Suspense>
  );
}
