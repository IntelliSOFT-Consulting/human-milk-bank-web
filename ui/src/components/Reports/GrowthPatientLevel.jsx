import { Stack, TextField, Button, Container, useMediaQuery, Snackbar } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import { DataGrid } from '@mui/x-data-grid';


export default function GrowthPatientLevel({ results }) {
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)

    const [selectionModel, setSelectionModel] = useState([]);

    const columns = [
        { field: 'ipNumber', headerName: 'IP Number', width: 100, editable: true },
        { field: 'babyNames', headerName: "Baby's names", width: 150, editable: true },
        { field: 'durationOfStay', headerName: 'Duration of Stay', width: 150, editable: true },
        { field: 'weightLoss', headerName: 'Weight Loss', width: 150 },
    ];

    let isMobile = useMediaQuery('(max-width:600px)');
    return (
        <>

            <br />
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={""}
                message={message}
                key={"loginAlert"}
            />

            <br />
            <Container maxWidth="lg">
                <br />
                {results.length > 0 && <DataGrid
                    loading={!results}
                    rows={results ? results : []}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    autoHeight
                    disableSelectionOnClick={true}
                    onCellEditStop={e => { console.log(e) }}
                />}
            </Container>
        </>
    )

}




