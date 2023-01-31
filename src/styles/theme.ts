import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { Roboto } from '@next/font/google';

declare module '@mui/material/styles' {
  interface CustomTheme {
    orderStatus?: {
      shipped?: string;
      pending?: string;
      canceled?: string;
    };
    zIndices?: {
      loadingSpinner?: number;
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme extends CustomTheme {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ThemeOptions extends CustomTheme {}
}

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  orderStatus: {
    shipped: '#e6ffe6',
    pending: '#ffffe6',
    canceled: '#ffe6e6',
  },
  zIndices: {
    loadingSpinner: 1000,
  },
});

export default theme;
