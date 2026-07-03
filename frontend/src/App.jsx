import AvailabilityForm from "./components/AvailabilityForm";
import CapacityForm from "./components/CapacityForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 gap-8">
      <h1 className="text-3xl font-bold text-gray-800">LocFlex</h1>
      <AvailabilityForm />
      <CapacityForm />
    </div>
  );
}

export default App;