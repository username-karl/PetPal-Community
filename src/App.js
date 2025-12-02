import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './AuthContext';
import { DataProvider } from './context/DataContext';
import AddPetModal from './components/AddPetModal';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyPets from './pages/MyPets';
import PetDetail from './pages/PetDetail';
import Community from './pages/Community';
import Moderation from './pages/Moderation';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const { user, login, logout, register } = useAuth();
  const [isAddingPet, setIsAddingPet] = React.useState(false);

  const handleLogin = async (email, password) => {
    await login(email, password);
  };

  const handleRegister = async (userData) => {
    await register(userData);
  };

  const handleLogout = () => {
    logout();
  };

  const isAuthenticated = !!user;

  return (
    <DataProvider>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Register onRegister={handleRegister} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout
                isModerator={user?.role === 'Moderator'}
                userName={user?.name}
                userRole={user?.role}
                userAvatar={user?.avatarUrl}
                onLogout={handleLogout}
              >
                <Routes>
                  <Route path="/" element={<Dashboard user={user} />} />
                  <Route path="/pets" element={<MyPets onAddPetClick={() => setIsAddingPet(true)} />} />
                  <Route path="/pets/:id" element={<PetDetail />} />
                  <Route
                    path="/community"
                    element={
                      <Community
                        user={user}
                        onToggleRole={() => console.log('Toggle role')}
                      />
                    }
                  />
                  <Route path="/moderation" element={<Moderation />} />
                  <Route
                    path="/profile"
                    element={
                      <Profile
                        user={user}
                        onUpdateUser={(data) => console.log('Update user:', data)}
                        onAddPetClick={() => setIsAddingPet(true)}
                      />
                    }
                  />
                </Routes>

                {isAddingPet && <AddPetModal onClose={() => setIsAddingPet(false)} />}
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </DataProvider>
  );
};

export default App;