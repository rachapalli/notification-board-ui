export class Groups {
    groupId: number;
    groupName: string;
    isPublic: boolean
    createdBy: number;
    createdDate: Date;
    isActive: boolean;
}

export class GroupNotificationModel{
    groupId: number;
    groupName: string;
    notificationId: number
    message = new MessageCls();
    notificationType: string;
    file = new File();
    createdBy: number;
    createdDate: Date;
    description: string;
}

export class MessageCls{
    message: string;
    messageId: number;
}

export class File{
    fileId: number;
    fileKey: string;
    name: string;
}

export class CreateGroupModel {
    groupId: number;
    message: string;
    createdBy: number;
    notificationId: number;
    fileKey: string;
    fileId: number;
    updatedBy: number;
    notification = new GroupNotificationModel();
    fileFormat: string;
}