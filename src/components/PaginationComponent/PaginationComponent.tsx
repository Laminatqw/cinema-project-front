import './styles.css'

interface IProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    pageSize: number
    onPageSizeChange: (size: number) => void
}


const PaginationComponent = ({
                                 currentPage,
                                 totalPages,
                                 onPageChange,
                                 pageSize,
                                 onPageSizeChange
                             }: IProps) => {


    const range = 1;

    const getPages = () => {
        const pages: (number | string)[] = [];

        const start = Math.max(2, currentPage - range);
        const end = Math.min(totalPages - 1, currentPage + range);

        pages.push(1);

        if (start > 2) pages.push('...');

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) pages.push('...');

        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    const pages = getPages();

    return (
        <div className="pagination-wrapper">

            {/* 🔹 Page size selector */}
            <div className="page-size">
                <span>Show:</span>
                <select
                    value={pageSize}
                    onChange={(e) => {
                        onPageSizeChange(Number(e.target.value));
                        onPageChange(1); // reset page
                    }}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {/* 🔹 Pagination */}
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    ←
                </button>

                {pages.map((page, index) =>
                    page === '...' ? (
                        <span key={`dots-${index}`} className="dots">...</span>
                    ) : (
                        <button
                            key={`page-${page}-${index}`}
                            onClick={() => onPageChange(Number(page))}
                            className={page === currentPage ? 'active' : ''}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    →
                </button>
            </div>

        </div>
    );
};

export default PaginationComponent;