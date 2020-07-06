export class User {
    public username: string;

    public socketId: string;
    public roomId: string;

    constructor(username: string) {
        this.username = username;
    };
}
