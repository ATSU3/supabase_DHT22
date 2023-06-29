import supabase from '../config/supabaseClient';
import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';

const Table = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let { data: sensorData, error } = await supabase
                .from('test')
                .select('temperature, humidity, created_at');

            if (error) console.error('Error fetching sensor data', error);
            else setData(sensorData);
        };

        fetchData();
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Temperature',
                accessor: 'temperature',
            },
            {
                Header: 'Humidity',
                accessor: 'humidity',
            },
            {
                Header: 'Created At',
                accessor: 'created_at',
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default Table;
