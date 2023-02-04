import { TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TableCellCurrency = styled(TableCell)(({ theme }) => ({
  color: theme.customPalette.money.main,
}));
