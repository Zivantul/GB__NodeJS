import fsp from 'fs/promises';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import inquirer from 'inquirer';

const __dirName = '/Users/ivanzuev/Documents/GeekBrains/NodeJS/DZ_4';
const masks = ['', '89.123.1.41', '34.48.240.111'];

fsp
    .readdir(path.join(__dirName))
    .then(async (dirInc) => {
        const list = [];
        for (const item of dirInc) {
            const src = await fsp.stat(item);
            if (src.isFile()) {
                list.push(item);
            }
        }
        return list
    })
    .then((list) => {
        return inquirer.prompt([
            {
                name: "filename",
                type: "list",
                message: "Выберите файл:",
                choices: list,
            },
            {
                name: "mask",
                type: "list",
                message: "Укажите маску для поиска (если маски нет, просто Enter):",
                choices: masks,
            }]
        );
    })
    .then((answers) => {
        const rd = readline.createInterface({
            input: fs.createReadStream(answers.filename),
            console: false
        });

        rd.on('line', function (line) {
            if (line != '') {
                if (line.includes(answers.mask)) {
                    console.log(line);
                }
            }
        })
    })