import React, { useState } from 'react';
import Layout from './components/Layout';
import { MOCK_USER, ViewState } from './constants';
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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('LOGIN');
  const [user, setUser] = useState(MOCK_USER);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [isAddingPet, setIsAddingPet] = useState(false);

  const handleLogin = (email) => {
    setUser({ ...user, email });
    setIsAuthenticated(true);
    setView(ViewState.DASHBOARD);
  };

  const handleRegister = (userData) => {
    setUser({ ...MOCK_USER, ...userData });
    setIsAuthenticated(true);
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('LOGIN');
    setSelectedPetId(null);
    setIsAddingPet(false);
  };

  if (!isAuthenticated) {
    if (view === 'REGISTER') {
      return <Register onRegister={handleRegister} onNavigateToLogin={() => setView('LOGIN')} />;
    }
    return <Login onLogin={handleLogin} onNavigateToRegister={() => setView('REGISTER')} />;
  }

  return (
    <DataProvider>
      <Layout 
        currentView={view} 
        onChangeView={setView} 
        isModerator={user.role === 'Moderator'}
        userName={user.name}
        userRole={user.role}
        userAvatar={user.avatarUrl}
        onLogout={handleLogout}
      >
        {view === ViewState.DASHBOARD && <Dashboard user={user} setView={setView} />}
        
        {view === ViewState.MY_PETS && (
          <MyPets 
            onSelectPet={(id) => { setSelectedPetId(id); setView(ViewState.PET_DETAILS); }}
            onAddPetClick={() => setIsAddingPet(true)}
          />
        )}

        {view === ViewState.PET_DETAILS && (
          <PetDetail 
            petId={selectedPetId}
            onBack={() => setView(ViewState.MY_PETS)}
          />
        )}

        {view === ViewState.COMMUNITY && (
          <Community 
            user={user}
            onToggleRole={() => setUser({ ...user, role: user.role === 'Owner' ? 'Moderator' : 'Owner' })}
          />
        )}

        {view === ViewState.MODERATION && <Moderation />}

        {view === ViewState.PROFILE && (
          <Profile 
            user={user}
            onUpdateUser={(data) => setUser(prev => ({ ...prev, ...data }))}
            onAddPetClick={() => { setIsAddingPet(true); }}
            onSelectPet={(id) => { setSelectedPetId(id); setView(ViewState.PET_DETAILS); }}
            setView={setView}
          />
        )}
        
        {isAddingPet && <AddPetModal onClose={() => setIsAddingPet(false)} />}
      </Layout>
    </DataProvider>
  );
};

export default App;