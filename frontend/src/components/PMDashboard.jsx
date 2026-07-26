import { useState, useEffect } from "react";

// PM Dashboard that fetches and displays all linguists' availability and capacity in one view
function PMDashboard({ refreshTrigger }) {
    const [linguists, setLinguists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const fetchData = async () => {
        setLoading(true);
        try {
        // This part fetches all linguists' availability and capacity from the PM route
        const res = await fetch("http://localhost:5000/api/availability");
        const data = await res.json();

        // This part groups the data by user so each linguist appears once with all their entries
        const grouped = {};
        data.forEach((row) => {
            if (!grouped[row.id]) {
                grouped[row.id] = {
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    daily_word_count: row.daily_word_count,
                    weekly_word_count: row.weekly_word_count,
                    availability: [],
                };
            }
            if (row.date) {
                grouped[row.id].availability.push({
                    date: row.date,
                    status: row.status,
                    notes: row.notes,
                });
            }
        });

        setLinguists(Object.values(grouped));
        } catch (err) {
            console.error("Error fetching PM dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    // This part formats a date string into a readable format
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-IE", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // This part returns a colour based on availability status
    const statusColour = (status) => {
        if (status === "available") return "bg-green-100 text-green-700";
        if (status === "unavailable") return "bg-red-100 text-red-700";
        return "bg-yellow-100 text-yellow-700";
    };

    if (loading) return <p className="text-gray-500 text-sm">Loading dashboard...</p>;

    return (
        <div className="w-full max-w-3xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Team Overview</h2>

            {linguists.length === 0 ? (
                <p className="text-sm text-gray-400">No linguists found.</p>
            ) : (
                linguists.map((linguist) => (
                <div key={linguist.id} className="bg-white rounded-xl shadow p-6 space-y-4">
                    {/* Linguist name and email */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700">{linguist.name}</h3>
                        <span className="text-sm text-gray-400">{linguist.email}</span>
                    </div>

                    {/* Capacity settings */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">Daily Limit</p>
                            <p className="text-xl font-bold text-blue-600">
                                {linguist.daily_word_count ? linguist.daily_word_count.toLocaleString() : "Not set"}
                            </p>
                            <p className="text-xs text-gray-400">words</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">Weekly Limit</p>
                            <p className="text-xl font-bold text-purple-600">
                                {linguist.weekly_word_count ? linguist.weekly_word_count.toLocaleString() : "Not set"}
                            </p>
                            <p className="text-xs text-gray-400">words</p>
                        </div>
                    </div>

                    {/* Availability entries */}
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Availability</p>
                        {linguist.availability.length === 0 ? (
                            <p className="text-sm text-gray-400">No availability logged.</p>
                        ) : (
                            <ul className="space-y-2">
                                {linguist.availability.map((entry, index) => (
                                    <li key={index} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-2">
                                        <span className="text-sm text-gray-600">{formatDate(entry.date)}</span>
                                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColour(entry.status)}`}>
                                            {entry.status}
                                        </span>
                                        {entry.notes && (
                                            <span className="text-xs text-gray-400 italic">{entry.notes}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                ))
            )}
        </div>
    );
}

export default PMDashboard;