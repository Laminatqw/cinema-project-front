import React from 'react';
import {Link, Outlet} from "react-router-dom";
import './styles.css'
const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2 className="admin-sidebar__logo">🎬 Admin</h2>

                <nav className="admin-sidebar__nav">
                    <Link to="/admin" className="admin-sidebar__link">Dashboard</Link>
                    <Link to="/admin/movies" className="admin-sidebar__link">Фільми</Link>
                    <Link to="/admin/halls" className="admin-sidebar__link">Зали</Link>
                    <Link to="/admin/genres" className="admin-sidebar__link">Жанри</Link>
                    <Link to="/admin/sessions" className="admin-sidebar__link">Сесії</Link>
                </nav>
            </aside>

            <div className="admin-content">
                <header className="admin-header">
                    <h3 className="admin-header__title">Адмін панель</h3>
                </header>

                <main className="admin-main">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;