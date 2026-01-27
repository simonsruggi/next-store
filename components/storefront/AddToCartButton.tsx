'use client';

import { Button } from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import { useCartStore } from '@/lib/store/cart';
import type { Product, ProductVariant } from '@/types';

interface AddToCartButtonProps {
  product: Product;
  variant?: ProductVariant;
  quantity?: number;
  fullWidth?: boolean;
}

export default function AddToCartButton({
  product,
  variant,
  quantity = 1,
  fullWidth = true,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, variant, quantity);
  };

  const isOutOfStock = variant
    ? variant.stock_quantity < quantity
    : product.stock_quantity < quantity;

  return (
    <Button
      variant="contained"
      startIcon={<CartIcon />}
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      fullWidth={fullWidth}
    >
      {isOutOfStock ? 'Esaurito' : 'Aggiungi al carrello'}
    </Button>
  );
}
