export default function useAdminAuth() {
  const token = localStorage.getItem("token");
  return { isAdmin: !!token }; // Trả về object với isAdmin
}
