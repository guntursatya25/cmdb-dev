import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const handlePageClick = (page) => {
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; 
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || 
                i === totalPages || 
                (i >= currentPage - 1 && i <= currentPage + 1) 
            ) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageClick(i)}
                        className={`px-3 py-1 mx-1 rounded ${i === currentPage ? 'bg-[#005fb8] text-white' : 'bg-gray-200 hover:bg-blue-100'}`}
                    >
                        {i}
                    </button>
                );
            } else if (
                (i === currentPage - 2 || i === currentPage + 2) &&
                i !== 1 &&
                i !== totalPages
            ) {
               
                pageNumbers.push(
                    <span key={`ellipsis-${i}`} className="px-2">
                        ...
                    </span>
                );
            }
        }

        return pageNumbers;
    };

    return (
        <div className="flex items-center justify-center mt-6 space-x-2">
            <button
                onClick={handlePrevious}
                className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-  text-gray-500 cursor-not-allowed' : 'bg-[#0a89ff] text-white hover:bg-[#0a89ff]'}`}
                disabled={currentPage === 1}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M14.71 15.88L10.83 12l3.88-3.88a.996.996 0 1 0-1.41-1.41L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0c.38-.39.39-1.03 0-1.42"/></svg>
            </button>
            {renderPageNumbers()}
            <button
                onClick={handleNext}
                className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0a89ff] text-white hover:bg-[#0a89ff]'}`}
                disabled={currentPage === totalPages}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M9.29 15.88L13.17 12L9.29 8.12a.996.996 0 1 1 1.41-1.41l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3a.996.996 0 0 1-1.41 0c-.38-.39-.39-1.03 0-1.42"/></svg>
            </button>
        </div>
    );
};

export default Pagination;
