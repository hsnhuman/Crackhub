"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/app/newVereficationtoken";

const VerifyEmailForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter(); // Use Next.js router for redirection

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("No token found");
      setTimeout(() => {
        router.push("/auth/login"); // Redirect to login if no token is found
      }, 2000);
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
          setTimeout(() => {
            router.push("/auth/login"); // Redirect after success
          }, 2000);
        }
        if (data.error) {
          setError(data.error);
          setTimeout(() => {
            router.push("/auth/login"); // Redirect on failure
          }, 2000);
        }
      })
      .catch(() => {
        setError("An unexpected error occurred");
        setTimeout(() => {
          router.push("/auth/login"); // Redirect in case of an unexpected error
        }, 2000);
      });
  }, [token, success, error, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Email Verification
        </h2>
        {success && (
          <p className="text-green-600 text-center font-medium mt-4">
            Email verified successfully! Redirecting...
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center font-medium mt-4">
            Error: {error} Redirecting...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailForm;
