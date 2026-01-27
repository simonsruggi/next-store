'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types';

interface Props {
  product: Product;
  variants: ProductVariant[];
}

export default function ProductVariantSelectorMinimal({ product, variants }: Props) {
  const activeVariants = variants.filter((v) => v.is_active);
  const hasVariants = activeVariants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants ? activeVariants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const currentStock = selectedVariant?.stock_quantity ?? product.stock_quantity;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariant || undefined, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Variant Selector */}
      {hasVariants && (
        <div>
          <label className="block text-sm text-gray-600 mb-2">Variant</label>
          <div className="flex flex-wrap gap-2">
            {activeVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                disabled={variant.stock_quantity === 0}
                className={`
                  px-3 py-2 text-sm rounded-lg border transition-all
                  ${selectedVariant?.id === variant.id
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-400'
                  }
                  ${variant.stock_quantity === 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}
                `}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`
            flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all
            ${added
              ? 'bg-green-500 text-white'
              : isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
            }
          `}
        >
          {added ? 'Added!' : isOutOfStock ? 'Sold out' : 'Add to cart'}
        </button>
      </div>

      {/* Low stock warning */}
      {currentStock > 0 && currentStock <= 5 && (
        <p className="text-sm text-amber-600">
          Only {currentStock} left
        </p>
      )}
    </div>
  );
}
