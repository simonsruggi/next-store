'use client';

import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from '@mui/icons-material';
import type { ProductImage } from '@/types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const sortedImages = [...images].sort((a, b) => a.position - b.position);
  const currentImage = sortedImages[selectedIndex];

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  if (sortedImages.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          paddingTop: '100%',
          position: 'relative',
          bgcolor: 'grey.100',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '4rem',
          }}
        >
          📦
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Main Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          bgcolor: 'grey.100',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={currentImage?.url}
          alt={currentImage?.alt_text || productName}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />

        {sortedImages.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <PrevIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <NextIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mt: 2,
            overflowX: 'auto',
            pb: 1,
          }}
        >
          {sortedImages.map((image, index) => (
            <Box
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              sx={{
                width: 80,
                height: 80,
                flexShrink: 0,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                border: 2,
                borderColor:
                  index === selectedIndex ? 'primary.main' : 'transparent',
                opacity: index === selectedIndex ? 1 : 0.7,
                transition: 'all 0.2s',
                '&:hover': {
                  opacity: 1,
                },
              }}
            >
              <Box
                component="img"
                src={image.url}
                alt={image.alt_text || `${productName} - ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
