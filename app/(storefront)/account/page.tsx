import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from '@mui/material';
import {
  Person as PersonIcon,
  ShoppingBag as OrdersIcon,
  LocationOn as AddressIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { createClient } from '@/lib/supabase/server';

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/account');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const menuItems = [
    {
      title: 'Profilo',
      description: 'Gestisci le tue informazioni personali',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      href: '/account/profile',
    },
    {
      title: 'Ordini',
      description: 'Visualizza lo storico dei tuoi ordini',
      icon: <OrdersIcon sx={{ fontSize: 40 }} />,
      href: '/account/orders',
    },
    {
      title: 'Indirizzi',
      description: 'Gestisci i tuoi indirizzi di spedizione',
      icon: <AddressIcon sx={{ fontSize: 40 }} />,
      href: '/account/addresses',
    },
    {
      title: 'Impostazioni',
      description: 'Modifica password e preferenze',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      href: '/account/settings',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Il mio account
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Benvenuto, {profile?.full_name || user.email}
      </Typography>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid key={item.href} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardActionArea component={Link} href={item.href}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
