const [crudeDate] = process.argv.splice(2);
let [hh, dd, mm, yy] = crudeDate.split('-');
hh = Number(hh)
dd = Number(dd)
mm = Number(mm)
yy = Number(yy)

const targetDate = new Date(yy, mm - 1, dd, hh)
let nowDate = new Date();
let ctrLimit = 20 //для проверки, кол-во повторов вывода ограничено в 10

if (nowDate <= targetDate) {
    let timer = setInterval(() => {
        nowDate = new Date()
        let timeDeltaMs = targetDate - nowDate;
        let timeDelta = new Date(timeDeltaMs);
        deltH = timeDelta.getHours() - 3 //поправка на timezone и еще смотрим мниуты
        deltMin = timeDelta.getMinutes()
        deltSec = timeDelta.getSeconds()
        deltD = timeDelta.getDate() - 1 // так как смотрим и на часы тоже
        deltM = timeDelta.getMonth()
        deltY = timeDelta.getFullYear() - 1970 // 0 лет - в формате даты это 1970 год

        if (ctrLimit > 0) {
            console.log(`Осталось ${deltM} мес. ${deltD} дней ${deltH} часов ${deltMin} минут ${deltSec} сек `);
            ctrLimit -= 1;
        } else {
            clearInterval(timer)
        }
    }, 1000);

} else {
    console.log('указанное время - истекло!')
}