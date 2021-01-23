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
export class CurrentUser {
    token?: string;
    message: string;
    results: any;
}

export class User {
    userName: string;
    email: string;
    createdDate: Date;
    isApproved: boolean;
    date: any;
}

export class UserStatus {
    userEmail: string;
    userName: string;
    groupName: string;
    isActive: boolean;
}
