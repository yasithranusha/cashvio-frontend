import { IBaseMenuItem } from "./admin-routes";

/**
 * The default redirect path for non-logged in users
 * @type {string}
 */
export const DEFAULT_NON_AUTH_REDIRECT: string = "/signin";

/**
 * The default redirect path for non-authorized users
 * @type {string}
 */
export const DEFAULT_NON_AUTHORIZED_REDIRECT: string = "/dashboard";

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to the dashboard
 */
export const authRoutes: IBaseMenuItem[] = [
  { title: "Login", url: "/signin" },
  { title: "Google Login", url: "/google/login" },
  { title: "Google Login", url: "/api/auth/google/callback" },
  { title: "Customer Register", url: "/signup" },
];

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";
