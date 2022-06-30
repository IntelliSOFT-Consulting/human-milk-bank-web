import { Stack, FormControl, Select, MenuItem, InputLabel, Grid, Container, Snackbar, CircularProgress, useMediaQuery, TextField, Typography, CardContent, Card } from '@mui/material'
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

    let availableReports = {
        "General": [{ totalBabies: "Total Number of Babies" }, { "preterm": "Number of Preterm Babies" },
        { "term": "Number of Term Babies" }],
        "Feeding/BreastFeeding": [],
        "Lactation Support": [],
        "Infant Nutrition/Growth": [],
        "Human Milk Bank": []
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
                    let data = (await (await fetch(`${apiHost}/statistics?${new URLSearchParams(
                        {
                            reports: JSON.stringify(availableReports[`${report}`].map((r) => {
                                return Object.keys(r)[0]
                            })),
                        })}`,
                        {
                            method: 'GET',
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` },
                            arg: JSON.stringify()
                        }
                    )).json())
                    setMessage((data.status === "success") ? "Data fetched successfully" : "Data fetch error")
                    delete data.status
                    setResults(data)
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
        } else {
            if (data.report.type === "query") {

                if (!(data.fromDate <= data.toDate)) {
                    setMessage("Invalid dates: *from date* must be less than or equal to *to date*")
                    setOpen(true)
                    return
                }
                try {
                    setStatus("loading")
                    setResults(null)
                    let res = await FhirApi({ url: `/fhir${data.report.q}&_lastUpdated=ge${data.fromDate}&_lastUpdated=le${data.toDate}`, method: 'GET' })
                    console.log(res.data[data.report.query])
                    setResults({ results: res.data[data.report.query], description: data.report.description })
                    setStatus(null)
                    return
                }
                catch (e) {
                    setMessage(JSON.stringify(e))
                    setOpen(true)
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
        let _reports = []
        results && Object.keys(results).map((result) => {
            console.log(result)
            for (let r of availableReports[report]) {
                if (result === Object.keys(r)[0]) {
                    _reports.push(r)
                    // console.log(r)

                }
            }
        })
        setReports(_reports)
        console.log("Reports: ", reports)
        return

    }, [results])

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
                                <Typography>Loading...</Typography>
                                <CircularProgress />
                            </>
                            :
                            (!report && <Typography sx={{ textAlign: "center" }}>Select a report from the list</Typography>)}

                        <Grid container spacing={1} padding=".5em" >
                            {/* {JSON.stringify(reports)} */}
                            {(reports.length > 0) ? reports.map((report) => {
                                return <Grid item xs={12} md={12} lg={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography>{report[(Object.keys(report)[0])]}</Typography>
                                            <Typography variant="h3">{results[(Object.keys(report)[0])]}</Typography>

                                        </CardContent>
                                    </Card>
                                </Grid>
                            }) :
                                ((results.length > 0) && <Typography sx={{ textAlign: "center" }}>No reports defined</Typography>)
                            }
                        </Grid>
                    </Container>
                </Layout>
            </LocalizationProvider>
        </>
    )

}




