//建立共用的 heads 
const headers = {
   'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json'
}

export const successHandle = (res, data) => {
  res.writeHead(200, headers);
  // 把傳進來的 data 轉成 JSON 格式並回傳結束
  res.end(JSON.stringify({
    status: "success",
    data: data
  }));
};

export const errorHandle= (res,message, statusCode = 400) => {
  res.writeHead(statusCode, headers);
  // 把傳進來的 data 轉成 JSON 格式並回傳結束
  res.end(JSON.stringify({
    status: "false",
    message: message
  }));
};
