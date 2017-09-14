import pm2 from 'pm2'
import Responder from './../lib/messages/responder.js'
import { apps } from './../../ecosystem.config.js'
import moment from 'moment'
require('moment-duration-format')

const info = {
  name: 'stats',
  description: 'Show bot stats',
  fullDescription: 'Show bot stats'
}

async function action (msg, args) {
  const responder = new Responder(msg.channel)
  await pm2.describe(apps[0].name, async (err, processDescription) => {
    if (err) {
      console.error(err)
      return
    }

    const {
      monit,
      pm2_env
     } = processDescription[0]

    const uptime = moment.duration(moment().diff(moment(pm2_env.pm_uptime)))
                         .format('d[d] h[h] mm[m] ss[s]', { trim: false })

    await responder.embed({
      'color': 3731992,
      'footer': {
        'text': '♥'
      },
      'fields': [
        {
          'name': 'CPU Usage',
          'value': `${monit.cpu} %`,
          'inline': true
        },
        {
          'name': 'RAM Usage',
          'value': `${monit.memory / 1024 / 1024} MB`,
          'inline': true
        },
        {
          'name': 'Uptime',
          'value': uptime
        }
      ]
    }).send()
  })
}

function register (bot) {
  bot.registerCommand(info.name, action, info)
}

export default {
  info,
  register
}
