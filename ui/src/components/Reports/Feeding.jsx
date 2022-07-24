import { Stack, TextField, Button, Container, useMediaQuery, Snackbar } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import { DataGrid } from '@mui/x-data-grid';


export default function Feeding({ results }) {
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)

    const [selectionModel, setSelectionModel] = useState([]);

    const columns = [
        { field: 'ipNumber', headerName: 'IP Number', width: 100, editable: true },
        { field: 'patientNames', headerName: "Patient names", width: 200, editable: true },
        { field: 'dob', headerName: 'Date of birth', width: 200, editable: true },
        { field: 'volumeReceived', headerName: 'Volume received', width: 150 },
        { field: 'volumeOfMilkExpressed', headerName: 'Milk volume received', width: 150 },
        // { field: 'role', headerName: 'Date of Admission', width: 150 }
    ];

    let isMobile = useMediaQuery('(max-width:600px)');


    let args = qs.parse(window.location.search);

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
                    checkboxSelection
                    autoHeight
                    disableSelectionOnClick
                    onCellEditStop={e => { console.log(e) }}
                    onSelectionModelChange={(selection) => {
                        if (selection.length > 1) {
                            const selectionSet = new Set(selectionModel);
                            const result = selection.filter((s) => !selectionSet.has(s));

                            setSelectionModel(result);
                        } else {
                            setSelectionModel(selection);
                        }
                    }}
                />}
            </Container>
        </>
    )

}




