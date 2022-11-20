import colors from 'colors'

const [num1, num2] = process.argv.splice(2);

const minBorder = Number(num1);
const maxBorder = Number(num2);

function isNumber(value) {
    if (value instanceof Number)
        value = value.valueOf();
    if (!isNaN(value)) {
        return isFinite(value) && value === parseInt(value, 10);
    } else {
        return false;
    }
}
function autoColorPrint(value, colorNum) {
    switch (colorNum) {
        case 1:
            console.log(colors.green(value));
            break;
        case 2:
            console.log(colors.yellow(value));
            break;
        case 3:
            console.log(colors.red(value));
            break;
    }
}

//проверяем введены ли числа
if (!isNumber(minBorder) || !isNumber(maxBorder)) {
    // выкидываем ошибку, если это не числа
    throw colors.red("NotANumber! \nOne (or both) of arguments is not a number!");
} else {
    let simpleNumbers = [];
    for (let i = minBorder; i <= maxBorder; i++) {
        let isSimple = true;
        for (let j = minBorder; j < i; j++) {
            if (i % j == 0 && j != 1) {
                isSimple = false;
                break;
            }
        }
        if (isSimple && i != 1) {
            simpleNumbers.push(i);
        }
    }

    //печатаем итоговый массив простых чисел (или говорим, что его нет)
    if (simpleNumbers.length == 0) {
        console.log(colors.yellow(`Простых чисел от ${minBorder} до ${maxBorder} - не найдено`));
    } else {
        let colorCntr = 1;
        for (let i = 0; i < simpleNumbers.length; i++) {
            autoColorPrint(simpleNumbers[i], colorCntr);

            if (colorCntr < 3) {
                colorCntr += 1;
            } else {
                colorCntr = 1;
            }
        }
    }

}


