import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  styled,
  Typography,
} from '@mui/material';

export const FilterContainer = styled(Paper)(() => ({
  display: 'flex',
  padding: '5px',
  width: '100%',
}));

export const FilterFormControl = styled(FormControl)(() => ({
  width: '100%',
}));

export const FilterFormLabel = styled(FormLabel)(() => ({}));

export const FilterFormGroup = styled(FormGroup)(() => ({
  overflowY: 'auto',
  textOverflow: 'ellipsis',
  overflowX: 'hidden',
  whiteSpace: 'nowrap',

  flexWrap: 'nowrap',

  width: '100%',
  padding: '10px',
}));

export const FilterFormControlLabel = styled(FormControlLabel)(() => ({
  height: '30px',
  width: '100%',
}));

export const FilterOption = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '5px',
}));

export const FilterOptionLabel = styled(Typography)(() => ({}));

export const FilterOptionCount = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  display: 'inline',
  fontSize: '12px',
}));
