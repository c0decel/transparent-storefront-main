export interface Post {
    _id: string;
    Thread: string;
    User: string;
    Username: string;
    Content: string;
    LikedBy: [];
    DislikedBy: [];
    ReplyNumber: number;
    PostedAtDate: string;
    PostedAtTime: string;
    Highlighted: boolean;
    ReactionScore: number;
    PostBan: boolean;
    ReplyingTo: {
      UserID: string;
      Username: string;
    }
  }