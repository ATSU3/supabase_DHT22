// App.js
import React from 'react';
import AreaTable from './AreaTable';
import '../scss/components/table.scss'

const Table = () => {
    return (
        <div className='table'>
            <AreaTable area_id={1} />
            <AreaTable area_id={2} />
            <AreaTable area_id={3} />
        </div>
    );
};

export default Table;
