'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Next Store
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Il tuo e-commerce di fiducia. Prodotti di qualità, spedizioni
              veloci e assistenza dedicata.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Negozio
            </Typography>
            <Box component="nav">
              <Link href="/products" style={{ display: 'block', marginBottom: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  Tutti i prodotti
                </Typography>
              </Link>
              <Link href="/products?featured=true" style={{ display: 'block', marginBottom: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  In evidenza
                </Typography>
              </Link>
              <Link href="/products?sale=true" style={{ display: 'block', marginBottom: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  Offerte
                </Typography>
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Assistenza
            </Typography>
            <Box component="nav">
              <Link href="/contact" style={{ display: 'block', marginBottom: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  Contattaci
                </Typography>
              </Link>
              <Link href="/faq" style={{ display: 'block', marginBottom: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  FAQ
                </Typography>
              </Link>
              <Link href="/shipping" style={{ display: 'block', marginBottom: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  Spedizioni
                </Typography>
              </Link>
              <Link href="/returns" style={{ display: 'block', marginBottom: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  Resi e rimborsi
                </Typography>
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informazioni
            </Typography>
            <Box component="nav">
              <Link href="/about" style={{ display: 'block', marginBottom: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  Chi siamo
                </Typography>
              </Link>
              <Link href="/privacy" style={{ display: 'block', marginBottom: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  Privacy Policy
                </Typography>
              </Link>
              <Link href="/terms" style={{ display: 'block', marginBottom: 8 }}>
                <Typography variant="body2" color="text.secondary">
                  Termini e condizioni
                </Typography>
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Next Store. Tutti i diritti riservati.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pagamenti sicuri con Stripe e PayPal
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
