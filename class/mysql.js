//const mysql = require("mysql")
const log = require("./log.js")

const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password:                                                                                                                                                                                                                                                                                                                                                                     "",
  database: "ai"
}
/*
const con = mysql.createConnection(dbConfig)

con.connect(function(err) {
  if (err) throw err
  log("Connected", "MySQL")
})

function query(string, callback, args) {
  try {
    con.query(string, (err, result) => {
      if (callback) {
        callback(result, args)
      }
      if (err) {
        log(`[Error] ${err}`, "MySQL")
      }
    })
  } catch(err) {log(`[Error] ${err}`, "MySQL")}
}

function escape(string) {
  return mysql.escape(string)
}
*/

const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows, fields] = await connection.execute('SELECT * FROM `brain`');

}

main()

