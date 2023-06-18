import { auth } from '../firebase';

export function Logout({}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="m-4">Click below to log out</h1>
      <button
        className="bg-rose-200 hover:bg-rose-700 text-white py-2 px-4 rounded"
        onClick={() => {
          auth.signOut();
        }}
      >
        Log out
      </button>
    </div>
  );
}
