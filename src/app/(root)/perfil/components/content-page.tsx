import { getCurrentUser } from "../../auth"
import UserFormPage from "../form";

export async  function ContentPage() {
  const user = await getCurrentUser();
  console.log("User no perfil:", user);
    return (
    <UserFormPage user={user}/>
  )
}