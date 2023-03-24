import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { commentLoadingState, commentState, videoIdsState } from '@/atom/comments';

export default function Search() {
    const [videoIds, setVideoIds] = useRecoilState(videoIdsState);
    const [comments, setComments] = useRecoilState(commentState);
    const [isLoadingComments, setIsLoadingComments] = useRecoilState(commentLoadingState);

    async function fetchComments() {
        if (!videoIds) return;
        setIsLoadingComments(true);
        const response = await axios.get(`/api/comments?videoIds=${videoIds}`);
        setComments(response.data);
        setIsLoadingComments(false);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        await fetchComments();
    }

    return (

        <div className="block inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <div className="mx-auto max-w-2xl w-full transform divide-y divide-gray-500 divide-opacity-10 overflow-hidden rounded-xl bg-white bg-opacity-80 shadow-2xl ring-1 ring-black ring-opacity-5 backdrop-blur backdrop-filter transition-all">
                        <div className="relative">
                            <MagnifyingGlassIcon
                                className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-900 text-opacity-40"
                                aria-hidden="true"
                            />
                            <input
                                type="text"
                                name="ytId"
                                id="ytId"
                                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 focus:ring-0 sm:text-sm"
                                placeholder="Enter video IDs separated by commas"
                                value={videoIds}
                                onChange={(e) => setVideoIds(e.target.value)}
                            />

                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoadingComments}
                        className="inline-flex my-3 items-center gap-x-1.5 rounded-md bg-indigo-600 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <MagnifyingGlassIcon
                            className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-900 text-opacity-40"
                            aria-hidden="true"
                        />
                        {isLoadingComments ? 'Loading...' : 'Fetch comments'}
                    </button>
                </div>
            </form>
        </div>
    )
}