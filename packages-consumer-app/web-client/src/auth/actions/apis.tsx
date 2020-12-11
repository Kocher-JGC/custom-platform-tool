// TODO 登录不是真实的
export function login(data): Promise<{ code: string, message: string, data?: any }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 'C0000',
        message: 'success',
        data: {
          username: data.AdminName,
          token: "123456"
        }
      });
    }, 500);
  });
}

export function logout() {
  return $A_R.post("/logout", {});
}

export interface RegisterForm {
  username: string;
  password: string;
}
export function register(formData: RegisterForm) {
  return $A_R.post("/register", formData);
}

export function getUsers() {
  return $A_R.get("/users");
}
