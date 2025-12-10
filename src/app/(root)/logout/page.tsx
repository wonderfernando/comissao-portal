import { logoutAction } from "../auth"

export default async function LogoutPage() {
    await logoutAction()
    return <div>Logging out...</div>
}