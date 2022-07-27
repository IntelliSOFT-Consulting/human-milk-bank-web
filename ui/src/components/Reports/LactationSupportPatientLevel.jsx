import { Stack, TextField, Button, Container, useMediaQuery, Snackbar } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import { DataGrid } from '@mui/x-data-grid';


export default function LactationSupportPatientLevel({ results }) {
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)

    const [selectionModel, setSelectionModel] = useState([]);

    const columns = [
        { field: 'ipNumber', headerName: 'IP Number', width: 120, editable: true },
        { field: 'patientNames', headerName: "Mother's Name", width: 200, editable: true },
        { field: 'babyNames', headerName: "Baby receiving feeds", width: 200, editable: true },
        { field: 'dob', headerName: 'Date of birth', width: 150, editable: true },
        { field: 'lactationInitiatedAt', headerName: 'Time they inititate lactation', width: 200 },
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