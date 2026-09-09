import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!username.trim()) {
      setError("Username / Email / Mobile is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = login(username, password, rememberMe);
      setLoading(false);
      if (!success) {
        setError("Invalid username or password.");
        return;
      }
      setUsername("");
      setPassword("");
      setRememberMe(false);
      setShowPassword(false);
      navigate("/dashboard", {
        replace: true,
      });
    }, 500);
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <LockKeyhole size={26} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-blue-600">
            JAVA ENTERPRISE SUITE
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Super Admin Portal
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-red-600">LOGIN</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to access the administration portal.
            </p>
          </div>
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            autoComplete="off"
          >
            <div>
              <label className="field-label">
                Username / Email / Mobile
                <span className="ml-1 text-red-500">*</span>
              </label>
              <input
                type="text"
                name="login-user"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin"
                className="field-input"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="field-label">
                Password
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="login-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="admin123"
                  className="field-input pr-11"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 accent-slate-900"
              />
              <span className="text-sm font-semibold text-slate-700">
                Remember Me
              </span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={17} />
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>
          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs font-bold text-blue-700">Demo Login</p>
            <p className="mt-1 text-xs text-blue-600">Username: admin</p>
            <p className="text-xs text-blue-600">Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
