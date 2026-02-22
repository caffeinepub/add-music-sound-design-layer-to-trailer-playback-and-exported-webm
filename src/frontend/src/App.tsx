import { TrailerBuilderPlayerPage } from './pages/TrailerBuilderPlayerPage';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TrailerBuilderPlayerPage />
      <Toaster />
    </ThemeProvider>
  );
}
