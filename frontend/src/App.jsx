import { useState } from "react";
import AvailabilityForm from "./components/AvailabilityForm";
import CapacityForm from "./components/CapacityForm";
import AssignmentForm from "./components/AssignmentForm";
import Dashboard from "./components/Dashboard";
import AuthForm from "./components/AuthForm";

function App() {
  const [refresh, setRefresh] = useState(0);
  // Checking if user is already logged in from a session before
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // This is called when login is successful
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // This is called when user logs out
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // If not logged in, this show the auth form
  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  // If logged in, this shows the main app
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 gap-8">
      <div className="w-full max-w-2xl flex justify-between items-center mt-6">
        <h1 className="text-3xl font-bold text-gray-800">LocFlex</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hello, {user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Log out
          </button>
        </div>
      </div>
      <Dashboard refreshTrigger={refresh} />
      <AvailabilityForm onEntryAdded={() => setRefresh((r) => r + 1)} />
      <CapacityForm onCapacitySaved={() => setRefresh((r) => r + 1)} />
      <AssignmentForm onAssignmentAdded={() => setRefresh((r) => r + 1)} />
    </div>
  );
}

export default App;