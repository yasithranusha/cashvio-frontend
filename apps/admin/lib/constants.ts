export const BACKEND_URL =
  process.env.API_BASE_URL ??
  (() => {
    throw new Error("API_BASE_URL environment variable is not defined");
  })();

export const SESSION_SECRET =
  process.env.SESSION_SECRET_KEY_ADMIN ??
  (() => {
    throw new Error(
      "SESSION_SECRET_KEY_ADMIN environment variable is not defined"
    );
  })();
