import Link from "next/link";

export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">You are offline</h1>
      <p>Please check your internet connection and try again.</p>
      <p className="mt-4">You can still access previously viewed notes.</p>
      <button
        onClick={() => location.reload()}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Retry
      </button>
      <Link href="/" className="mt-2 text-blue-500 underline">
        Go to Home
      </Link>
    </div>
  );
}
