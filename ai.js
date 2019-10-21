const log = require("./class/log.js")
const brain = require("brain.js")
const mysql = require("mysql2/promise")
const config = require("./config.js")
const instances = {}

async function newLearn() {
  log("Start learning...", "AI")

  const connection = await mysql.createConnection(config.dbConfig)
  const [result] = await connection.execute("SELECT * FROM `brain`")

  result.forEach(async element => {
    instances[element.instance] = new brain.recurrent.LSTM()
    const [result] = await connection.execute("SELECT * FROM `brain` WHERE instance=?", [element.instance])
    const trainingData = result.map(item => ({
      input: item.message,
      output: item.reply
    }))
    instances[element.instance].train(trainingData, {
      iterations: 128
    }) 
  })
  connection.end()

  log("Stop learning...", "AI")
}

newLearn()
setInterval(newLearn, config.learnTime * 1000)

function say(message, instance = "global") {
  if (instances[instance]) {
    var output = instances[instance].run(message)
    if (output.length < 1) output = "..."
    return output
  } else {
    return "Error: Attempt to call an empty instance"
  }
}

async function learn(message, reply, instance = "global") {
  const connection = await mysql.createConnection(config.dbConfig)
  if (message.length > 0 && reply.length > 0) {
    const [result] = await connection.execute("INSERT INTO `brain` (`instance`, `message`, `reply`) VALUES (?,?,?)", [instance, message, reply])
    connection.end()
    return result.insertId
  } else {
    connection.end()
    return false
  }
}

async function editLearn(id, message, reply, instance) {
  const connection = await mysql.createConnection(config.dbConfig)
  await connection.execute("UPDATE `brain` SET `message`=?,`reply`=? WHERE id=?", [message, reply, id])
  if (instance) {
    await connection.execute("UPDATE `brain` SET `instance`=? WHERE id=?", [instance, id])
  }
  connection.end()
}

async function removeLearn(id) {
  const connection = await mysql.createConnection(config.dbConfig)
  var [result] = await connection.execute("DELETE FROM `brain` WHERE id=?", [id])
  connection.end()
  return result
}

module.exports = {
  say: say,
  learn: learn,
  editLearn: editLearn,
  removeLearn: removeLearn
}