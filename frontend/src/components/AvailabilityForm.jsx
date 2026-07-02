import { useState } from "react";

// Form component that lets a user log their availability for a specific date
function AvailabilityForm({ onEntryAdded }) {
    // Track form field values in state
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("available");
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState("");

    // Handle form submission — sends data to the backend API
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents the page from refreshing on submit

        try {
            const response = await fetch("http://localhost:5000/api/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: 1, // hardcoded for now — will come from auth later
                    date,
                    status,
                    notes,
                }),
        });

        if (response.ok) {
            setMessage("Availability saved successfully!");
            setDate("");
            setNotes("");
            setStatus("available");
            if (onEntryAdded) onEntryAdded(); // notify parent to refresh the list
        } else {
        setMessage("Error saving availability. Please try again.");
        }
    } catch (err) {
        setMessage("Could not connect to the server.");
    }
};

return (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Log Availability
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date picker */}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Date
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Status dropdown */}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                Status
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="partial">Partial</option>
                </select>
            </div>

            {/* Optional notes field */}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Notes (optional)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="e.g. Morning only"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
            >
                Save Availability
            </button>

            {/* Success or error message */}
            {message && (
                <p className="text-sm text-center text-green-600">{message}</p>
            )}
        </form>
    </div>
);
}

export default AvailabilityForm;