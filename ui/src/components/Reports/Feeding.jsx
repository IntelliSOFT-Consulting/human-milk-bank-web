import { Modal, Box, Grid, Container, Typography, useMediaQuery, Snackbar, Alert, LinearProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import { DataGrid } from '@mui/x-data-grid';
import { getCookie } from '../../lib/cookie';
import { apiHost } from '../../lib/api'
import * as Plotly from 'plotly.js-dist'

export default function Feeding({ results }) {
    let navigate = useNavigate()
    let [traces, setTraces] = useState([])
    let [open, setOpen] = useState(false)
    let [openModal, setOpenModal] = useState(false)
    let [message, setMessage] = useState(false)
    let [selected, setSelected] = useState(null)
    let [loading, setLoading] = useState(false)
    let [data, setData] = useState(null)
    let [loadChart, setLoadChart] = useState(false)


    let getFeedDistributionData = async (patientId) => {
        setLoading(true)
        let res = await (await fetch(`${apiHost}/statistics/feeding/feed-distribution/${patientId}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` },
            arg: JSON.stringify()
        })).json()
        if (res.status === "success") {
            setData(res.report)
        }
        setLoading(false)
        return res
    }


    let getFeedDistribution = async (patientId) => {
        setOpenModal(true)
        let report = await getFeedDistributionData(patientId)
        let _traces = []
        if (report.status === "success") {
            Object.keys(report.report.feedingTimes).map((period) => {
                _traces.push({
                    x: Object.keys(report.report.feedingTimes[period]).map(x => { return x }),
                    y: Object.keys(report.report.feedingTimes[period]).map(x => { return report.report.feedingTimes[period][x] }),
                    name: period,
                    type: "bar"
                })
            })
        }
        let layout = { barmode: 'group' };
        if (_traces.length > 0) {
            console.log(_traces)
            Plotly.newPlot('feedDistribution', _traces, layout)
            return
        }
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
        setData(null)
        setSelected(null)
        return
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
                onClose={e => { console.log(e) }}
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
                    <Box sx={{ ...modalStyle, width: "80%", borderRadius: "10px" }}>
                        <Grid container
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item xs={12} lg={12} md={12}>

                                {data && <><Typography variant="h6" sx={{ textDecoration: "underline" }}>Patient Details</Typography>
                                    <Typography variant="p">IP Number: <b>{data && data.patient.ipNumber}</b></Typography><br />
                                    <Typography variant="p">Baby Name: <b>{data && data.patient.babyNames}</b></Typography><br />
                                    <Typography variant="p">Date of birth: <b>{data && data.patient.dob}</b></Typography></>}


                                <Typography sx={{ textAlign: "center" }} variant="h5">Feed distribution within 24 hours</Typography>
                                {!data && <>
                                    <br />

                                    <LinearProgress />
                                </>}
                                {data &&
                                    <Grid container justifyContent={"center"}>
                                        <Grid item xs={12} md={12} lg={10} sx={{ border: "1px solid grey", borderRadius: "10px" }}>
                                            <div id="feedDistribution"></div>
                                        </Grid>
                                    </Grid>}

                            </Grid>
                        </Grid>
                    </Box>
                </Modal>

            </Container>
        </>
    )

}




