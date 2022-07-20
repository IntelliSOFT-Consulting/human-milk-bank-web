import { Paper, FormControl, Select, MenuItem, InputLabel, Grid, Container, Snackbar, CircularProgress, useMediaQuery, TextField, Typography, CardContent, Card, Alert } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';
import { apiHost, FhirApi } from './../lib/api'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import GeneralReport from '../components/Reports/GeneralReport';
import LactationSupport from '../components/Reports/LactationSupport';
// import Feeding from '../components/Reports/Feeding';
// import HMB from '../components/Reports/HMB';
// import InfantNutrition from '../components/Reports/InfantNutrition';
// import LactationSupport from '../components/Reports/LactationSupport';



export default function Reports() {
    let [patients, setPatients] = useState()
    let [data, setData] = useState({ fromDate: new Date().toISOString(), toDate: new Date().toISOString() })
    let navigate = useNavigate()
    let [report, selectReport] = useState()
    let [status, setStatus] = useState(null)
    let [results, setResults] = useState([])
    let [reports, setReports] = useState([])
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let [reportLevel, setReportLevel] = useState(false)

    let availableReports =
    {
        "General": { url: "/statistics/general" },
        "Feeding/BreastFeeding": { url: "/statistics/feeding" },
        "Lactation Support": { url: "/statistics/lactation-support" },
        // { "Infant Nutrition/Growth": InfantNutrition },
        // { "Human Milk Bank": HMB }
    }

    let getReport = async (dates = null) => {
        if (!dates) {
            if (!(data.fromDate <= data.toDate)) {
                setMessage("Invalid dates: *from date* must be less than or equal to *to date*")
                setOpen(true)
                return
            }
            if (report) {
                setStatus("loading")
                setResults([])
                try {
                    let data = (await (await fetch(`${apiHost}${availableReports[report].url}`,
                        {
                            method: 'GET',
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` },
                            arg: JSON.stringify()
                        }
                    )).json())
                    setMessage((data.status === "success") ? "Data fetched successfully" : "Data fetch error")
                    delete data.status
                    setResults(data.report)
                    setOpen(true)
                    setTimeout(() => { setOpen(false) }, 1500)
                    return
                } catch (error) {
                    setMessage(JSON.stringify(error))
                    setOpen(true)
                    setTimeout(() => { setOpen(false) }, 1500)
                    return
                }
            }
        }
    }

    useEffect(() => {
        getReport()
    }, [report])

    useEffect(() => {
        getReport()
    }, [data.toDate])
    useEffect(() => {
        getReport()
    }, [data.fromDate])


    useEffect(() => {
        if (getCookie("token")) {
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/reports")
            return
        }
    }, [])

    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    // console.log(args)

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Layout>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={open}
                        onClose={e => { setOpen(false) }}
                        message={message}
                        key={"loginAlert"}
                    />
                    <br />
                    <Grid container spacing={1} padding=".5em" >
                        <Grid item xs={12} md={12} lg={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Report</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Select Report"
                                    onChange={e => { selectReport(e.target.value); console.log(e.target.value) }}
                                    size="small"
                                >

                                    {availableReports && Object.keys(availableReports).map((k) => {
                                        return <MenuItem value={k}>{k}</MenuItem>

                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        {(report && results) &&
                            <>

                                <Grid item xs={12} md={12} lg={3}>
                                    {!isMobile ? <DesktopDatePicker
                                        label="From Date"
                                        inputFormat="yyyy-MM-dd"
                                        value={data.fromDate ? data.fromDate : (new Date().setFullYear(2000)).toISOString()}
                                        onChange={e => { console.log(e); setData({ ...data, fromDate: new Date(e).toISOString() }) }}
                                        renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                    /> :
                                        <MobileDatePicker
                                            label="From Date"
                                            inputFormat="yyyy-MM-dd"
                                            value={data.fromDate ? data.fromDate : (new Date().setFullYear(2000)).toISOString()}

                                            onChange={e => { console.log(e); setData({ ...data, fromDate: new Date(e).toISOString() }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        />}
                                </Grid>
                                <Grid item xs={12} md={12} lg={3}>
                                    {!isMobile ? <DesktopDatePicker
                                        label="To Date"
                                        inputFormat="yyyy-MM-dd"
                                        value={data.toDate ? data.toDate : (new Date().setHours(23)).toISOString()}
                                        onChange={e => { console.log(e); setData({ ...data, toDate: new Date(e).toISOString() }) }}
                                        renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                    /> :
                                        <MobileDatePicker
                                            label="To Date"
                                            inputFormat="yyyy-MM-dd"
                                            value={data.toDate ? data.toDate : (new Date().setHours(23)).toISOString()}
                                            onChange={e => { console.log(e); setData({ ...data, toDate: new Date(e).toISOString() }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        />}
                                </Grid>
                            </>
                        }

                    </Grid>

                    <Container maxWidth="lg">
                        {report && <Typography variant="h4" sx={{ textAlign: "center" }}>{report}</Typography>}
                        {(report && (results.length < 1)) ?
                            <>
                                <br /><br /><br />
                                <Paper sx={{ backgroundColor: "whitesmoke" }}>
                                    <br />
                                    <Typography variant="h5" sx={{ textAlign: "center" }}>Generating report...</Typography>
                                    <br />
                                    <CircularProgress sx={{ marginLeft: "47%" }} />
                                    <br /><br />
                                </Paper>
                            </>
                            :
                            (!report && <Alert severity="info" sx={{ textAlign: "center", maxWidth: "50%" }} >No Report Selected: Select one from the list</Alert>)}

                        <Grid container spacing={1} padding=".5em" >
                            {(report === "General") && <GeneralReport results={results || null} />}
                            {(report === "Lactation Support") && <LactationSupport results={results || null} />}


                        </Grid>
                    </Container>
                </Layout>
            </LocalizationProvider>
        </>
    )

}




