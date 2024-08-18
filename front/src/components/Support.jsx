import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Support = () => {
    const { authToken, user } = useSelector((state) => state.auth);
    const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!message) {
      setError("Message cannot be empty");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      };

      const response = await axios.post(
        "/api/auth/support",
        { email, message },
        config
      );

      setSuccess(response.data.message);
      setMessage("");
      if (!user.email) setEmail("");
    } catch (error) {
      setError(
        error.response?.data?.message || "There was a problem sending the message"
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 bg-blue-100">
      <div className=" p-6 rounded shadow-md w-full max-w-lg bg-cyan-700">
        <h1 className="text-2xl font-semibold mb-4 text-center text-white">Support</h1>
        {error && (
          <p className="text-red-500 mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-500 mb-4 text-center">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 bg-cyan-600">
          {!user.email && (
            <div>
              <label className="block text-xl font-medium  text-white">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          <div>
            <label className="block text-xl font-medium text-white ">
              Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows="5"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-950 text-white text-xl  py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;
