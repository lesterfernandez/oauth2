import { useOAuth } from "@oauth2/react-spa";
import { useUser } from "@/context/user";
import env from "@/env";
import {useEffect} from "react";
import {useNavigate} from "react-router";

export default function LoginForm() {
  const { redirectToProvider, loading } = useOAuth();
  const { user } = useUser();
  const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            void navigate("/dashboard");
        }
    }, [user, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center max-w-md p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl text-gray-800 mb-5">Login</h2>
        <form className="w-full flex flex-col">
          <button
            className="py-2.5 px-5 bg-blue-500 text-white border-none rounded-md cursor-pointer transition-colors duration-300"
            type="button"
            onClick={() =>
              redirectToProvider({
                provider: "google",
                clientId: env.VITE_GOOGLE_CLIENT_ID,
              })
            }
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign in with Google"}
          </button>
        </form>
      </div>
    </div>
  );
}
