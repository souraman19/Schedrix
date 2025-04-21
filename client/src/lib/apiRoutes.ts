export const HOST = "http://localhost:5000";

const AUTH_ROUTES = `${HOST}/api/auth`;
const TASK_ROUTES = `${HOST}/api/task`;
const USER_ROUTES = `${HOST}/api/user`;


export const LOG_OUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const GOOGLE_AUTH_ROUTE = `${AUTH_ROUTES}/google`;
export const GOOGLE_AUTH_CALLBACK_ROUTE = `${AUTH_ROUTES}/google/callback`;
export const USER_INFO_ROUTE = `${AUTH_ROUTES}/user`;


export const CREATE_TASKS_ROUTE = `${TASK_ROUTES}/create`;
export const GET_FILTERED_TASKS_ROUTE = `${TASK_ROUTES}/get/filtered`;
export const GET_TASK_STATIC_DETAILS_ROUTE = `${TASK_ROUTES}/get/static/details`;
export const GET_TASK_DYNAMIC_DETAILS_ROUTE = `${TASK_ROUTES}/get/dynamic/details`;
export const RESOLVE_TASK_ROUTE = `${TASK_ROUTES}/resolve`;


export const GET_USER_POINTS_ANALYTICS_ROUTE = `${USER_ROUTES}/get/points/analytics`;

