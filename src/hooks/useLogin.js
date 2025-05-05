import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (username, password) => {
		const success = handleInputErrors(username, password);
		if (!success) return;
		setLoading(true);

		try {
			// Make sure to use the correct API URL
			const API_URL = import.meta.env.VITE_API_BASE_URL;

			const res = await fetch(`${API_URL}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			// Check for a successful response status
			if (!res.ok) {
				throw new Error("Failed to login: " + res.statusText);
			}

			const data = await res.json();

			if (data.error) {
				throw new Error(data.error);
			}

			// Store user data and set in context
			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			// Improved error handling
			toast.error(error.message || "An error occurred during login.");
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
		return false;
	}
	return true;
}
