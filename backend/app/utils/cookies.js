import { cookieConfig } from "../configs/cookie.js";

export const saveCookie = (res, name, value) => {
    res.cookie(name, value, cookieConfig);
}

export const removeCookie = (res, name) => {
    res.clearCookie(name, cookieConfig);
}