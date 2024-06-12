export interface Notification {
    Status: string;
    Type: string;
    Header: string;
    UserLink: {
        UserID: string;
        Username: string;
    };
    PostLink: string;
    ThreadLink: {
        ThreadID: string;
        ThreadName: string;
    };
    Content: string;
    NotifDate: string;
    NotifTime: string;
}