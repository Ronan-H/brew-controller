import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
  ThemeConfig,
} from '@chakra-ui/react'
import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

const { Button, Badge, Heading, Divider, NumberInput, Spinner, Alert } = chakraTheme.components;

const theme: ThemeConfig = extendBaseTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  components: {
    Button, Badge, Heading, Divider, NumberInput, Spinner, Alert
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <ChakraBaseProvider theme={theme}>
        <App />
      </ChakraBaseProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>
);
