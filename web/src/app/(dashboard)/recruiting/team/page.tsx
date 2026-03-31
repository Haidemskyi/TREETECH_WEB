import { getUsers } from "@/app/actions/users";
import TeamPage from "./client";

export default async function Page() {
    const users = await getUsers();
    return <TeamPage users={users} />;
}
