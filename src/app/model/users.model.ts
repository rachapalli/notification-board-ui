export class Users {
    userId: number;
    userName: string;
    password: string;
    email: string;
    alternateEmail: string;
    contactNumber: string;
    userType: string;
    constructor(userId: number, userName: string, password: string, email: string, alternateEmail: string, contactNumber: string, userType: string) {
        this.userId = userId;
        this.userName= userName;
        this.password= password;
        this.email= email;
        this.alternateEmail= alternateEmail;
        this.contactNumber= contactNumber;
        this.userType = userType;
    }
}
