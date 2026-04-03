import { useEffect } from 'react';
import './styles.css'
import {sessionActions} from "../../redux/slices/sessionSlice";
import {useAppDispatch} from "../../redux/store";

interface IProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    pageSize: number
    onPageSizeChange: (size: number) => void
    storageKey?: string
}

const PaginationComponent = ({
                                 currentPage, totalPages, onPageChange,
                                 pageSize, onPageSizeChange, storageKey
                             }: IProps) => {



    useEffect(() => {
        if (!storageKey) return;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const { page, size } = JSON.parse(saved);
            if (size && size !== pageSize) onPageSizeChange(size);
            if (page && page !== currentPage) onPageChange(page);
        }
    }, []);

    useEffect(() => {
        if (!storageKey) return;
        localStorage.setItem(storageKey, JSON.stringify({ page: currentPage, size: pageSize }));
    }, [currentPage, pageSize]);

    const range = 1;

    const getPages = () => {
        const pages: (number | string)[] = [];
        const start = Math.max(2, currentPage - range);
        const end = Math.min(totalPages - 1, currentPage + range);
        pages.push(1);
        if (start > 2) pages.push('...');
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push('...');
        if (totalPages > 1) pages.push(totalPages);
        return pages;
    };

    const pages = getPages();

    const handleSizeChange = (size: number) => {
        onPageSizeChange(size);
        onPageChange(1);
        window.location.reload();
    };



    return (
        <div className="pagination-wrapper">
            <div className="page-size">
                <span>Show:</span>
                <select
                    value={pageSize}
                    onChange={(e) => handleSizeChange(Number(e.target.value))}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>←</button>
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
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>→</button>
            </div>
        </div>
    );
};

export default PaginationComponent;