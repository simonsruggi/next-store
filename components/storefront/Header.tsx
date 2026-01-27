'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useCartStore } from '@/lib/store/cart';
import type { Profile } from '@/types';

function isDemoMode(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\\n/g, '').replace(/\n/g, '');
  return !url ||
         url === 'https://placeholder.supabase.co' ||
         url.includes('placeholder');
}

export default function Header() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);

    // Skip auth in demo mode
    if (isDemoMode()) {
      return;
    }

    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(async ({ data: { user: authUser } }: { data: { user: { id: string } | null } }) => {
        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
          setUser(profile);
        }
      });
    });
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    if (!isDemoMode()) {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    handleMenuClose();
    router.refresh();
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Prodotti', href: '/products' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Next Store
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                mr: 4,
              }}
            >
              Next Store
            </Typography>

            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    color="inherit"
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton color="inherit" aria-label="search">
                <SearchIcon />
              </IconButton>

              <IconButton
                component={Link}
                href="/cart"
                color="inherit"
                aria-label="cart"
              >
                <Badge badgeContent={mounted ? itemCount : 0} color="primary">
                  <CartIcon />
                </Badge>
              </IconButton>

              {user ? (
                <>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    aria-label="account"
                  >
                    <PersonIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem
                      component={Link}
                      href="/account"
                      onClick={handleMenuClose}
                    >
                      Il mio account
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/account/orders"
                      onClick={handleMenuClose}
                    >
                      I miei ordini
                    </MenuItem>
                    {user.role === 'admin' && (
                      <MenuItem
                        component={Link}
                        href="/dashboard"
                        onClick={handleMenuClose}
                      >
                        Dashboard Admin
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout}>Esci</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="small"
                >
                  Accedi
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
