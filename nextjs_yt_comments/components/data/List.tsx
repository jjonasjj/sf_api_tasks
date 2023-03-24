import { commentLoadingState, commentState } from "@/atom/comments";
import { Comment } from "@prisma/client";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export default function List() {

  const [comments, setComments] = useRecoilState(commentState);
  const [isLoadingComments, setIsLoadingComments] = useRecoilState(commentLoadingState);

  useEffect(() => {
    console.log('comments >>>', comments)
  }, [comments])

  return (
    <>
      {!isLoadingComments && (comments === null) && (

        <ul role="list" className="divide-y divide-gray-200 flex justify-center items-center">
          No comments loaded.
        </ul>
      )}
      {!isLoadingComments && (comments !== null) && (
        <ul role="list" className="divide-y divide-gray-200">
          {comments?.map((commentArr: any) =>
            commentArr.comments?.map((commentItem: any) => (
              <li
                key={commentItem.id}
                className={"relative bg-white py-5 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 hover:bg-gray-50 "}
              >
                <div className="flex justify-between space-x-3">
                  <div className="min-w-0 flex-1">
                    <a href="#" className="block focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="truncate text-sm font-medium text-gray-900">{commentItem.authorName}</p>
                      <p className="truncate text-sm text-gray-500">{commentItem.authorUrl}</p>
                    </a>
                  </div>
                  <div className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
                    {commentItem.publishedAt.toString()}
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-gray-600 line-clamp-2">{commentItem.text}</p>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-gray-600 line-clamp-2">From DB: {((commentItem.fromDb) ? 'Yes' : 'No')}</p>
                </div>
              </li>

            ))
          )}
        </ul>
      )}

    </>
  )

}