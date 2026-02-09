import { useState, useEffect } from "react";
import { signup, checkAuth } from "../../../services/authService";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../../lib/slices/authSlice";
import toast from "react-hot-toast";

const SignupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);

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
        // No valid session, stay on signup
      } finally {
        setChecking(false);
      }
    };
    verifyExistingSession();
  }, [dispatch]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await signup(formData);

      if (result.success) {
        toast.success("Signup successful!");
        dispatch(setUser({ name: result.data?.name || result.user?.name }));
        setFormData({ name: "", email: "", password: "" });
        
        // Redirect to home page after successful signup
        router.push("/");
      } else {
        toast.error(result.message || "Signup failed");
      }

      console.log("Signup success:", result);
    } catch (error) {
      toast.error(error?.Message || error?.message || "Signup failed");
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
    <>
      <div className="w-full max-w-sm">
        <h2 className="text-4xl font-bold text-white !mb-6">
          <span className="hidden sm:inline">Create new account</span>
          <span className="sm:hidden">Create account</span>
        </h2>

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-8">
          {/* {errors.general && <p className="text-red-500">{errors.general}</p>} */}
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: "" });
                }
              }}
              className=" auth-input"
            />
            {errors.name && (
              <p className="absolute top-11 text-red-500 text-sm">
                {errors.name}
              </p>
            )}
          </div>
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
              className="auth-input text-white"
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
              className="auth-input text-white pr-10"
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
            {loading ? "Processing..." : "Create Account"}
          </button>
        </form>
        <div className="flex items-center justify-center !my-4">
          <p className="text-white">
            I already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-black font-bold hover:text-gray-700 hover:cursor-pointer ml-1"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
