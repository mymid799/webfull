export default function useAdminAuth() {
  const token = localStorage.getItem("token");
  return !!token; // Trả về true nếu đã đăng nhập admin
}
