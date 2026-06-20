import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/LoginModal/LoginModal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyRecipesPage from './pages/MyRecipesPage';
import RecipePage from './pages/RecipePage';
import AddRecipePage from './pages/AddRecipePage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Full-page auth screens */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<Layout />}>
            {/* Public — anyone can browse recipes */}
            <Route path="/" element={<MyRecipesPage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />

            {/* Protected — require a logged-in user */}
            <Route element={<ProtectedRoute />}>
              <Route path="/add-recipe" element={<AddRecipePage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>

        {/* Login popup, available on every page */}
        <LoginModal />
      </AuthProvider>
    </BrowserRouter>
  );
}
