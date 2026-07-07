import { useState } from "react";
import AvailabilityForm from "./components/AvailabilityForm";
import CapacityForm from "./components/CapacityForm";
import AssignmentForm from "./components/AssignmentForm";
import Dashboard from "./components/Dashboard";

function App() {
  // Used to trigger a dashboard refresh when new data is saved
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 gap-8">
      <h1 className="text-3xl font-bold text-gray-800 mt-6">LocFlex</h1>

      {/* Dashboard shows current availability and capacity */}
      <Dashboard refreshTrigger={refresh} />

      {/* Forms to log new data */}
      <AvailabilityForm onEntryAdded={() => setRefresh((r) => r + 1)} />
      <CapacityForm onCapacitySaved={() => setRefresh((r) => r + 1)} />
      <AssignmentForm onAssignmentAdded={() => setRefresh((r) => r + 1)} />
    </div>
  );
}

export default App;