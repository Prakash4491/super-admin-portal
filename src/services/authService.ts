const AUTH_KEY = "java-enterprise-suite-auth";
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";
export function login(username: string, password: string, rememberMe: boolean) {
  const isValid =
    username.trim() === DEFAULT_USERNAME && password === DEFAULT_PASSWORD;
  if (!isValid) {
    return false;
  }
  const authData = {
    username: DEFAULT_USERNAME,
    role: "Super Administrator",
    loggedIn: true,
  };
  if (rememberMe) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  } else {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  }
  return true;
}
export function isAuthenticated() {
  const localAuth = localStorage.getItem(AUTH_KEY);
  const sessionAuth = sessionStorage.getItem(AUTH_KEY);
  return Boolean(localAuth || sessionAuth);
}
export function getCurrentUser() {
  const localAuth = localStorage.getItem(AUTH_KEY);
  const sessionAuth = sessionStorage.getItem(AUTH_KEY);
  const auth = localAuth || sessionAuth;
  if (!auth) {
    return null;
  }
  return JSON.parse(auth);
}
export function logout() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
}
