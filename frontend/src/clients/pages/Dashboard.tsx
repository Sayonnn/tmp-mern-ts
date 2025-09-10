import useAuthContext from "../../hooks/useAuth";
import { formatDate } from "../../utils/date.handler";

function Dashboard() {
    const { user } = useAuthContext();
  return (
    <div>Client <br/> {user?.username} | {user?.role} | {user?.created_at ? formatDate(user.created_at) : ""} | {user?.email}</div>
  )
}

export default Dashboard