import { api, setAuthToken } from "./client";

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  setAuthToken(data.token);
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
    password_confirmation,
  });
  setAuthToken(data.token);
  return data;
}

export async function me() {
  const { data } = await api.get("/me");
  return data;
}

export async function logout(allDevices = false) {
  await api.post("/auth/logout", { allDevices });
  setAuthToken(undefined);
}
