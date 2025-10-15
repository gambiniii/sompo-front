import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  getCargoTypes,
  createCargoType,
  updateCargoType,
  deleteCargoType,
} from '@/shared/http/sompo-api/cargo-type';
import { CargoType, CargoTypeCreate, CargoTypeUpdate } from '@/shared/interfaces/areas/cargo-type.interface';

const CATEGORIAS = ['Geral', 'Perigosa'];
const IMPACTOS_AMBIENTAIS = ['Muito Alto', 'Alto', 'Moderado', 'Baixo'];

export const CargoTypesComponent = () => {
  const [cargoTypes, setCargoTypes] = useState<CargoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CargoTypeCreate>({
    categoria: 'Geral',
    risco_roubo_percentual: 0,
    risco_acidente_percentual: 0,
    descricao: '',
    exemplos: '',
    riscos_principais: '',
    impacto_ambiental: '',
  });

  useEffect(() => {
    loadCargoTypes();
  }, []);

  const loadCargoTypes = async () => {
    setLoading(true);
    try {
      const data = await getCargoTypes();
      setCargoTypes(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar tipos de carga');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (cargoType?: CargoType) => {
    if (cargoType) {
      setEditingId(cargoType.id);
      setFormData({
        categoria: cargoType.categoria,
        risco_roubo_percentual: cargoType.risco_roubo_percentual,
        risco_acidente_percentual: cargoType.risco_acidente_percentual,
        descricao: cargoType.descricao,
        exemplos: cargoType.exemplos || '',
        riscos_principais: cargoType.riscos_principais || '',
        impacto_ambiental: cargoType.impacto_ambiental || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        categoria: 'Geral',
        risco_roubo_percentual: 0,
        risco_acidente_percentual: 0,
        descricao: '',
        exemplos: '',
        riscos_principais: '',
        impacto_ambiental: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateCargoType(editingId, formData as CargoTypeUpdate);
        toast.success('Tipo de carga atualizado com sucesso');
      } else {
        await createCargoType(formData);
        toast.success('Tipo de carga criado com sucesso');
      }
      handleCloseDialog();
      loadCargoTypes();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar tipo de carga');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este tipo de carga?')) {
      return;
    }

    try {
      await deleteCargoType(id);
      toast.success('Tipo de carga excluído com sucesso');
      loadCargoTypes();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir tipo de carga');
    }
  };

  const getCategoriaColor = (categoria: string) => {
    return categoria === 'Perigosa' ? 'error' : 'default';
  };

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case 'Muito Alto':
        return 'error';
      case 'Alto':
        return 'warning';
      case 'Moderado':
        return 'info';
      case 'Baixo':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading && cargoTypes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Tipos de Carga
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Novo Tipo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Categoria</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="center">Risco Roubo (%)</TableCell>
              <TableCell align="center">Risco Acidente (%)</TableCell>
              <TableCell>Impacto Ambiental</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargoTypes.map((cargoType) => (
              <TableRow key={cargoType.id} hover>
                <TableCell>
                  <Chip label={cargoType.categoria} color={getCategoriaColor(cargoType.categoria)} size="small" />
                </TableCell>
                <TableCell>{cargoType.descricao}</TableCell>
                <TableCell align="center">{cargoType.risco_roubo_percentual.toFixed(2)}</TableCell>
                <TableCell align="center">{cargoType.risco_acidente_percentual.toFixed(2)}</TableCell>
                <TableCell>
                  {cargoType.impacto_ambiental && (
                    <Chip
                      label={cargoType.impacto_ambiental}
                      color={getImpactoColor(cargoType.impacto_ambiental)}
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleOpenDialog(cargoType)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(cargoType.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Editar Tipo de Carga' : 'Novo Tipo de Carga'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              select
              label="Categoria"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              SelectProps={{ native: true }}
              fullWidth
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </TextField>

            <TextField
              label="Descrição"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              fullWidth
              required
              multiline
              rows={2}
            />

            <TextField
              label="Exemplos"
              value={formData.exemplos}
              onChange={(e) => setFormData({ ...formData, exemplos: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Risco Roubo (%)"
                type="number"
                value={formData.risco_roubo_percentual}
                onChange={(e) => setFormData({ ...formData, risco_roubo_percentual: parseFloat(e.target.value) })}
                fullWidth
                required
                inputProps={{ step: 0.1, min: 0 }}
              />
              <TextField
                label="Risco Acidente (%)"
                type="number"
                value={formData.risco_acidente_percentual}
                onChange={(e) => setFormData({ ...formData, risco_acidente_percentual: parseFloat(e.target.value) })}
                fullWidth
                required
                inputProps={{ step: 0.1, min: 0 }}
              />
            </Box>

            <TextField
              label="Riscos Principais"
              value={formData.riscos_principais}
              onChange={(e) => setFormData({ ...formData, riscos_principais: e.target.value })}
              fullWidth
            />

            <TextField
              select
              label="Impacto Ambiental"
              value={formData.impacto_ambiental}
              onChange={(e) => setFormData({ ...formData, impacto_ambiental: e.target.value })}
              SelectProps={{ native: true }}
              fullWidth
            >
              <option value=""></option>
              {IMPACTOS_AMBIENTAIS.map((impacto) => (
                <option key={impacto} value={impacto}>
                  {impacto}
                </option>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
