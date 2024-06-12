export interface Post {
    _id: string;
    Thread: string;
    User: string;
    Username: string;
    Content: string;
    ReplyNumber: number;
    PostedAtDate: string;
    PostedAtTime: string;
    Highlighted: boolean;
    LikedBy: [];
    DislikedBy: [];
    ReactionScore: number;
    PostBan: boolean;
    ReplyingTo: {
      UserID: string;
      Username: string;
    }
  }