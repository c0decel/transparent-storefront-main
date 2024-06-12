export interface Thread {
    _id: string;
    Title: string;
    User: string;
    Username: string;
    Content: string;
    ReplyCount: number;
    PostedAtDate: string;
    PostedAtTime: string;
    Replies: [];
    Tags: [];
    Highlighted: boolean;
    LikedBy: [];
    DislikedBy: [];
    Bans: [];
  }