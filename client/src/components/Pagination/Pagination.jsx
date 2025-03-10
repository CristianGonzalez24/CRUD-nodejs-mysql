import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css'
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="pagination">
            <button 
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft size={20} />
            </button>

            <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                        key={page}  
                        className={`pagination-number ${page === currentPage ? 'active' : ''}`}    
                        onClick={() => onPageChange(page)}  
                    >   
                        {page}
                    </button>    
                ))}
            </div>

            <button 
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    )
}

export default Pagination