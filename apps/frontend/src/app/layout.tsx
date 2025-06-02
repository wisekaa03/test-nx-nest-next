import * as React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, NormalizedCacheObject } from '@apollo/client';
import { ApolloNextAppProvider } from '@apollo/client-integration-nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ApolloWrapper } from './apollo';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloWrapper>{props.children}</ApolloWrapper>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
