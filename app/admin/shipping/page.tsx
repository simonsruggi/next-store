'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import type { ShippingMethod } from '@/types';

export default function AdminShippingPage() {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingMethod | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    estimatedDaysMin: '1',
    estimatedDaysMax: '5',
    isActive: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMethods();
  }, []);

  const loadMethods = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('shipping_methods')
      .select('*')
      .order('price');
    setMethods(data || []);
    setLoading(false);
  };

  const handleOpenDialog = (method?: ShippingMethod) => {
    if (method) {
      setEditing(method);
      setFormData({
        name: method.name,
        description: method.description || '',
        price: method.price.toString(),
        estimatedDaysMin: method.estimated_days_min.toString(),
        estimatedDaysMax: method.estimated_days_max.toString(),
        isActive: method.is_active,
      });
    } else {
      setEditing(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        estimatedDaysMin: '1',
        estimatedDaysMax: '5',
        isActive: true,
      });
    }
    setDialogOpen(true);
    setError(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setError(null);
  };

  const handleSave = async () => {
    try {
      const supabase = createClient();
      const data = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        estimated_days_min: parseInt(formData.estimatedDaysMin, 10),
        estimated_days_max: parseInt(formData.estimatedDaysMax, 10),
        is_active: formData.isActive,
      };

      if (editing) {
        const { error } = await supabase
          .from('shipping_methods')
          .update(data)
          .eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('shipping_methods')
          .insert(data);
        if (error) throw error;
      }

      handleCloseDialog();
      loadMethods();
    } catch (err: any) {
      setError(err.message || 'Errore durante il salvataggio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo metodo di spedizione?')) return;

    const supabase = createClient();
    await supabase.from('shipping_methods').delete().eq('id', id);
    loadMethods();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Metodi di Spedizione
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuovo Metodo
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrizione</TableCell>
                  <TableCell align="right">Prezzo</TableCell>
                  <TableCell>Tempi</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Caricamento...
                    </TableCell>
                  </TableRow>
                ) : methods.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nessun metodo di spedizione
                    </TableCell>
                  </TableRow>
                ) : (
                  methods.map((method) => (
                    <TableRow key={method.id} hover>
                      <TableCell>{method.name}</TableCell>
                      <TableCell>{method.description || '-'}</TableCell>
                      <TableCell align="right">{formatPrice(method.price)}</TableCell>
                      <TableCell>
                        {method.estimated_days_min}-{method.estimated_days_max} giorni
                      </TableCell>
                      <TableCell>
                        {method.is_active ? 'Attivo' : 'Disattivato'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(method)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(method.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editing ? 'Modifica Metodo di Spedizione' : 'Nuovo Metodo di Spedizione'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            sx={{ mt: 2, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Descrizione"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Prezzo"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Giorni min"
              type="number"
              value={formData.estimatedDaysMin}
              onChange={(e) => setFormData({ ...formData, estimatedDaysMin: e.target.value })}
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              label="Giorni max"
              type="number"
              value={formData.estimatedDaysMax}
              onChange={(e) => setFormData({ ...formData, estimatedDaysMax: e.target.value })}
              inputProps={{ min: 1 }}
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            }
            label="Attivo"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button onClick={handleSave} variant="contained">
            {editing ? 'Salva' : 'Crea'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
