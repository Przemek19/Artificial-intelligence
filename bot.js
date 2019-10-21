//Autor: Pevo

const Discord = require("./class/discord.js")
const config = require("./config.js")
const BOT = new Discord(config.token, "Bot")
const log = require("./class/log.js")
const mysql = require("mysql2/promise")
const ai = require("./ai.js")

const adminID = "301067938276966421"

const commandPrefixes = ["/", "!"]

BOT.on("ready", () => {
  BOT.user.setPresence({
    game: {
      name: "AI 2.0 by Pevo Alpha",
      type: "PLAYING",
      url: "http://pevo.pro"
    }
  })
})

function escapeMessage(msg, isPunctuation) {
  var content = msg.mentions._content
  if (msg.mentions.everyone) {
    content = content.replace("@everyone", "")
  }
  content = content.replace(/<((:|@|\w|\W^(<|>))*)>/g, "")
  content = content.replace(/ +/g, " ")
  if (isPunctuation) {
    content = content.replace(/(\?|\!|\,|\.)/g, "")
  }
  if (content.length < 1) {
    return false
  } else {
    return content
  }
}

function isCommand(message) {
  var result = false
  if (!message) return false
  commandPrefixes.forEach(element => {
    if (message.search(element) == "0") {
      result = true
    }
  })
  return result
}

function isMessageValid(msg) {
  if (msg.author.bot) return false // Jeśli osoba jest botem, skończ funkcję
  if (isCommand(msg.content)) return false // Jeśli wiadomość jest komendą, skończ funkcję
  msg.content = escapeMessage(msg)
  if (!msg.content) return false // Jeśli wiadomość po przekonwertowaniu nie nadaje się do odpowiedzi, skończ funkcję
  if (msg.content.length < 1) return false // Jeśli wiadomość z niewiadomego powodu jest pusta (nie powinno się wydarzyć), skończ funkcję
  return true
}

// ODPOWIADANIE
BOT.on("message", async msg => {
  if (!isMessageValid(msg)) return
  msg.content = escapeMessage(msg)

  const connection = await mysql.createConnection(config.dbConfig)
  const [result] = await connection.execute("SELECT * FROM `config_talk`")
  result.forEach(element => {
    if (element.channel == msg.channel.id) {
      msg.channel.send(ai.say(msg.content, element.instance))
    }
  })
  connection.end()
})

const currentLearns = []

async function getTwoLatestMessages(channel) {
  var firstMessage = "" // Główna wiadomość
  var secondMessage = "" // Odpowiedź na wiadomość
  var firstMessageAuthor = false // Autor głównej wiadomości
  var secondMessageAuthor = false // Autor odpowiedzi
  var currentAuthor = 1 // Aktualny autor (0 - Główna wiadmość | 1 - Odpowiedź | -1 - Inna osoba)
  var authors = [] // Autorzy (0 - Autor głównej wiadomości | 1 - autor odpowiedzi)
  const messages = await channel.fetchMessages({limit: 16}) // Wiadomości (Zaczynają się od dołu do góry)

  var i = 0
  messages.forEach(msg => {
    if (!msg.author.bot && isMessageValid(msg)) {
      if (i == 0) { // Jeśli pętla wykonuje się pierwszy raz
        authors[1] = msg.author.id // Ustaw autora odpowiedzi
        secondMessageAuthor = msg.author.id
      }

      msg.content = escapeMessage(msg)

      if (msg.content) { // Jeśli wiadomość po sformatowaniu jest prawidłowa
        if (currentAuthor != -1) { // Jeśli do rozmowy nie weszła już trzecia osoba
          if (currentAuthor == 1) { // Jeśli aktualnym autorem jest odpowiadający
            if (authors[1] == msg.author.id) { // Jeśli autorem aktualnej wiadomości jest odpowiadający
              secondMessage = msg.content + "\n" + secondMessage
            } else { // Jeśli nie jest, to zamień aktualnego autora na pytającego i dodaj autora pytającego do tablicy
              currentAuthor = 0
              authors[0] = msg.author.id
              firstMessageAuthor = msg.author.id
            }
          }
          if (currentAuthor == 0) { // Jeśli aktualnym autorem jest pytający
            if (authors[0] == msg.author.id) { // Jeśli autorem aktualnej wiadomości jest pytający
              firstMessage = msg.content + "\n" + firstMessage
            } else { // Jeśli nie jest, to zamień aktualnego autora na inną osobę
              currentAuthor = -1
            }
          }
        }
      }
      i++
    }
  })
  // Usuwanie dodatkowych enterów na końcu
  firstMessage = firstMessage.substring(0, firstMessage.length - 1)
  secondMessage = secondMessage.substring(0, secondMessage.length - 1)
  if (firstMessage.length < 1) firstMessage = false
  if (secondMessage.length < 1) secondMessage = false
  return [firstMessage, secondMessage, firstMessageAuthor, secondMessageAuthor]
}

BOT.on("message", async msg => {
  if (msg.channel.id != "631592346844266516") return
  var [firstMessage, secondMessage, firstMessageAuthor, secondMessageAuthor] = await getTwoLatestMessages(msg.channel)
  log(firstMessageAuthor + "\n" + firstMessage + "\n---\n" + secondMessageAuthor + "\n" + secondMessage)

})

// NAUKA
BOT.on("message", async msg => {
  if (!isMessageValid(msg)) return
  msg.content = escapeMessage(msg)
  const connection = await mysql.createConnection(config.dbConfig)
  const [result] = await connection.execute("SELECT * FROM `config_learn`")
  result.forEach(async element => {
    if (element.channel == msg.channel.id) {
      var [firstMessage, secondMessage, firstMessageAuthor, secondMessageAuthor] = await getTwoLatestMessages(msg.channel)
      if (firstMessage && secondMessage && firstMessageAuthor && secondMessageAuthor) {
        if (currentLearns[msg.channel.id] && (currentLearns[msg.channel.id][0] == firstMessageAuthor && currentLearns[msg.channel.id][1] == secondMessageAuthor)) {
          ai.editLearn(currentLearns[msg.channel.id][2], firstMessage, secondMessage)
        } else {
          var id = await ai.learn(firstMessage, secondMessage, element.instance)
          currentLearns[msg.channel.id] = []
          currentLearns[msg.channel.id][0] = firstMessageAuthor
          currentLearns[msg.channel.id][1] = secondMessageAuthor
          currentLearns[msg.channel.id][2] = id
        }
      }

    }
  })
  connection.end()
})