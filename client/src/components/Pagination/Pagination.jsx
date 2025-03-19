import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const totalNumbers = 2;
        const totalBlocks = totalNumbers * 2 + 3;

        if (totalPages <= totalBlocks) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const startPage = Math.max(2, currentPage - totalNumbers);
        const endPage = Math.min(totalPages - 1, currentPage + totalNumbers);

        let pages = [1];

        if (startPage > 2) {
            pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) {
            pages.push('...');
        }

        pages.push(totalPages);
        return pages;
    };

    const pageNumbers = useMemo(() => getPageNumbers(), [totalPages, currentPage]);

    return (
        <div className="pagination">
            <button 
                aria-label="Go to first page"
                className="pagination-btn"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                <ChevronsLeft size={20} />
            </button>
            <button 
                aria-label="Go to previous page"
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft size={20} />
            </button>

            <div className="pagination-numbers">
                {pageNumbers.map((page, index) => (
                    <button 
                        key={index}  
                        className={`pagination-number ${page === currentPage ? 'active' : ''}`}   
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={typeof page !== 'number'}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >   
                        {page}
                    </button>    
                ))}
            </div>

            <button 
                aria-label="Go to next page"
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight size={20} />
            </button>
            <button 
                aria-label="Go to last page"
                className="pagination-btn"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                <ChevronsRight size={20} />
            </button>
        </div>
    )
}

export default Pagination