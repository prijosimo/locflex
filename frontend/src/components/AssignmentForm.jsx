import { useState } from "react";

// Form component that lets a user assign a task and log the  word count
function AssignmentForm({ onAssignmentAdded }) {
    const [taskName, setTaskName] = useState("");
    const [wordCount, setWordCount] = useState("");
    const [estimatedHours, setEstimatedHours] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [message, setMessage] = useState("");

// Form submission: sends assignment data to the backend API
const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:5000/api/assignments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: 1,
                task_name: taskName,
                word_count: parseInt(wordCount),
                estimated_hours: parseFloat(estimatedHours),
                due_date: dueDate,
            }),
        });

        if (response.ok) {
            setMessage("Task assigned successfully!");
            setTaskName("");
            setWordCount("");
            setEstimatedHours("");
            setDueDate("");
            if (onAssignmentAdded) onAssignmentAdded();
        } else {
            setMessage("Error assigning task. Please try again.");
        }
    } catch (err) {
        setMessage("Could not connect to the server.");
    }
    };

return (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Assign Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Task Name
                </label>
                <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                    placeholder="e.g. Translate marketing brochure"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Word Count
                </label>
                <input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    required
                    min="0"
                    placeholder="e.g. 500"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
                Estimated Hours
            </label>
            <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                min="0"
                step="0.5"
                placeholder="e.g. 3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
                Due Date
            </label>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>

        <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
        >
            Assign Task
        </button>

        {message && (
            <p className="text-sm text-center text-green-600">{message}</p>
        )}
    </form>
</div>
);
}

export default AssignmentForm;