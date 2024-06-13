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
    Reactions: {
      Username: string;
      Type: string;
    }[];
    ReactionScore: number;
    PostBan: boolean;
    ReplyingTo: {
      UserID: string;
      Username: string;
    }
    MostRecentReactions: {
      Username: string;
      Type: string;
      Icon: string;
    }[];
  }