const http = require("http");
const url = require("url");
const fs = require("fs");
let mysql = require("mysql");
const qs = require("querystring");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "qwe123",
  database: "dic",
});

const port = 3000;
const hostname = "127.0.0.1";
const dicPath = "./dictionary.json";

db.connect();

const server = http.createServer((req, res) => {
  let _url = req.url;
  // let queryData = url.parse(_url, true).query;
  let pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    db.query("SELECT * FROM list;", (error, results) => {
      if (error) {
        console.log("Error Occured!!!");
      }
      function deleteWhenClick(event) {
        console.log(event);
      }
      function dicList(data) {
        let list = "<ol>";
        let i = 0;
        while (i < data.length) {
          list =
            list +
            `<div><li>${data[i].Korean} : ${data[i].English}
              </li><form action="delete_process" method="post">
              <input type="hidden" name="index"value='${i + 1}'/>
              <input type="submit" value="Delete">
              </form>
              </div>`;
          i++;
        }
        return list;
      }
      function template(dicList) {
        return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
      <p>lists</p>
      ${dicList}
      <p>Welcome Node Dictionary</p>
      <form action="submit_process" method="post">
        <p><input type="text" name="korean" placeholder="put korean"></p>
        <p><input type="text" name="english" placeholder="put english"></input></p>
        <p><input type="submit" value="Update"></input></p>
      </form>
      <script>
      function deleteWhenClick(event) {
        console.log(event);
      }
      </script>
      </body>
      </html>`;
      }
      const templateHTML = template(dicList(results));
      res.statusCode = 200;
      res.end(templateHTML);
    });
  } else if (pathname === "/submit_process") {
    let queryData = "";
    req.on("data", (data) => {
      queryData = queryData + data;
    });
    req.on("end", () => {
      queryData = qs.parse(queryData.toString());
      db.query(
        `INSERT INTO list (Korean,English,created) values ("${queryData.korean}","${queryData.english}",NOW());`,
        (error) => {
          if (error) {
            console.log("Error Occured!!!");
          }
          console.log("Dictionary Updated!!!");
          res.writeHead(302, { Location: "/" });
          res.end();
        }
      );
    });
  } else if (pathname === "/delete_process") {
    let queryData = "";
    req.on("data", (data) => {
      queryData = queryData + data;
    });
    req.on("end", () => {
      queryData = qs.parse(queryData);
      db.query(`DELETE FROM list WHERE id=${queryData.index}`, (error) => {
        console.log("DELETE Success!!!");
      });
    });
    res.writeHead(302, { Location: "/" });
    res.end();
  } else {
    res.statusCode = 404;
    res.end("404 Page Not Found");
  }
});

server.listen(port);
