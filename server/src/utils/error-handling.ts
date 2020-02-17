export const sendError = (res, status, message) => error => {
    res.status(status || error.status).json({
        type: 'error',
        message: message || error.message,
        error
    })
}

module.exports = sendError;