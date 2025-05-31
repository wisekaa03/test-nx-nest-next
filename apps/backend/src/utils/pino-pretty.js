const pinoPretty = require('pino-pretty');

exports.default = (opts) =>
  pinoPretty({
    ...opts,
    messageFormat: (
      log,
      messageKey,
      // levelLabel: string,
    ) => {
      const messageText = typeof log[messageKey] === 'object' ? JSON.stringify(log[messageKey]) : log[messageKey];
      const message = `[${log.context || 'NestApplication'}] ${messageText}`;

      delete log.context;
      return message;
    },
  });
