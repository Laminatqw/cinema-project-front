import {FC, useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom";
import {movieServices} from "../../services/movie.services";
import {IMovie} from "../../models/IMovie";
import './styles.css';
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
            <div ref={ref} className={'movie-search'}>
                <input
                    className={'movie-search__input'}
                    type="text"
                    placeholder="Пошук фільму..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                />

                {isOpen && results.length > 0 && (
                    <ul className={'movie-search__results'}>
                        {results.map(movie => (
                            <li className={'movie-search__item'} key={movie.id}>
                                <Link
                                    className={'movie-search__link'}
                                    to={`/movies/${movie.id}`}
                                    onClick={() => {
                                        setIsOpen(false)
                                        setValue('')
                                    }}
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