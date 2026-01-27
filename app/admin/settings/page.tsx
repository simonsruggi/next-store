'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { createClient } from '@/lib/supabase/client';

interface StoreSettings {
  name: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  freeShippingThreshold: number | null;
}

interface PaymentSettings {
  stripe: boolean;
  paypal: boolean;
  cod: boolean;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: 'Next Store',
    currency: 'EUR',
    currencySymbol: '€',
    taxRate: 22,
    freeShippingThreshold: 50,
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripe: true,
    paypal: true,
    cod: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const supabase = createClient();

    const { data: general } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'general')
      .single();

    const { data: payments } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'payments')
      .single();

    if (general?.value) {
      setStoreSettings(general.value as StoreSettings);
    }
    if (payments?.value) {
      setPaymentSettings(payments.value as PaymentSettings);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();

      // Update general settings
      await supabase
        .from('store_settings')
        .upsert({ key: 'general', value: storeSettings });

      // Update payment settings
      await supabase
        .from('store_settings')
        .upsert({ key: 'payments', value: paymentSettings });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Impostazioni
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Impostazioni salvate con successo
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informazioni Negozio
              </Typography>

              <TextField
                fullWidth
                label="Nome negozio"
                value={storeSettings.name}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, name: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Valuta"
                    value={storeSettings.currency}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, currency: e.target.value })
                    }
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Simbolo valuta"
                    value={storeSettings.currencySymbol}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, currencySymbol: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasse e Spedizione
              </Typography>

              <TextField
                fullWidth
                label="Aliquota IVA (%)"
                type="number"
                value={storeSettings.taxRate}
                onChange={(e) =>
                  setStoreSettings({
                    ...storeSettings,
                    taxRate: parseFloat(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 0, max: 100 }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Soglia spedizione gratuita"
                type="number"
                value={storeSettings.freeShippingThreshold || ''}
                onChange={(e) =>
                  setStoreSettings({
                    ...storeSettings,
                    freeShippingThreshold: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                inputProps={{ min: 0 }}
                helperText="Lascia vuoto per disabilitare"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Metodi di Pagamento
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.stripe}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        stripe: e.target.checked,
                      })
                    }
                  />
                }
                label="Stripe (Carte di credito)"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 6, mb: 2 }}>
                Pagamenti con carta tramite Stripe
              </Typography>

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.paypal}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        paypal: e.target.checked,
                      })
                    }
                  />
                }
                label="PayPal"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 6, mb: 2 }}>
                Pagamenti tramite conto PayPal
              </Typography>

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={paymentSettings.cod}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        cod: e.target.checked,
                      })
                    }
                  />
                }
                label="Contrassegno"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
                Pagamento alla consegna
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving && <CircularProgress size={20} />}
        >
          {saving ? 'Salvataggio...' : 'Salva Impostazioni'}
        </Button>
      </Box>
    </Box>
  );
}
