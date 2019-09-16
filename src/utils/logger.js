import {createLogger, format, transports} from 'winston'
import path from 'path'

const {combine, timestamp, align, colorize, printf} = format;

const myFormat = printf(info => {
  return info.message;
});


const logger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    align(),
    myFormat
  ),
  transports: [
    new transports.Console(),
     new transports.File({maxsize: 500000, filename: path.join(__dirname,'logs/onError.log'), level: 'error'}),
    new transports.File({maxsize: 500000, filename:  path.join(__dirname,'logs/combined.log')})
  ]
})

module.exports = logger
