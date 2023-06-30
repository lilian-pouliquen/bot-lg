// Check if the user has the given role
exports.userHasRole = async function userHasRole(_interaction, _roleId) {
    return null !== await _interaction.member.roles.resolve(_roleId);
}

// Create logs in files
exports.createLog = function createLog(_guildId, _label, _severity, _message) {
    const { createLogger, transports, format } = require('winston');
    const { combine, label, printf } = format;

    const logFormat = printf(({ label, level, message }) => {
        return `${getLogDate()} [${label}] ${level.toUpperCase()}: ${message}`;
    });
    const logger = createLogger({
        format: combine(
            label({ label: _label }),
            logFormat
        ),
        transports: [
            new transports.File({ filename: `/app/logs/${_guildId}.log` })
        ]
    });

    logger.log({
        level: _severity,
        message: _message
    });
}

// Build a date string for logging with the format 'YYYY-MM-DD HH:mm:ss'
getLogDate = function getLogDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${(month < 10) ? "0" : ""}${month}-${(day < 10) ? "0" : ""}${day} ${(hours < 10) ? "0" : ""}${hours}:${(minutes < 10) ? "0" : ""}${minutes}:${(seconds < 10) ? "0" : ""}${seconds}`
}
