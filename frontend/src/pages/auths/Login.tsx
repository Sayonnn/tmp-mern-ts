import { useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import TextInput from "../../components/TextInput";
import useAuthContext from "../../hooks/useAuth";

function Login() {  
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("client");
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  /** Handle submit */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  
    try {
      const { status,message,field } = await login({ username, password, role }); 
      // console.log({status,message});
      setLoading(false);
  
      if (!status) {
        if (field === "username") setUsernameError(message);
        else if (field === "password") setPasswordError(message);
        else notify && notify(message, "error");
        return;
      }
  
      notify && notify(message, "success");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error: any) {
      setLoading(false);
      notify && notify(error.message || "Login failed", "error");
    }
  };
  
  
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center mb-4">Client Login</h1>

        <TextInput
          label="Username"
          name="username"
          value={username}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setUsername(e.target.value)}
          placeholder="Enter username"
          error={usernameError}
        />

        <TextInput
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
          placeholder="Enter password"
          error={passwordError}
        />

        <TextInput type="text" name="role" value={role} onChange={() => { } } hidden/>

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
