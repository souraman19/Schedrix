export const HOST = "http://localhost:5000";

const AUTH_ROUTES = `${HOST}/api/auth`;



export const LOG_OUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const GOOGLE_AUTH_ROUTE = `${AUTH_ROUTES}/google`;
export const GOOGLE_AUTH_CALLBACK_ROUTE = `${AUTH_ROUTES}/google/callback`;
export const USER_INFO_ROUTE = `${AUTH_ROUTES}/user`;