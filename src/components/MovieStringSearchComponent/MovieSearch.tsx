import {FC, useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom";
import {movieServices} from "../../services/movie.services";
import {IMovie} from "../../models/IMovie";
const MovieSearch: FC = () => {
        const [value, setValue] = useState('')
        const [results, setResults] = useState<IMovie[]>([])
        const [isOpen, setIsOpen] = useState(false)
        const ref = useRef<HTMLDivElement>(null)

        // debounce пошук
        useEffect(() => {
            if (!value.trim()) {
                setResults([])
                setIsOpen(false)
                return
            }

            const timeout = setTimeout(async () => {
                const response = await movieServices.getAll({ name: value })
                setResults(response.data)
                setIsOpen(true)
            }, 300)

            return () => clearTimeout(timeout)
        }, [value])

        // закрити при кліку поза компонентом
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (ref.current && !ref.current.contains(e.target as Node)) {
                    setIsOpen(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }, [])

        return (
            <div ref={ref} style={{ position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Пошук фільму..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                />

                {isOpen && results.length > 0 && (
                    <ul style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}>
                        {results.map(movie => (
                            <li key={movie.id}>
                                <Link
                                    to={`/movies/${movie.id}`}
                                    onClick={() => {
                                        setIsOpen(false)
                                        setValue('')
                                    }}
                                    style={{ display: 'block', padding: '8px 12px' }}
                                >
                                    {movie.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
    }

    export default MovieSearch;