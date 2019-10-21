const D = require("discord.js")
const log = require("./log.js")

module.exports = class {
  constructor(token, name = "undefined") {
    this.client = new D.Client()
    this.client.login(token)
    this.client.on("ready", () => {
      this.client.user.setStatus("available")
      log(`Logged in (${this.client.user.tag}) from ${name}`, "Discord")
    })
    return this.client
  }
}