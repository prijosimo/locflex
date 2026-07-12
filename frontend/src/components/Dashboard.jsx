import { useState, useEffect } from "react";

// Dashboard component that displays the user's availability entries and capacity settings
function Dashboard({ refreshTrigger }) {
    const [availability, setAvailability] = useState([]);
    const [capacity, setCapacity] = useState(null);
    const [loading, setLoading] = useState(true); // I added this to show a loading message when data is being fetched from the API
    const [overload, setOverload] = useState(null); // This compares workload against capacity
    const [hours, setHours] = useState(null); // This stores the total number of tasks and estimated hours from the assignments API

  // This part fetches data from the backend whenever the component loads or refreshTrigger changes
    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // This part fetches availability entries for user 1
            const availRes = await fetch("http://localhost:5000/api/availability/1");
            const availData = await availRes.json();
            setAvailability(availData);

            // This part fetches capacity settings for user 1
            const capRes = await fetch("http://localhost:5000/api/capacity/1");
            const capData = await capRes.json();
            setCapacity(capData);


            // This part fetches the overload status for user 1
            const overloadRes = await fetch("http://localhost:5000/api/assignments/1/overload");
            const overloadData = await overloadRes.json();
            setOverload(overloadData);

            const hoursRes = await fetch("http://localhost:5000/api/assignments/1/hours");
            const hoursData = await hoursRes.json();
            setHours(hoursData);

        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }


    };

  // Help to format a date string into a readable format
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-IE", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Helper to return a colour based on availability status
    const statusColour = (status) => {
        if (status === "available") return "bg-green-100 text-green-700";
        if (status === "unavailable") return "bg-red-100 text-red-700";
        return "bg-yellow-100 text-yellow-700";
    };

    if (loading) return <p className="text-gray-500 text-sm">Loading dashboard...</p>;

        return (
            <div className="w-full max-w-2xl space-y-6">

                {/* Overload warning banner */}
                {overload && (
                    <div className={`w-full rounded-xl p-4 text-sm font-medium ${
                        overload.overloaded
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-green-100 text-green-700 border border-green-300'
                    }`}>
                        {overload.overloaded ? '⚠️ ' : '✅ '}{overload.message}
                    </div>
                )}

                {/* Capacity summary card */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Capacity Settings
                    </h2>
                    {capacity ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-500">Daily Limit</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {capacity.daily_word_count.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-400">words</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-500">Weekly Limit</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {capacity.weekly_word_count.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-400">words</p>
                            </div>
                        </div>
                    ) : (
                    <p className="text-sm text-gray-400">No capacity settings found.</p>
                    )}
                </div>

                {/* Workload summary card */}
                <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Workload Summary
                </h2>
                {hours ? (
                    <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500">Total Tasks</p>
                        <p className="text-2xl font-bold text-orange-600">
                        {hours.total_tasks}
                        </p>
                        <p className="text-xs text-gray-400">assigned</p>
                    </div>
                    <div className="bg-teal-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500">Estimated Hours</p>
                        <p className="text-2xl font-bold text-teal-600">
                        {parseFloat(hours.total_hours).toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-400">hours</p>
                    </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No workload data found.</p>
                )}
                </div>



                {/* Availability entries card */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Availability
                    </h2>
                    {availability.length === 0 ? (
                        <p className="text-sm text-gray-400">No availability entries found.</p>
                    ) : (
                        <ul className="space-y-2">
                            {availability.map((entry) => (
                            <li
                                key={entry.id}
                                className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3"
                            >
                                <span className="text-sm text-gray-600">
                                    {formatDate(entry.date)}
                                </span>
                                <span
                                    className={`text-xs font-medium px-3 py-1 rounded-full ${statusColour(entry.status)}`}
                                >
                                    {entry.status}
                                    </span>
                                    {entry.notes && (
                                        <span className="text-xs text-gray-400 italic">
                                            {entry.notes}
                                        </span>
                                    )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Dashboard;