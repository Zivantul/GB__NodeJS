import fs from 'fs'
import readline from 'readline'

const logReader = 'log/access_tmp.log.txt';
const [mask1, mask2] = ['89.123.1.41', '34.48.240.111'];
const logMask1 = `${mask1}_requests.log`;
const logMask2 = `${mask2}_requests.log`;

const rd = readline.createInterface({
    input: fs.createReadStream(logReader),
    console: false
});

const writestream1 = fs.createWriteStream(logMask1, {
    encoding: 'utf-8',
    flags: 'a'
});
const writestream2 = fs.createWriteStream(logMask2, {
    encoding: 'utf-8',
    flags: 'a'
});

rd.on('line', function (line) {
    if (line != '') {
        if (line.includes(mask1)) {
            writestream1.write(line + '\n');
        } else if (line.includes(mask2)) {
            writestream2.write(line + '\n');
        }
    }
});