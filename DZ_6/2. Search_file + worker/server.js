import http from 'http';
import fs from 'fs';
import path from 'path';
import { Transform } from "stream";
import { Server } from "socket.io";
import { Worker } from 'worker_threads';

const host = 'localhost';
const port = '3000';

const list = [];
const fsp = fs.promises;

const links = (arr, curURL) => {
    if (curURL.endsWith("/")) {
        curURL = curURL.substring(0, curURL.length - 1);
    }
    let li = "";
    for (const item of arr) {
        li += `<li><a href="${curURL}/${item}">${item}</a></li>`;
    }
    return li;
};

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const url = req.url.split('?')[0];
        const curPath = path.join(process.cwd(), url)
        const passwordSizeBytes = 4;

        fs.stat(curPath, (err, stats) => {
            if (!err) {
                if (stats.isFile(curPath)) {
                    const rs = fs.createReadStream(curPath, "utf-8");
                    rs.pipe(res);

                    function start(workerData) {
                        return new Promise((resolve, reject) => {
                            const worker = new Worker('./worker.js', { workerData });
                            worker.on('message', resolve);
                            worker.on('error', reject);
                        })
                    }
                    start(passwordSizeBytes)
                        .then(result => console.log(result)).catch(err => console.error(err));

                } else {
                    fsp
                        .readdir(curPath)
                        .then((files) => {
                            if (url !== '/') {
                                files.unshift("..")
                            }
                            return files;
                        })
                        .then((data) => {
                            const filePath = path.join(process.cwd(), "./index.html");
                            const rs = fs.createReadStream(filePath);
                            const ts = new Transform({
                                transform(chunk, encoding, callback) {
                                    const li = links(data, url);
                                    this.push(chunk.toString().replace('#filelinks', li));
                                    callback();
                                }
                            });

                            rs.pipe(ts).pipe(res);
                        });
                }
            } else {
                res.end('Path is not exist');
            }
        });
    }
});

let userCntr = 0;

const io = new Server(server)
io.on('connection', (client) => {
    console.log(`Websocket connected`)
    userCntr++;
    client.broadcast.emit('NEW_CONN_EVENT', { uctr: userCntr })
    client.emit('NEW_CONN_EVENT', { uctr: userCntr })
})

server.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});