import { useState } from "react";

// Component of the form that lets a user set  daily and weekly word count capacity
function CapacityForm({ onCapacitySaved }) {
    const [dailyWordCount, setDailyWordCount] = useState("");
    const [weeklyWordCount, setWeeklyWordCount] = useState("");
    const [message, setMessage] = useState("");

  // Sending capacity data to the backend API
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/capacity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: 1,
                    daily_word_count: parseInt(dailyWordCount),
                    weekly_word_count: parseInt(weeklyWordCount),
                }),
            });

        if (response.ok) {
            setMessage("Capacity saved successfully!");
            if (onCapacitySaved) onCapacitySaved();
        } else {
            setMessage("Error saving capacity. Please try again.");
        }
        } catch (err) {
            setMessage("Could not connect to the server.");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Set Word Count Capacity
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Daily Word Count
                    </label>
                    <input
                        type="number"
                        value={dailyWordCount}
                        onChange={(e) => setDailyWordCount(e.target.value)}
                        required
                        min="0"
                        placeholder="e.g. 2000"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Weekly Word Count
                </label>
                <input
                    type="number"
                    value={weeklyWordCount}
                    onChange={(e) => setWeeklyWordCount(e.target.value)}
                    required
                    min="0"
                    placeholder="e.g. 10000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
                >
                Save Capacity
                </button>

                {message && (
                    <p className="text-sm text-center text-green-600">{message}</p>
                )}
            </form>
        </div>
    );
}

export default CapacityForm;