import React, { useMemo } from 'react';
import styles from './FormResponses.module.css';

const Table = ({ data }) => {
    // Dynamically generate columns from the response data
    const columns = useMemo(() => {
        const headers = new Set();

        // Always add 'Submitted at' as the first column
        headers.add('Submitted at');

        // Collect all unique element labels from responses
        data.forEach(response => {
            response.responses.forEach(r => {
                headers.add(r.elementLabel);
            });
        });

        // Convert headers to column configurations
        return Array.from(headers).map(header => ({
            header,
            accessor: (row) => {
                if (header === 'Submitted at') {
                    return new Date(row.startedAt).toLocaleString();
                }
                const response = row.responses.find(r => r.elementLabel === header);
                return response ? response.response : '';
            }
        }));
    }, [data]);

    const formatCellValue = (value) => {
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        return value;
    };

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.responseTable}>
                <thead>
                    <tr>
                        <th className={styles.checkboxCell}>
                           
                        </th>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                        <th>Logs</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>
                               <p>{rowIndex+1}</p>
                            </td>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {formatCellValue(column.accessor(row))}
                                </td>
                            ))}
                            <td>
                                <button className={styles.logsButton}>See logs</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;