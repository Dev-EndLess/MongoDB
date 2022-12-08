const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message1, message2) => {
  const dateTime = `${format(new Date(), 'yyyMMdd\tHH:mm:ss')}`
  const logItem = `${dateTime}\t${uuid()}\t${message1}\t${message2}\n`
  console.log(logItem)
  try {
    // se la cartella logs non esiste
    if (!fs.existsSync(path.join(__dirname, '..', 'logs')))
    // crea la cartalla logs
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    // e poi crea o aggiungi il file.txt
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', 'eventLog.txt'), logItem)
  } catch (error) {
    console.log(error)
  }
}

const logger = (req, res, next) => {
  //get-post-put-etc...//where request coming from// ex. index page
  logEvents(`${req.method}\t${req.headers.origin}\t${req.path}`, 'reqLog.txt')
  console.log(`${req.method} ${req.path}`)
  next()
}

module.exports = { logger, logEvents }


