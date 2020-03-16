import cookie from "js-cookie";

const adminToken = "admin_toKen";
const usernameKey = "username";

export function getToken(){
    return cookie.get(adminToken);
}

export function setToken(toKen){
    return cookie.set(adminToken,toKen);
}

export function removeToken(){
    return cookie.remove(adminToken);
}

export function setUserName(value){
    return cookie.set(usernameKey,value);
}

export function getUserName(value){
    return cookie.get(usernameKey);
}

export function removeUserName(){
    return cookie.remove(usernameKey);
}