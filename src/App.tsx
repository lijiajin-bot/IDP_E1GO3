import { useState } from 'react';
import Sidebar, { type ActivePage } from './components/Sidebar';
import Header from './components/Header';
import LaboratoryList from './pages/LaboratoryList';
import EquipmentAvailability from './pages/EquipmentAvailability';
import ApplicationStatus from './pages/ApplicationStatus';
import StaffOnDuty from './pages/StaffOnDuty';
import AdvancedElectronics from './pages/AdvancedElectronics';
import LoginPage from './pages/LoginPage';
import InventoryManagement from './pages/InventoryManagement'; // Imported new inventory page
import { type AllowedUser } from './auth';
import { AppProvider } from './context';

type ViewMode =
  | { page: ActivePage; labId: null }
  | { page: 'laboratories'; labId: string };

function MainDashboardApp() {
  const [currentUser, setCurrentUser] = useState<AllowedUser | null>(null);
  const [view, setView] = useState<ViewMode>({ page: 'laboratories', labId: null });

  const navigateToPage = (page: ActivePage) => {
    setView({ page, labId: null });
  };

  const handleLabClick = (labId: string) => {
    setView({ page: 'laboratories', labId });
  };

  const handleEquipmentClick = (equipmentId: string) => {
    if (equipmentId === 'oscilloscope') {
      setView({ page: 'equipment', labId: null });
    }
  };

  const handleLogin = (user: AllowedUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView({ page: 'laboratories', labId: null });
  };

  // If there's no user logged in, intercept and render the Login Screen
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (view.page === 'laboratories' && view.labId === 'advanced-electronics') {
      return (
        <AdvancedElectronics
          onBack={() => setView({ page: 'laboratories', labId: null })}
          onEquipmentClick={handleEquipmentClick}
        />
      );
    }

    switch (view.page) {
      case 'laboratories':
        return <LaboratoryList onLabClick={handleLabClick} />;
      case 'equipment':
        return (
          <EquipmentAvailability 
            userRole={currentUser.role} 
            currentUserEmail={currentUser.email} 
            onSuccessRedirect={() => setView({ page: 'applications', labId: null })}
          />
        );
      case 'applications':
        return (
          <ApplicationStatus 
            userRole={currentUser.role} 
            currentUserEmail={currentUser.email} 
          />
        );
      case 'inventory': // Added state routing to handle the new sidebar view selection
        return (
          <InventoryManagement 
            userRole={currentUser.role}
            currentUserEmail={currentUser.email}
          />
        );
      case 'staff':
        return <StaffOnDuty />;
    }
  };

  const activePage: ActivePage = view.page;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={navigateToPage} userRole={currentUser.role} />

      <div className="ml-64 min-h-screen flex flex-col">
        <Header activePage={activePage} user={currentUser} onLogout={handleLogout} />

        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Global App Wrapper ensuring context is globally accessible to all components down the tree
export default function App() {
  return (
    <AppProvider>
      <MainDashboardApp />
    </AppProvider>
  );
}