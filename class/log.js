const colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
}

const prefixesColors = {
  Other: colors.FgWhite,
  Discord: colors.FgMagenta,
  MySQL: colors.FgCyan,
}

function formatNumber(n) {
  if (n < 10) {
    return "0" + n.toString()
  } else {
    return n
  }
}

module.exports = function(message, prefix = "Other", file = __filename) {
  var date = new Date()
  var year = date.getFullYear()
  var month = formatNumber(date.getMonth() + 1)
  var day = formatNumber(date.getDate())

  var hour = formatNumber(date.getHours())
  var minute = formatNumber(date.getMinutes())

  var currentDate = `${day}.${month}.${year} ${hour}:${minute}`

  console.log(`${prefixesColors[prefix] || colors.FgWhite}[${prefix}]`, `${colors.Reset}(${currentDate}) ${message}`)
}