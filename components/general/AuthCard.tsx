"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { AuthError } from "next-auth";

export default function AuthCard() {
  const { data: session, status } = useSession();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/";
    }
  }, [status]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (isRegistering) {
      if (username.length < 4 || username.length > 20) {
        setError("Username must be between 4 and 20 characters long.");
        return;
      }

      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
        setError(
          "Password must be at least 8 characters long and include both letters and numbers."
        );
        return;
      }

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, username }),
        });
        const data = await response.json(); // Parse JSON response

        if (!response.ok) {
          throw new Error(data.error || "Registration failed.");
        }

        alert(
          "Registration successful! Please verify your email before signing in."
        );
        setIsRegistering(false);
      } catch (error: any) {
        console.error("Registration error:", error);
        setError(error.message); // Set error message dynamically
      }
    } else {
      signIn("credentials", { email, password, redirect: false })
        .then((res) => {
          if (typeof res.error === "string") {
            switch (res.error) {
              case "CredentialsSignin":
                setError("Invalid credentials. Please try again.");
                setShowResendButton(false);
                break;
              default:
                setError("Please confirm your email address.");
                setShowResendButton(true);
            }
          } else {
            window.location.href = "/";
          }
        })
        .catch((err) => {
          console.error("Sign-in error:", err);
          setError("An unexpected error occurred. Please try again later.");
          setShowResendButton(false);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isRegistering ? "Register" : "Sign In"}
        </h2>
        {error && (
          <p className="text-red-600 text-center font-medium mb-4">{error}</p>
        )}
        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && (
            <input
              type="text"
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="text"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            {isRegistering ? "Register" : "Sign In"}
          </button>
        </form>
        {!isRegistering && showResendButton && (
          <button
            onClick={async () => {
              try {
                const response = await fetch("/api/sendemail", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(
                    data.error || "Failed to resend verification email"
                  );
                }

                alert("Verification email sent successfully!");
                setShowResendButton(false);
              } catch (error) {
                console.error("Error resending verification email:", error);
                setError(
                  "Error resending verification email. Please try again."
                );
              }
            }}
            className="w-full mt-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors"
          >
            Resend Verification Email
          </button>
        )}

        <button
          onClick={() => signIn("google")}
          className="w-full mt-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
        >
          Sign In with Google
        </button>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
        >
          {isRegistering ? "Switch to Login" : "Switch to Register"}
        </button>
      </div>
    </div>
  );
}
