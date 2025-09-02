class ExpressError extends Error {
    constructor(statusCode, message) {
        super();             // call parent Error constructor
        this.statusCode = statusCode;
        this.message=message;
    }
}

module.exports = ExpressError;
