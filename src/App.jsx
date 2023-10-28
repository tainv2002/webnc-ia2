import { useState } from "react";
import { useEffect } from "react";
import "nprogress/nprogress.css";
import nProgress from "nprogress";
import InfiniteScroll from "react-infinite-scroll-component";

const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const initialPagination = {
    currentPage: 1,
    totalPages: 1,
};

function App() {
    const [img, setImg] = useState("");
    const [res, setRes] = useState([]);
    const [pagination, setPagination] = useState(initialPagination);

    useEffect(() => {
        fetchRequest();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.currentPage]);

    const fetchRequest = async () => {
        if (!img) return;
        nProgress.start();

        const data = await fetch(
            `https://api.unsplash.com/search/photos?page=${pagination.currentPage}&query=${img}&client_id=${accessKey}&per_page=12`
        );
        const dataJ = await data.json();
        const result = dataJ.results;
        setRes((prev) => [...prev, ...result]);
        setPagination((prev) => ({ ...prev, totalPages: dataJ.total_pages }));

        nProgress.done();
    };

    const submit = (event) => {
        event.preventDefault();
        setRes([]);
        setPagination(initialPagination);
        fetchRequest();
    };

    const fetchMorePhotos = () => {
        if (pagination.currentPage < pagination.totalPages) {
            setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
            }));
        }
    };

    return (
        <>
            <div className="container mx-auto py-6">
                <form className="block w-full" onSubmit={submit}>
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="outline-none block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search Photos..."
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {res && res.length > 0 && (
                    <InfiniteScroll
                        dataLength={res.length} //This is important field to render the next data
                        next={fetchMorePhotos}
                        hasMore={pagination.currentPage < pagination.totalPages}
                        loader={<h4>Loading...</h4>}
                        endMessage={
                            <p style={{ textAlign: "center" }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                        // below props only if you need pull down functionality
                    >
                        <div className="grid grid-cols-4 gap-4 mt-10">
                            {res.map((val) => {
                                return (
                                    <div key={val.id}>
                                        <img
                                            className="w-full h-full object-cover"
                                            src={val.urls.small}
                                            alt={val.alt_description}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </InfiniteScroll>
                )}

                {res && res.length === 0 && (
                    <div className="mt-10">No photos result</div>
                )}
            </div>
        </>
    );
}

export default App;
