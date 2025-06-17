import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (data = [], itemsPerPage = 10, options = {}) => {
    const {
        threshold = 0.8,
        initialPage = 1,
        loadingDelay = 500 // Simulate loading for better UX
    } = options;

    const [displayedItems, setDisplayedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const lastElementRef = useRef();
    const loadingTimeoutRef = useRef();

    // Calculate if there are more items to load
    const calculateHasMore = useCallback((page, dataLength) => {
        return page * itemsPerPage < dataLength;
    }, [itemsPerPage]);

     // Load more items from the data array
    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        // Clear any existing timeout
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }

        // Simulate loading delay for better UX
        loadingTimeoutRef.current = setTimeout(() => {
            const startIndex = 0;
            const endIndex = currentPage * itemsPerPage;
            const newDisplayedItems = data.slice(startIndex, endIndex);
        
            setDisplayedItems(newDisplayedItems);
            setHasMore(calculateHasMore(currentPage, data.length));
            setCurrentPage(prev => prev + 1);
            setLoading(false);
        }, loadingDelay);
    }, [data, currentPage, itemsPerPage, loading, hasMore, loadingDelay, calculateHasMore]);

    // Reset hook when data changes
    const reset = useCallback(() => {
        setDisplayedItems([]);
        setCurrentPage(initialPage);
        setLoading(false);
        setHasMore(true);
        
        // Clear any pending loading timeout
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }
    }, [initialPage]);

    // Initialize with first page of data
    useEffect(() => {
        reset();
        
        // Load initial data
        if (data.length > 0) {
            const initialItems = data.slice(0, itemsPerPage);
            setDisplayedItems(initialItems);
            setHasMore(calculateHasMore(1, data.length));
            setCurrentPage(2); // Next page to load
        }
    }, [data, itemsPerPage, reset, calculateHasMore]);

    // Set up intersection observer for infinite scroll
    useEffect(() => {
        const options = {
            root: null, // use browser viewport as root
            rootMargin: '20px', // margin around root
            threshold
        };

        const handleObserver = (entries) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !loading) {
                loadMore();
            }
        };

        // Clean up previous observer
        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver(handleObserver, options);

        // Observe the last element if it exists
        if (lastElementRef.current) {
            observer.current.observe(lastElementRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [loadMore, hasMore, loading, threshold]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    // Create ref callback for the last element
    const lastElementRefCallback = useCallback((node) => {
        lastElementRef.current = node;
    }, []);

    return {
        displayedItems,
        loading,
        hasMore,
        reset,
        lastElementRef: lastElementRefCallback,
        // Additional utilities
        totalItems: data.length,
        currentPage: currentPage - 1,
        itemsPerPage,
        loadMore
    };
}

export default useInfiniteScroll