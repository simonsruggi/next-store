'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export default function AddToCartMinimal({ product }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock_quantity < 1;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (isOutOfStock) {
    return (
      <span className="text-sm text-gray-400">Sold out</span>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`
        px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${added
          ? 'bg-green-500 text-white scale-95'
          : 'bg-black text-white hover:bg-gray-800 active:scale-95'
        }
      `}
    >
      {added ? 'Added!' : 'Add'}
    </button>
  );
}
