"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "../../../services/authService";
import { setUser } from "../../lib/slices/authSlice";
import toast from "react-hot-toast";
import { checkAuth } from "../../../services/authService";
const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [checking, setChecking] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
  const verifyExistingSession = async () => {
    try {
      const result = await checkAuth();
      if (result.success && (result.data?.name || result.user?.name)) {
        dispatch(setUser({ name: result.data?.name || result.user?.name }));
        window.location.href = "/";
        return;
      }
    } catch {
      // No valid session, stay on login
    } finally {
      setChecking(false);
    }
  };
  verifyExistingSession();
}, [dispatch]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    // return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (!validateForm()) {
      console.log("Validation failed");
      return; // stop if validation fails
    }

    console.log("Validation passed, submitting...");
    setLoading(true);
    try {
      const result = await login(formData);

      console.log("Full API response:", result);

      if (result.success) {
        toast.success("Login successful!");
        dispatch(setUser({ name: result.data?.name || result.user?.name }));
        setFormData({ email: "", password: "" });

        console.log("About to redirect to dashboard...");
        // Redirect to home page after successful login
        router.replace("/");
        
        // Fallback redirect if router doesn't work
        // setTimeout(() => {
        //   window.location.href = "/";
        // }, 1000);
        
        console.log("Redirect command sent");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error?.response);

      toast.error(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

    if (checking) {
    return (
      <div className="w-full max-w-sm flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }


    return (
    <div className="w-full max-w-sm">
      <h2 className="text-4xl font-bold text-white !mb-8">Welcome Back</h2>
      {/* <p className="text-white !my-5">Continue your adventure</p> */}

      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col gap-8"
        noValidate
      >
        <div className="relative">
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) {
                setErrors({ ...errors, email: "" });
              }
            }}
            className={`auth-input !text-white ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="absolute top-11 text-red-500 text-sm">
              {errors.email}
            </p>
          )}
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) {
                setErrors({ ...errors, password: "" });
              }
            }}
            className={`auth-input !text-white pr-10 ${errors.password ? "border-red-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500 transition-colors"
          >
            {showPassword ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
          {errors.password && (
            <p className="absolute top-11 text-red-500 text-sm">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full !py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-all duration-300 transform hover:shadow-black/50 font-semibold"
        >
          {loading ? "Processing..." : "Start Journey"}
        </button>
      </form>
      <div className="text-center !mt-4">
        <p className="text-white">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-black font-bold hover:text-gray-700 hover:cursor-pointer ml-1"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
export default LoginForm;
