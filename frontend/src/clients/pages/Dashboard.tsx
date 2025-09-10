import useAuthContext from "../../hooks/useAuth";

function Dashboard() {
    const { user } = useAuthContext();
  return (
    <div>Client Dashboard {user?.username}</div>
  )
}

export default Dashboard