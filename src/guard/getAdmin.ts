export const getAdmin = () => {
  const adminId = process.env.ADMIN_ID;
  if (!adminId) throw new Error("Admin ID not found");
  return adminId;
};
