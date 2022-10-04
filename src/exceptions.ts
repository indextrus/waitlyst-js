export class Error {
    public message: string;
    public name: string;

    constructor(message: string, silent = false) {
        this.message = message;
        this.name = "waitlyst.js error";
        if (!silent) {
            console.error(this.name + ": " + this.message);
        }
    }
}

export class DocumentNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DocumentNotFoundError";
    }
}
export class ErrorPublishableKeyRequired extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DocumentNotFoundError";
    }
}

export class ElementDoesNotExist extends Error {
    constructor(message: string, silent: boolean) {
        super(message, silent);
        this.name = "ElementDoesNotExist";
    }
}

export class ErrorDuplicateIDsNotAllowed extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ErrorDuplicateIDsNotAllowed";
    }
}

export class MissingElementParams extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MissingElementParams";
    }
}

export class ErrorEmailIsRequired extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ErrorEmailIsRequired";
    }
}

export class ErrorEventRequired extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ErrorEventRequired";
    }
}

export class ErrorUserIdRequired extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ErrorUserIdRequired";
    }
}





