import BaseCommand from './../baseCommand'
import Responder from './../../lib/messages/responder'

export default class DisableCmd extends BaseCommand {
  constructor (bot) {
    const info = {
      name: 'disable',
      usage: 'disable <command> [guild|channel]',
      description: 'Disables a command',
      fullDescription: 'Disables a command',
      argsRequired: true,
      requirements: {
        permissions: {
          'manageGuild': true
        }
      },
      permissionMessage: 'You need the "Manage Guild" permission to set this.',
      invalidUsageMessage: 'Specify a command',
      guildOnly: true
    }
    super(info, bot)
  }

  async action (msg, args, parsedArgs) {
    const cmdName = parsedArgs._[0]
    const responder = new Responder(msg.channel)

    if (!this.bot.cmdNames.includes(cmdName)) {
      return responder.error(`Command ${cmdName} doesn't exists`).send()
    }

    if (parsedArgs._[1] && (parsedArgs._[1] !== 'guild' && parsedArgs._[1] !== 'channel')) {
      return responder.error(`${parsedArgs._[1]} is not a valid scope. Use "guild" or "channel"`, 10).send()
    }

    let channelIds = [msg.channel.id]
    let scope = '**channel**'
    if (parsedArgs._[1] === 'guild') {
      channelIds = msg.channel.guild.channels.filter((c) => c.type === 0).map((c) => c.id)
      scope = '**guild**'
    }

    await this.redisClient.sadd(`cmd_disable:${msg.channel.guild.id}:${cmdName}`, ...channelIds)
    return responder.success(`Succesfully disabled command ${cmdName} on this ${scope}`).send()
  }
}
