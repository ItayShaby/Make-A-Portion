import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RecipesProvider } from './context/RecipesContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginModal from './components/LoginModal/LoginModal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DiscoverPage from './pages/DiscoverPage';
import MyRecipesPage from './pages/MyRecipesPage';
import FavoritesPage from './pages/FavoritesPage';
import RecipePage from './pages/RecipePage';
import AddRecipePage from './pages/AddRecipePage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RecipesProvider>
          <Routes>
            {/* Full-page auth screens */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<Layout />}>
              {/* Public — anyone can browse recipes */}
              <Route path="/" element={<DiscoverPage />} />
              <Route path="/recipe/:id" element={<RecipePage />} />

              {/* Protected — require a logged-in user */}
              <Route element={<ProtectedRoute />}>
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/my-recipes" element={<MyRecipesPage />} />
                <Route path="/add-recipe" element={<AddRecipePage />} />
                <Route path="/edit-recipe/:id" element={<AddRecipePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<EditProfilePage />} />
              </Route>
            </Route>
          </Routes>

          {/* Login popup, available on every page */}
          <LoginModal />
        </RecipesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
