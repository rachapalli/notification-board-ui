export class Groups {
    groupId: number;
    groupName: string;
    isPublic: boolean
    createdBy: number;
    createdDate: Date;
}

export class GroupNotificationModel{
    groupId: number;
    groupName: string;
    notificationId: number
    message: string;
    notificationType: string;
    fileId: number;
    createdBy: number;
    createdDate: Date;
}

export class CreateGroupModel {
    groupId: number;
    message: string;
    createdBy: number;
    notificationId: number;
}