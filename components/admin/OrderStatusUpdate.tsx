'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createClient } from '@/lib/supabase/client';

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
}

const statuses = [
  { value: 'pending', label: 'In attesa' },
  { value: 'processing', label: 'In elaborazione' },
  { value: 'shipped', label: 'Spedito' },
  { value: 'delivered', label: 'Consegnato' },
  { value: 'cancelled', label: 'Annullato' },
  { value: 'refunded', label: 'Rimborsato' },
];

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
}: OrderStatusUpdateProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'aggiornamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Aggiorna Stato
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Stato aggiornato con successo
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Stato</InputLabel>
          <Select
            value={status}
            label="Stato"
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          onClick={handleUpdate}
          disabled={loading || status === currentStatus}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Aggiornamento...' : 'Aggiorna Stato'}
        </Button>
      </CardContent>
    </Card>
  );
}
