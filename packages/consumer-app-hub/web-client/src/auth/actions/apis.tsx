export function login(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success'
      });
    }, 1000);
  });
  // return $R.post("/login", data);
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
