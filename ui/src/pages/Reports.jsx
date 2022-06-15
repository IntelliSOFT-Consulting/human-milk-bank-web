import { Stack, FormControl, Select, MenuItem, InputLabel, Grid, Container, Snackbar, CircularProgress, useMediaQuery, TextField, Typography, CardContent, Card } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';
import { FhirApi } from './../lib/api'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import reports from '../lib/reports.json'

export default function Reports() {
    let [patients, setPatients] = useState()
    let [data, setData] = useState({ fromDate: new Date().toISOString(), toDate: new Date().toISOString() })
    let navigate = useNavigate()
    let [status, setStatus] = useState(null)
    let [results, setResults] = useState(null)
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)


    let getReport = async (dates = null) => {
        console.log(data.report)
        if (!dates) {
            if (data.report.type === "query") {
                setStatus("loading")
                setResults(null)
                let res = await FhirApi({ url: `/fhir${data.report.q}`, method: 'GET' })
                console.log(res.data[data.report.query])
                setResults({ results: res.data[data.report.query], description: data.report.description })
                setStatus(null)
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
    }, [data.report])

    useEffect(() => {
        getReport(true)
    }, [data.fromDate, data.toDate])


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
                    <Stack direction="row" gap={1} sx={{ paddingLeft: isMobile ? "1em" : "2em", paddingRight: isMobile ? "1em" : "2em" }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Report</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={data.report}
                                label="Select Report"
                                onChange={e => { setData({ ...data, report: e.target.value }); console.log(e.target.value) }}
                                size="small"
                            >

                                {reports && reports['reports'].map((k) => {
                                    return <MenuItem value={k[(Object.keys(k)[0])]}>{Object.keys(k)[0]}</MenuItem>

                                })}
                            </Select>
                        </FormControl>
                    </Stack>
                    <br />
                    <Container maxWidth="lg">
                        {results &&
                            <>
                                <Grid container spacing={1} padding=".5em" >
                                    <Grid item xs={12} md={12} lg={6}>
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
                                    <Grid item xs={12} md={12} lg={6}>
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
                                </Grid>
                            </>
                        }
                        <Card>
                            <CardContent>
                                {(results) ?

                                    <>
                                        <Typography>{results.description}</Typography>
                                        <Typography variant='h4'>{results.results}</Typography>

                                    </> : (!results && status && status === "loading") ?
                                        <>
                                            <Typography>Loading...</Typography>
                                            <CircularProgress />
                                        </>
                                        :
                                        <Typography>Select a report from the list</Typography>
                                }
                            </CardContent>

                        </Card>

                    </Container>
                </Layout>
            </LocalizationProvider>
        </>
    )

}




