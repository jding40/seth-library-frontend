
//
import { redirect } from "react-router-dom";
import userApi from "../../services/userApi";

// define form submission handler
export async function signupAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const payload: Record<string, string> = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        role: "user",
    };

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const tel = formData.get("tel") as string;

    if (firstName) payload.firstName = firstName;
    if (lastName) payload.lastName = lastName;
    if (tel) payload.tel = tel;

    try {
        await userApi.register(payload);
        return redirect("/signin");
    } catch (err: unknown) {
        if (err && typeof err === "object" && "response" in err) {
            const errorResponse = err as {
                response?: { data?: { message?: string } };
            };
            return { error: errorResponse.response?.data?.message || "Signup failed" };
        }
        return { error: "Signup failed" };
    }
}
