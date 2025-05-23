import { useState, useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (data = [], itemsPerPage = 10) => {
    const [visibleData, setVisibleData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef(null);

    useEffect(() => {
        const start = 0;
        const end = page * itemsPerPage;
        const sliced = data.slice(start, end);
        setVisibleData(sliced);
        setHasMore(end < data.length);
    }, [data, page, itemsPerPage]);

    const lastElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, {
            root: document.querySelector('.doctor-selection'),
            rootMargin: '0px',
            threshold: 1.0
        });

        if (node) observer.current.observe(node);
    }, [hasMore]);

    const resetPage = () => setPage(1);

    return {
        visibleData,
        lastElementRef,
        hasMore,
        resetPage,
    };
};