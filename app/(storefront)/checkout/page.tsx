'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice, generateOrderNumber } from '@/lib/utils';
import { mockShippingMethods } from '@/lib/mock-data';
import type { ShippingMethod, CheckoutFormData, AddressFormData } from '@/types';

function isDemoMode(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  return !url ||
         url === 'https://placeholder.supabase.co' ||
         url.includes('placeholder');
}

const steps = ['Spedizione', 'Pagamento', 'Conferma'];

const emptyAddress: AddressFormData = {
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'IT',
  phone: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [user, setUser] = useState<any>(null);

  const { items, getSubtotal, clearCart } = useCartStore();

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    shippingAddress: { ...emptyAddress },
    billingAddress: { ...emptyAddress },
    sameAsShipping: true,
    shippingMethodId: '',
    paymentMethod: 'stripe',
  });

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    // Demo mode: use mock shipping methods and skip auth
    if (isDemoMode()) {
      setShippingMethods(mockShippingMethods);
      if (mockShippingMethods.length > 0) {
        setFormData((prev) => ({ ...prev, shippingMethodId: mockShippingMethods[0].id }));
      }
      return;
    }

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    // Get shipping methods
    const { data: methods } = await supabase
      .from('shipping_methods')
      .select('*')
      .eq('is_active', true)
      .order('price');

    if (methods) {
      setShippingMethods(methods);
      if (methods.length > 0) {
        setFormData((prev) => ({ ...prev, shippingMethodId: methods[0].id }));
      }
    }

    // Get user
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      setUser(authUser);
      setFormData((prev) => ({ ...prev, email: authUser.email || '' }));

      // Get user's default address
      const { data: address } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('is_default', true)
        .single();

      if (address) {
        setFormData((prev) => ({
          ...prev,
          shippingAddress: {
            fullName: address.full_name,
            addressLine1: address.address_line1,
            addressLine2: address.address_line2 || '',
            city: address.city,
            state: address.state || '',
            postalCode: address.postal_code,
            country: address.country,
            phone: address.phone || '',
          },
        }));
      }
    }
  };

  const subtotal = mounted ? getSubtotal() : 0;
  const selectedShipping = shippingMethods.find((m) => m.id === formData.shippingMethodId);
  const shippingCost = subtotal >= 50 ? 0 : (selectedShipping?.price || 0);
  const tax = Math.round(subtotal * 0.22 * 100) / 100; // 22% IVA
  const total = subtotal + shippingCost + tax;

  const handleAddressChange = (
    type: 'shipping' | 'billing',
    field: keyof AddressFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [`${type}Address`]: {
        ...prev[`${type}Address`],
        [field]: value,
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Shipping
        const addr = formData.shippingAddress;
        return !!(
          formData.email &&
          addr.fullName &&
          addr.addressLine1 &&
          addr.city &&
          addr.postalCode &&
          addr.country &&
          formData.shippingMethodId
        );
      case 1: // Payment
        return !!formData.paymentMethod;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) {
      setError('Compila tutti i campi obbligatori');
      return;
    }
    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Demo mode: show a message instead of creating a real order
    if (isDemoMode()) {
      setTimeout(() => {
        clearCart();
        alert('Questa è una demo! In produzione, l\'ordine verrebbe creato e processato.');
        router.push('/');
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const orderNumber = generateOrderNumber();

      // Create shipping address
      const { data: shippingAddr, error: shippingError } = await supabase
        .from('addresses')
        .insert({
          user_id: user?.id || null,
          ...formData.shippingAddress,
          full_name: formData.shippingAddress.fullName,
          address_line1: formData.shippingAddress.addressLine1,
          address_line2: formData.shippingAddress.addressLine2 || null,
          postal_code: formData.shippingAddress.postalCode,
        })
        .select()
        .single();

      if (shippingError) throw shippingError;

      // Create billing address if different
      let billingAddrId = shippingAddr.id;
      if (!formData.sameAsShipping) {
        const { data: billingAddr, error: billingError } = await supabase
          .from('addresses')
          .insert({
            user_id: user?.id || null,
            ...formData.billingAddress,
            full_name: formData.billingAddress!.fullName,
            address_line1: formData.billingAddress!.addressLine1,
            address_line2: formData.billingAddress!.addressLine2 || null,
            postal_code: formData.billingAddress!.postalCode,
          })
          .select()
          .single();

        if (billingError) throw billingError;
        billingAddrId = billingAddr.id;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          order_number: orderNumber,
          status: 'pending',
          payment_status: formData.paymentMethod === 'cod' ? 'pending' : 'pending',
          payment_method: formData.paymentMethod,
          subtotal,
          shipping_cost: shippingCost,
          tax,
          total,
          shipping_address_id: shippingAddr.id,
          billing_address_id: billingAddrId,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        variant_id: item.variant?.id || null,
        quantity: item.quantity,
        unit_price: item.variant?.price ?? item.product.price,
        total_price: (item.variant?.price ?? item.product.price) * item.quantity,
        product_name: item.product.name,
        variant_name: item.variant?.name || null,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Handle payment based on method
      if (formData.paymentMethod === 'stripe') {
        // Redirect to Stripe checkout
        const response = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        });

        const { url, error } = await response.json();
        if (error) throw new Error(error);
        if (url) {
          window.location.href = url;
          return;
        }
      } else if (formData.paymentMethod === 'paypal') {
        // Redirect to PayPal
        router.push(`/checkout/paypal?orderId=${order.id}`);
        return;
      }

      // For COD, order is complete
      clearCart();
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Si è verificato un errore durante il checkout');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Caricamento...</Typography>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Il tuo carrello è vuoto. <a href="/products">Scopri i prodotti</a>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              {/* Step 1: Shipping */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Informazioni di Spedizione
                  </Typography>

                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                    Indirizzo di Spedizione
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Nome e Cognome"
                        value={formData.shippingAddress.fullName}
                        onChange={(e) => handleAddressChange('shipping', 'fullName', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Indirizzo"
                        value={formData.shippingAddress.addressLine1}
                        onChange={(e) => handleAddressChange('shipping', 'addressLine1', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Indirizzo (riga 2)"
                        value={formData.shippingAddress.addressLine2}
                        onChange={(e) => handleAddressChange('shipping', 'addressLine2', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Città"
                        value={formData.shippingAddress.city}
                        onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <TextField
                        fullWidth
                        label="Provincia"
                        value={formData.shippingAddress.state}
                        onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <TextField
                        fullWidth
                        label="CAP"
                        value={formData.shippingAddress.postalCode}
                        onChange={(e) => handleAddressChange('shipping', 'postalCode', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Paese"
                        value={formData.shippingAddress.country}
                        onChange={(e) => handleAddressChange('shipping', 'country', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Telefono"
                        value={formData.shippingAddress.phone}
                        onChange={(e) => handleAddressChange('shipping', 'phone', e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
                    Metodo di Spedizione
                  </Typography>

                  <FormControl component="fieldset">
                    <RadioGroup
                      value={formData.shippingMethodId}
                      onChange={(e) => setFormData({ ...formData, shippingMethodId: e.target.value })}
                    >
                      {shippingMethods.map((method) => (
                        <FormControlLabel
                          key={method.id}
                          value={method.id}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography>
                                {method.name} -{' '}
                                {subtotal >= 50 ? (
                                  <Typography component="span" color="success.main">
                                    Gratuita
                                  </Typography>
                                ) : (
                                  formatPrice(method.price)
                                )}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {method.description} ({method.estimated_days_min}-{method.estimated_days_max} giorni)
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}

              {/* Step 2: Payment */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Metodo di Pagamento
                  </Typography>

                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    >
                      <FormControlLabel
                        value="stripe"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography>Carta di Credito/Debito</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pagamento sicuro con Stripe
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="paypal"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography>PayPal</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Paga con il tuo conto PayPal
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="cod"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography>Contrassegno</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Paga alla consegna (+ €3,00)
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  <Divider sx={{ my: 3 }} />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.sameAsShipping}
                        onChange={(e) => setFormData({ ...formData, sameAsShipping: e.target.checked })}
                      />
                    }
                    label="Indirizzo di fatturazione uguale a quello di spedizione"
                  />

                  {!formData.sameAsShipping && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Indirizzo di Fatturazione
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Nome e Cognome"
                            value={formData.billingAddress?.fullName}
                            onChange={(e) => handleAddressChange('billing', 'fullName', e.target.value)}
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Indirizzo"
                            value={formData.billingAddress?.addressLine1}
                            onChange={(e) => handleAddressChange('billing', 'addressLine1', e.target.value)}
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Città"
                            value={formData.billingAddress?.city}
                            onChange={(e) => handleAddressChange('billing', 'city', e.target.value)}
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <TextField
                            fullWidth
                            label="CAP"
                            value={formData.billingAddress?.postalCode}
                            onChange={(e) => handleAddressChange('billing', 'postalCode', e.target.value)}
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <TextField
                            fullWidth
                            label="Paese"
                            value={formData.billingAddress?.country}
                            onChange={(e) => handleAddressChange('billing', 'country', e.target.value)}
                            required
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              )}

              {/* Step 3: Confirmation */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Conferma Ordine
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography>{formData.email}</Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Indirizzo di Spedizione
                    </Typography>
                    <Typography>
                      {formData.shippingAddress.fullName}
                      <br />
                      {formData.shippingAddress.addressLine1}
                      {formData.shippingAddress.addressLine2 && (
                        <>
                          <br />
                          {formData.shippingAddress.addressLine2}
                        </>
                      )}
                      <br />
                      {formData.shippingAddress.postalCode} {formData.shippingAddress.city}
                      {formData.shippingAddress.state && ` (${formData.shippingAddress.state})`}
                      <br />
                      {formData.shippingAddress.country}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Metodo di Pagamento
                    </Typography>
                    <Typography>
                      {formData.paymentMethod === 'stripe' && 'Carta di Credito/Debito'}
                      {formData.paymentMethod === 'paypal' && 'PayPal'}
                      {formData.paymentMethod === 'cod' && 'Contrassegno'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" gutterBottom>
                    Articoli
                  </Typography>
                  {items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        py: 1,
                      }}
                    >
                      <Typography>
                        {item.product.name}
                        {item.variant && ` - ${item.variant.name}`}
                        {' x '}{item.quantity}
                      </Typography>
                      <Typography>
                        {formatPrice((item.variant?.price ?? item.product.price) * item.quantity)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Indietro
                </Button>

                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Continua
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                  >
                    {loading ? 'Elaborazione...' : 'Conferma Ordine'}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Riepilogo
              </Typography>

              {items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1,
                  }}
                >
                  <Typography variant="body2">
                    {item.product.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    {formatPrice((item.variant?.price ?? item.product.price) * item.quantity)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotale</Typography>
                <Typography>{formatPrice(subtotal)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Spedizione</Typography>
                <Typography>
                  {shippingCost === 0 ? 'Gratuita' : formatPrice(shippingCost)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>IVA (22%)</Typography>
                <Typography>{formatPrice(tax)}</Typography>
              </Box>

              {formData.paymentMethod === 'cod' && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Contrassegno</Typography>
                  <Typography>{formatPrice(3)}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Totale</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(total + (formData.paymentMethod === 'cod' ? 3 : 0))}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
