//& A custom error function with added info 
class CustomError extends Error {
    constructor(statusCode, status, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
    } 
}

module.exports = CustomError ;