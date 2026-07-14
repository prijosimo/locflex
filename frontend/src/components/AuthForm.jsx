// This file handles both login and registration

import { useState } from "react";

function AuthForm({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true); // I added this to toggle between login and register
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

    // Choosing the correct endpoint based on the current mode
    const endpoint = isLogin ? "/login" : "/register";

    try {
        const response = await fetch(`http://localhost:5000/api/auth${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                isLogin
                    ? { email, password }
                    : { name, email, password, timezone: "Europe/Dublin" }
            ),
        });

        const data = await response.json();

        if (response.ok) {
            if (isLogin) {
                // Storing the token in localStorage so it persists across page refreshes
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                // Notifying the parent component that login was successful
                onLogin(data.user);
            } else {
                // After registering, switching to login mode automatically
                setMessage("Registered successfully! Please log in.");
                setIsLogin(true);
            }
        } else {
            setMessage(data.error || "Something went wrong.");
        }
    } catch (err) {
        setMessage("Could not connect to the server.");
    }
};

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">LocFlex</h1>

            <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    {isLogin ? "Log In" : "Create Account"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name field — only shown in register mode */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g. Priscila Krahl"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="e.g. priscila@locflex.com"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
                    >
                        {isLogin ? "Log In" : "Register"}
                    </button>

                    {message && (
                        <p className="text-sm text-center text-green-600">{message}</p>
                    )}
                </form>

                {/* Toggle between login and register */}
                <p className="text-sm text-center text-gray-500 mt-4">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setMessage(""); }}
                        className="text-blue-500 hover:underline"
                    >
                        {isLogin ? "Register" : "Log In"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default AuthForm;