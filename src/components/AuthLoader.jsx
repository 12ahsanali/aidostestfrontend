"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser, setLoading } from "../lib/slices/authSlice";
import { checkAuth } from "../../services/authService";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AuthLoader = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, name } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        dispatch(setLoading(true));
        
        // Check if user is already authenticated in Redux
        if (isAuthenticated && name) {
          console.log("User already authenticated in Redux, skipping API call");
          setIsChecking(false);
          dispatch(setLoading(false));
          return;
        }

        console.log("Checking authentication via API...");
        const result = await checkAuth();
        
        console.log(result)
        if (result.success && result.data?.name) {
          console.log("Authentication successful, setting user in Redux");
          dispatch(setUser({ name: result.data.name }));
        } else {
          console.log("Authentication failed, redirecting to login");
          dispatch(clearUser());
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        console.log("Redirecting to login due to auth check error");
        dispatch(clearUser());
        router.push("/login");
      } finally {
        setIsChecking(false);
        dispatch(setLoading(false));
      }
    };

    checkAuthentication();
  }, [dispatch, router, isAuthenticated, name]);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-(--bg-dark) flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/Group.svg"
                alt="Loading..."
                width={24}
                height={24}
                className="animate-pulse"
              />
            </div>
          </div>
          <p className="text-gray-400 text-lg animate-pulse">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show children only if authenticated
  return isAuthenticated ? children : null;
};

export default AuthLoader;
