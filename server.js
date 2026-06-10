import { v4 as uuidv4 } from "uuid";
import http from "http";
import { successHandle, errorHandle } from "./resHandle.js";

const uuid = uuidv4();
// console.log(uuid, 123);

const todos = [];

const server = http.createServer((req, res) => {
  //   console.log(req);

  let body = "";
  req.on("data", (chunk) => {
    // console.log(chunk);
    body += chunk;
  });

  if (req.url === "/todos" && req.method === "GET") {
    //取得所有待辦清單
    successHandle(res, todos);
  } else if (req.url === "/todos" && req.method === "DELETE") {
    //刪除所有待辦事項
    todos.length = 0;
    successHandle(res, todos);
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    //刪除指定待辦事項
    //取得ID
    const id = req.url.split("/").pop(); //我要用/做切割，然後pop取最後一個值
    console.log(id);
    //取得在陣列的那個位置
    const index = todos.findIndex((element) => element.id == id); //如果不等於-1 就表示存在
    console.log(index);
    if (id !== undefined && index > -1) {
      todos.splice(index, 1);
      successHandle(res, todos);
    } else {
      errorHandle(res, "找不到該筆待辦事項", 404);
    }
  } else if (req.url === "/todos" && req.method === "POST") {
    //新增待辦事項
    req.on("end", () => {
      try {
        // 1. 把字串轉成 JavaScript 物件
        const data = JSON.parse(body);
        console.log(data.title); // 這樣就能正確印出 "qwe" 囉！

        if (data.title !== undefined) {
          // 2. 這裡可以進行新增到 todos 陣列的動作
          todos.push({ title: data.title, id: uuidv4() });

          // 3. 確保「資料處理完」後，才回傳成功訊息 (要放進 on('end') 裡面)
          successHandle(res, todos);
        } else {
          errorHandle(res, "title 欄位未填寫");
        }
      } catch (error) {
        // 萬一解析失敗 (例如傳錯格式)，就回傳錯誤
        errorHandle(res, "資料格式錯誤");
      }
    });
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    //編輯待辦事項
    req.on("end", () => {
      try {
        // 1. 把字串轉成 JavaScript 物件
        const data = JSON.parse(body);
        console.log(data.title); 

        //取得ID
        const id = req.url.split("/").pop(); //我要用/做切割，然後pop取最後一個值
        console.log(id);
        //取得在陣列的那個位置
        const index = todos.findIndex((element) => element.id == id); //如果不等於-1 就表示存在
        console.log(index);
        if (data.title !== undefined && id !== undefined && index > -1) {
          todos[index].title=data.title;
          successHandle(res, todos);
        } else if (index === -1) {
          errorHandle(res, "找不到該筆待辦事項", 404);
        } else {
          errorHandle(res, "title 欄位未填寫正確");
        }

      } catch (error) {
        // 萬一解析失敗 (例如傳錯格式)，就回傳錯誤
        errorHandle(res, "資料格式錯誤");
      }
    });
  } else if (req.method === "OPTIONS") {
    //跨網域使用
    successHandle(res);
  } else {
    //路由錯誤
    errorHandle(res, "路由錯誤", 404);
  }
});
server.listen(8080);
