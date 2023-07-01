import supabase from '../config/supabaseClient';
import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import ExportCSV from './ExportCSV';

const MAX_ROWS = 6;

const Table = () => {
    const [data, setData] = useState([]);
    const [numRows, setNumRows] = useState(MAX_ROWS);

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
                Cell: ({ value }) => {
                    const dateObj = new Date(value);
                    const date = dateObj.toLocaleDateString();
                    let time = dateObj.toLocaleTimeString();
                    // time = time.slice(0, time.lastIndexOf(":"));秒を消す
                    return `${date} ${time}`;
                }
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
    } = useTable({ columns, data: data.slice(0, numRows) });

    return (
        <div>
            <ExportCSV csvData={data} fileName={"test_data"} />
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
            {numRows < data.length &&
                <button onClick={() => setNumRows(numRows + MAX_ROWS)}>More</button>
            }
            {numRows > MAX_ROWS &&
                <button onClick={() => setNumRows(numRows - MAX_ROWS)}>Less</button>
            }
        </div>
    );
};

export default Table;
