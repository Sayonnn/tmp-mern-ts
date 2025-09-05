import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import TextInput from "../../components/TextInput"; // import the reusable component

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("client");
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUsernameError(null);
    setPasswordError(null);
    setLoading(true);

    if (!username.trim()) {
      setUsernameError("Username is required");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      setLoading(false);
      return;
    }

    const response = login({ username, password, role });
    setLoading(false);

    if (!response.status) {
      if (response.field === "username") setUsernameError(response.message);
      else if (response.field === "password") setPasswordError(response.message);
      else notify && notify(response.message, "error");
      return;
    }

    notify && notify(response.message, "success");
    setTimeout(() => navigate("/upguard-admin/dashboard"), 1000);
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center mb-4">Admin Login</h1>

        <TextInput
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          error={usernameError}
        />

        <TextInput
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          error={passwordError}
        />

        <TextInput type="text" name="role" value={role} hidden/>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
}

export default Login;
