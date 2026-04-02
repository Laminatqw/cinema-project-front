import { useEffect, useState } from "react";

interface SearchSelectProps<T> {
    items?: T[];
    fetchItems?: (query: string) => Promise<T[]>;
    fetchById?: (id: number) => Promise<T>; // для підвантаження початкового значення
    value: number | undefined;
    getLabel: (item: T) => string;
    getId: (item: T) => number;
    placeholder: string;
    onSelect: (id: number) => void;
}

const SearchSelect = <T,>({ items, fetchItems, fetchById, value, getLabel, getId, placeholder, onSelect }: SearchSelectProps<T>) => {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [asyncItems, setAsyncItems] = useState<T[]>([]);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    // підвантажуємо початкове значення при монтуванні або зміні value
    useEffect(() => {
        if (!value) { setSelectedItem(null); return; }

        // спочатку шукаємо в items або asyncItems
        const found = (items || asyncItems).find(i => getId(i) === value);
        if (found) { setSelectedItem(found); return; }

        // якщо не знайшли — підвантажуємо через fetchById
        if (fetchById) {
            fetchById(value).then(item => setSelectedItem(item));
        }
    }, [value]);

    useEffect(() => {
        if (!fetchItems) return;
        const timeout = setTimeout(async () => {
            if (search.length < 1) return;
            const results = await fetchItems(search);
            setAsyncItems(results);
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const displayItems = fetchItems
        ? asyncItems
        : (items || []).filter(i => getLabel(i).toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ position: 'relative' }}>
            <input
                placeholder={placeholder}
                value={open ? search : selectedItem ? getLabel(selectedItem) : ''}
                onChange={e => { setSearch(e.target.value); setOpen(true); }}
                onFocus={() => { setSearch(''); setOpen(true); }}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
            />
            {open && displayItems.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: '#fff', border: '1px solid #ccc',
                    maxHeight: 200, overflowY: 'auto', zIndex: 100
                }}>
                    {displayItems.map(item => (
                        <div
                            key={getId(item)}
                            onMouseDown={() => { onSelect(getId(item)); setSelectedItem(item); setOpen(false); }}
                            style={{ padding: '6px 10px', cursor: 'pointer' }}
                        >
                            {getLabel(item)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchSelect;