export const HOST = "https://schedrix-main-server.onrender.com";

const AUTH_ROUTES = `${HOST}/api/auth`;
const TASK_ROUTES = `${HOST}/api/task`;
const USER_ROUTES = `${HOST}/api/user`;
const CONTENT_ROUTES = `${HOST}/api/content`;


export const LOG_OUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const GOOGLE_AUTH_ROUTE = `${AUTH_ROUTES}/google`;
export const GOOGLE_AUTH_CALLBACK_ROUTE = `${AUTH_ROUTES}/google/callback`;
export const USER_INFO_ROUTE = `${AUTH_ROUTES}/user`;


export const CREATE_TASKS_ROUTE = `${TASK_ROUTES}/create`;
export const GET_FILTERED_TASKS_ROUTE = `${TASK_ROUTES}/get/filtered`;
export const GET_TASK_STATIC_DETAILS_ROUTE = `${TASK_ROUTES}/get/static/details`;
export const GET_TASK_DYNAMIC_DETAILS_ROUTE = `${TASK_ROUTES}/get/dynamic/details`;
export const GET_TASK_REPEAT_INFO_ROUTE = `${TASK_ROUTES}/get/repeatInfo`;
export const RESOLVE_TASK_ROUTE = `${TASK_ROUTES}/resolve`;
export const RESCHEDULE_TASK_ROUTE = `${TASK_ROUTES}/reschedule`;
export const GET_TASK_TIMINGS_ROUTE = `${TASK_ROUTES}/get/timings`;
export const GET_TASK_7days = `${TASK_ROUTES}/get/7days`;
export const RESCHEDULE_TASKLISTS_ROUTE = `${TASK_ROUTES}/tasklists/reschedule`;
export const EDIT_REMINDER_TIME_ROUTE = `${TASK_ROUTES}/edit/reminder_time`;



export const GET_USER_POINTS_ANALYTICS_ROUTE = `${USER_ROUTES}/get/points/analytics`;
export const GET_USER_PROFILE_ROUTE = `${USER_ROUTES}/get/profile`;
export const GET_USER_MIND_STATUS_ROUTE = `${USER_ROUTES}/get/mind_status`;
export const EDIT_MIND_STATUS_ROUTE = `${USER_ROUTES}/edit/mind_status`;

export const UPDATE_USER_LAST_ACTIVE_DAY_ROUTE = `${USER_ROUTES}/update/user_last_active_day`;
export const UPDATE_USER_LAST_MIND_STATUS_ASK_DAY_ROUTE = `${USER_ROUTES}/update/user_last_mind_status_ask_data`;


export const GET_QUOTES_ROUTE = `${CONTENT_ROUTES}/get/quotes`;
export const GET_QUOTE_OF_THE_DAY_ROUTE = `${CONTENT_ROUTES}/get/quote_of_the_day`;
export const GET_MOTIVATIONAL_VIDEOS_ROUTE = `${CONTENT_ROUTES}/get/motivational_videos`;


export const SAVE_FCM_TOKEN_ROUTE = `${USER_ROUTES}/save/fcm_token`;



