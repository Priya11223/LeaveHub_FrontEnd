"use client";

import { useRouter } from "next/navigation";

const UserNotFound = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">🚫</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          User Not Found
        </h1>

        <p className="text-gray-600 mb-6">
          The user you are looking for does not exist or may have been removed.
        </p>

        <button
          onClick={() => router.back()}
          className="rounded-full bg-orange-500 px-6 py-2 text-white font-medium hover:bg-orange-600 transition"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default UserNotFound;
