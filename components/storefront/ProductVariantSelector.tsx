'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types';

interface ProductVariantSelectorProps {
  product: Product;
  variants: ProductVariant[];
}

export default function ProductVariantSelector({
  product,
  variants,
}: ProductVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const activeVariants = variants.filter((v) => v.is_active);
  const hasVariants = activeVariants.length > 0;

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentStock = selectedVariant?.stock_quantity ?? product.stock_quantity;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    addItem(product, selectedVariant || undefined, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Box>
      {/* Variant Selector */}
      {hasVariants && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Variante</InputLabel>
          <Select
            value={selectedVariant?.id || ''}
            label="Variante"
            onChange={(e) => {
              const variant = activeVariants.find((v) => v.id === e.target.value);
              setSelectedVariant(variant || null);
            }}
          >
            {activeVariants.map((variant) => (
              <MenuItem
                key={variant.id}
                value={variant.id}
                disabled={variant.stock_quantity === 0}
              >
                {variant.name}
                {variant.price && variant.price !== product.price && (
                  <> - {formatPrice(variant.price)}</>
                )}
                {variant.stock_quantity === 0 && ' (Esaurito)'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Quantity Selector */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          type="number"
          label="Quantità"
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 1 && value <= currentStock) {
              setQuantity(value);
            }
          }}
          inputProps={{ min: 1, max: currentStock }}
          sx={{ width: 120 }}
        />
        <Button
          variant="contained"
          size="large"
          startIcon={<CartIcon />}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          fullWidth
        >
          {isOutOfStock ? 'Esaurito' : 'Aggiungi al carrello'}
        </Button>
      </Box>

      {/* Success Message */}
      {added && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Prodotto aggiunto al carrello!
        </Alert>
      )}

      {/* Stock Warning */}
      {currentStock > 0 && currentStock <= 5 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Solo {currentStock} pezzi disponibili!
        </Alert>
      )}

      {/* Digital Product Notice */}
      {product.type === 'digital' && (
        <Alert severity="info">
          Questo è un prodotto digitale. Riceverai il link per il download dopo
          l'acquisto.
        </Alert>
      )}
    </Box>
  );
}
