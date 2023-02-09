import { CssBaseline, ThemeProvider } from '@mui/material';
import '@styles/globals.css';
import theme from '@styles/theme';
import type { AppProps } from 'next/app';
import { AuthProvider } from 'src/contexts/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
