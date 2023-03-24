import { Comment } from "@prisma/client";
import { atom } from "recoil";

type CommentArray = {
  comments: Comment[];
};

type CommentData = {
  [x: string]: any;
  data: CommentArray[];
};


export const videoIdsState = atom({
  key: "videoIdsState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
export const commentState = atom<CommentData | null>({
  key: "commentState", // unique ID (with respect to other atoms/selectors)
  default: null
});
export const commentLoadingState = atom({
  key: "commentLoadingState", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});