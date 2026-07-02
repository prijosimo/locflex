import AvailabilityForm from "./components/AvailabilityForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">LocFlex</h1>
      <AvailabilityForm />
    </div>
  );
}

export default App;