

const shuffle = (value) => {
    let a = value.toString().split(""), n = a.length
    for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var tmp = a[i]
        a[i] = a[j]
        a[j] = tmp
    }
    return a.join("")
}

const generateID = () => {
    return Number(shuffle(Date.now()))
}

const fullDateTime = (value) => {
    let date
    if (value) {
        date = new Date(value)
    } else {
        date = new Date()
    }

    let dd = date.getUTCDate()
    dd = dd < 10 ? '0'+dd : dd

    let mm = date.getUTCMonth()+1
    mm = mm < 10 ? '0'+mm : mm

    let yyyy = date.getUTCFullYear()

    return yyyy+'-'+mm+'-'+dd+' '+date.getUTCHours()+':'+date.getUTCMinutes()+':'+date.getUTCSeconds()
}


module.exports = {
    generateID,
    fullDateTime
}