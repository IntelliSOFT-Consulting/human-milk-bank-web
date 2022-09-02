import React, { Component }  from 'react';
import { Paper, FormControl, Select, MenuItem, InputLabel, Grid, Container, Snackbar, CircularProgress, useMediaQuery, TextField, Typography, CardContent, Card, Alert, Button } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';
import { apiHost, FhirApi } from './../lib/api'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import LactationSupport from '../components/Reports/LactationSupport';
import HMB from '../components/Reports/HMB';
import InfantNutrition from '../components/Reports/InfantNutrition';
import GeneralPatientLevel from '../components/Reports/GeneralPatientLevel';
import Feeding from '../components/Reports/Feeding';
import LactationSupportPatientLevel from '../components/Reports/LactationSupportPatientLevel';
import GrowthPatientLevel from '../components/Reports/GrowthPatientLevel';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PrintRounded } from '@mui/icons-material';


export default function Reports() {
    let printRef = useRef()
    let [data, setData] = useState({ fromDate: new Date().toISOString(), toDate: new Date().toISOString() })
    let navigate = useNavigate()
    let [report, selectReport] = useState()
    let [exporting, setExporting] = useState(false)
    let [status, setStatus] = useState(null)
    let [results, setResults] = useState({})
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let [reportLevel, setReportLevel] = useState(false)

    let availableReports =
    {
        "General Report": { url: "/statistics/general/patient-level" },
        "Feeding/BreastFeeding": { url: "/statistics/feeding/patient-level" },
        "Lactation Support": { url: "/statistics/lactation-support" },
        "Lactation Support - Patient level": { url: "/statistics/lactation-support/patient-level" },
        "Infant Nutrition/Growth": { url: "/statistics/growth" },
        "Human Milk Bank": { url: "/statistics/hmb" },
        "Infant Nutrition/Growth - Patient Level": { url: "/statistics/growth/patient-level" },    }

    let exportReport = async () => {
        setExporting(true)
        const element = printRef.current;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight =
            (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${report}.pdf`);
        setExporting(false)
        return
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
    }, [report, data.toDate, data.fromDate])


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
                    {(Object.keys(results).length > 0) && <LoadingButton startIcon={<PrintRounded />} loading={exporting} loadingIndicator="Exporting.." variant="contained" sx={{ backgroundColor: "#A8001E", float: "right" }} onClick={exportReport}>Export</LoadingButton>}
                    <div ref={printRef}>
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
                                            inputFormat="dd/MM/yyyy"
                                            value={data.fromDate ? data.fromDate : (new Date().setFullYear(2000)).toISOString()}
                                            onChange={e => { console.log(e); setData({ ...data, fromDate: new Date(e).toISOString() }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="From Date"
                                                inputFormat="dd/MM/yyyy"
                                                value={data.fromDate ? data.fromDate : (new Date().setFullYear(2000)).toISOString()}

                                                onChange={e => { console.log(e); setData({ ...data, fromDate: new Date(e).toISOString() }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={3}>
                                        {!isMobile ? <DesktopDatePicker
                                            label="To Date"
                                            inputFormat="dd/MM/yyyy"
                                            value={data.toDate ? data.toDate : (new Date().setHours(23)).toISOString()}
                                            onChange={e => { console.log(e); setData({ ...data, toDate: new Date(e).toISOString() }) }}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        /> :
                                            <MobileDatePicker
                                                label="To Date"
                                                inputFormat="dd/MM/yyyy"
                                                value={data.toDate ? data.toDate : (new Date().setHours(23)).toISOString()}
                                                onChange={e => { console.log(e); setData({ ...data, toDate: new Date(e).toISOString() }) }}
                                                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            />}
                                    </Grid>
                                </>
                            }
                        </Grid>

                        <Container maxWidth="lg">
                            <p></p>
                            {report && <Typography variant="h5" sx={{ textAlign: "center" }}>{report}</Typography>}
                            {(report && (results.length < 1)) ?
                                <>
                                    <br />
                                    <Paper sx={{ backgroundColor: "white" }}>
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

                                {(report === "Feeding/BreastFeeding") && <Feeding results={results || null} />}
                                {(report === "General Report") && <GeneralPatientLevel results={results || null} />}
                                {(report === "Lactation Support - Patient level") && <LactationSupportPatientLevel results={results || null} />}
                                {(report === "Infant Nutrition/Growth") && <InfantNutrition results={results || null} />}
                                {(report === "Infant Nutrition/Growth - Patient Level") && <GrowthPatientLevel results={results || null} />}
                                {(report === "Lactation Support") && <LactationSupport results={results || null} />}
                                {(report === "Human Milk Bank") && <HMB results={results || null} />}

                            </Grid>
                        </Container>
                    </div>
                </Layout>
            </LocalizationProvider>
        </>
    )

}
