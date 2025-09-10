import useAuthContext from "../../hooks/useAuth";

function Dashboard() {
    const { user } = useAuthContext();
  
  return (
    <div>Dashboard {user?.username}</div>
  )
}

export default Dashboard