import { Backdrop, CircularProgress } from '@mui/material';
import { CSSProperties } from 'react';

export interface LoadingSpinnerProps extends CSSProperties {
  loading: number;
  handleClose?: () => null;
}

export const LoadingSpinner = ({
  loading,
  handleClose,
}: LoadingSpinnerProps) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndices?.loadingSpinner }}
      open={loading ? true : false}
      onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
