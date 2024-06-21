export interface Thread {
    _id: string;
    Title: string;
    User: {
      Username: string;
      _id: string;
      ProfileImage: string;
    };
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