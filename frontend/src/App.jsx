import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { enrutador } from './routes/rutas';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={enrutador} />
    </AuthProvider>
  );
}
