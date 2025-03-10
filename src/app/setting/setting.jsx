import axios from "axios";

export const TOKEN = "token";
export const USER_LOGIN = "userLogin";
export const Email = "email";

export function setCookie(name, value, days = 7) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export const DOMAIN = "https://airbnbnew.cybersoft.edu.vn";
export const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNDUiLCJIZXRIYW5TdHJpbmciOiIwMS8wNS8yMDI1IiwiSGV0SGFuVGltZSI6IjE3NDYwNTc2MDAwMDAiLCJuYmYiOjE3Mjc0NTY0MDAsImV4cCI6MTc0NjIwNTIwMH0.PzBrbPqj4UBRfSiGqAHeXWsE8SLTZWBERwn6CiRs63w";

export const http = axios.create({
  baseURL: DOMAIN,
  timeout: 10000,
});

http.interceptors.request.use((req) => {
  const token = localStorage.getItem(TOKEN);
  req.headers = {
    ...req.headers,
    Authorization: token,
    'TokenCybersoft': TOKEN_CYBERSOFT,
    token: token
  };
  return req;
});

http.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    switch (err?.response?.status) {
      case 400:
        {
          
        }
        break;
      case 404:
        {
          alert("Đường dẫn không tồn tại");
        }
        break;
      case 401:
        {
          alert("Bạn cần đăng nhập để truy cập trang này");
        }
        break;
      case 403:
        {
          alert("Yêu cầu Quyền quản trị viên !");
        }
        break;
      case 500:
        {
          alert("Lỗi hệ thống!");
        }
        break;
      default:
        break;
    }
    return Promise.reject(err);
  }
);
