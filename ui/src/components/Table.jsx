import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'


export default function TableView({ rows, title }) {


    return (
        <TableContainer component={Paper}>
            <Table  aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>{title.toUpperCase()}</TableCell>
                        <TableCell align="right">{"%"}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(rows).map((row) => (
                        <TableRow
                            key={row}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {rows[row].month}
                            </TableCell>
                            <TableCell align="right">{rows[row].value}</TableCell>
                            
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}




