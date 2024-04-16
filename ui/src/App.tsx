
import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
  ThemeConfig,
} from '@chakra-ui/react'
import TempControls from './components/TempControls'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



export default function App() {
  return (
    <TempControls />
  )
}
