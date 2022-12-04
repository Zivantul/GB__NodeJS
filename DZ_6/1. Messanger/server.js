import http from "http";

import fs from "fs";
import path from "path";
import { Server } from "socket.io"

const host = "localhost";
const port = 3000;


const server = http.createServer((req, res) => {
  if (["GET", "POST", "PUT"].includes(req.method)) {

    const filePath = path.join(process.cwd(), "./index.html");
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});

const io = new Server(server)
io.on('connection', (client) => {
  console.log(`Websocket connected`)
  client.broadcast.emit('NEW_CONN_EVENT', { msg: 'New User got in' })

  client.on('client-msg', (data) => {
    client.broadcast.emit('server-msg', { msg: data.msg, nick: data.nick })
    client.emit('server-msg', { msg: data.msg, nick: data.nick })
  })

})


server.listen(port, host, () =>
  console.log(`Server running at http://${host}:${port}`)
);
