import http from "http";

const server = http.createServer((req, res) => {
  const { method, url, headers } = req;

  console.log("Method:", method);
  console.log("URL:", url);
  console.log("Headers:", headers);

  // Set default header
  res.setHeader("Content-Type", "text/plain");

  if (method === "GET" && url === "/") {
    res.statusCode = 200;
    res.end("Home Page");
  } 
  else if (method === "GET" && url === "/about") {
    res.statusCode = 200;
    res.end("About Page");
  } 
  else {
    res.statusCode = 404;
    res.end("Page Not Found");
  }
});

server.listen(8000, () => {
  console.log("Server started on port 8000");
});
