import React from 'react';
import {Link, Outlet} from "react-router-dom";

const AdminLayout = () => {
    return (
        <div style={{display: 'flex'}}>
            <aside style={{width: '200px', display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px'}}>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/movies">Управління фільмами</Link>
                <Link to="/admin/halls">Додати зал</Link>
                <Link to={"/admin/genres"}>Управління жанрами</Link>
            </aside>

            <main style={{flex: 1, padding: '20px'}}>
                <Outlet/>
            </main>
        </div>
    );
};

export default AdminLayout;