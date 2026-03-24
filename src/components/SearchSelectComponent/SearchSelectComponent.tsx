import { useState } from "react";

interface SearchSelectProps<T> {
    items: T[];
    value: number | undefined;
    getLabel: (item: T) => string;
    getId: (item: T) => number;
    placeholder: string;
    onSelect: (id: number) => void;
}

const SearchSelect = <T,>({ items, value, getLabel, getId, placeholder, onSelect }: SearchSelectProps<T>) => {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const selected = items.find(i => getId(i) === value);
    const filtered = items.filter(i => getLabel(i).toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ position: 'relative' }}>
            <input
                placeholder={placeholder}
                value={open ? search : selected ? getLabel(selected) : ''}
                onChange={e => { setSearch(e.target.value); setOpen(true); }}
                onFocus={() => { setSearch(''); setOpen(true); }}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
            />
            {open && filtered.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: '#fff', border: '1px solid #ccc',
                    maxHeight: 200, overflowY: 'auto', zIndex: 100
                }}>
                    {filtered.map(item => (
                        <div
                            key={getId(item)}
                            onMouseDown={() => { onSelect(getId(item)); setOpen(false); }}
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
