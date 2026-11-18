import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { enrutador } from './routes/rutas';
import ErrorBoundary from './components/ui/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={enrutador} />
      </AuthProvider>
    </ErrorBoundary>
  );
}
