import { Modal, Box, Grid, Container, Typography, useMediaQuery, Snackbar, Alert } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import { DataGrid } from '@mui/x-data-grid';


export default function Feeding({ results }) {
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [openModal, setOpenModal] = useState(false)
    let [message, setMessage] = useState(false)
    let [selected, setSelected] = useState(null)


    let getFeedDistribution = async (patientId) => {
        setOpenModal(true)
        return
    }

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    let handleClose = async () => {
        setOpenModal(false)
    }


    const columns = [
        { field: 'ipNumber', headerName: 'IP Number', width: 100, editable: true },
        { field: 'patientNames', headerName: "Patient names", width: 150, editable: true },
        { field: 'dob', headerName: 'Date of birth', width: 120, editable: true },
        { field: 'volumeReceived', headerName: 'Volume received', width: 150 },
        { field: 'volumeOfMilkExpressed', headerName: 'Volume expressed', width: 150 },
        { field: 'milkExpression', headerName: 'Expression frequency', width: 150 }
    ];

    let isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        console.log(selected)
        if (selected) {
            getFeedDistribution(selected)
        }
    }, [selected])

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
                {(results.length > 0) && <Alert severity="error">Select a patient from the list to view their Feed Distribution Chart</Alert>}
                <p></p>
                {results.length > 0 && <DataGrid
                    loading={!results}
                    rows={results ? results : []}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    autoHeight
                    selectionModel={selected ? selected : undefined}
                    disableSelectionOnClick
                    onCellEditStop={e => { console.log(e) }}
                    onSelectionModelChange={e => { setSelected(e[e.length - 1]) }}
                />}
                <Modal keepMounted
                    open={openModal}
                    onClose={handleClose}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box sx={{ ...modalStyle, width: "80%", borderRadius:"10px" }}>
                        <Grid container
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item xs={12} lg={12} md={12}>

                                <Typography variant="h6" sx={{textDecoration:"underline"}}>Patient Details</Typography>
                                <Typography variant="p">IP Number</Typography><br />
                                <Typography variant="p">Baby Name</Typography><br />
                                <Typography variant="p">Date of birth</Typography>


                                <Typography sx={{ textAlign: "center" }} variant="h5">Feed distribution within 24 hours</Typography>


                            </Grid>
                        </Grid>
                    </Box>
                </Modal>

            </Container>
        </>
    )

}




