import { Container, Alert, AlertTitle, Button, Grid, Snackbar, Typography, Divider, useMediaQuery } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getCookie } from '../lib/cookie'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


export default function DataExport({ id }) {

    let [data, setData] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let exportPatientData = async () => {
        fetch("https://devnndak.intellisoftkenya.com/fhir/Patient/$everything?_count=9999999")
            .then(async (response) => {
                let clone = response.clone();
                let res = await clone.json();
                console.log(res);
                return response.blob()
            })
            .then(blob => {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = `${new Date().toUTCString()}.json`;
                a.click();
            })
            .catch(function (err) {
                console.error(err)
            })
    }


    useEffect(() => {
        if (getCookie("token")) {
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/export")
            return
        }
    }, [])
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Layout>

                    <Container sx={{ border: '1px white dashed' }}>

                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList
                                        value={value}
                                        onChange={handleChange}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        aria-label="scrollable auto tabs example">
                                        <Tab label="Export Data" value="1" />

                                    </TabList>
                                </Box>

                                {/* 1.  */}
                                <TabPanel value="1">
                                    {/* <p></p> */}
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Export Patient Data</Typography>
                                    <Divider />
                                    <p></p>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={8}>
                                            <Alert severity="info">
                                                <AlertTitle>Exporting Patient Data</AlertTitle>
                                                Export patients' clinical data as a FHIR JSON Bundle containing the following resources; Patients, Encounters, Observations, Orders and any other related FHIR Resources.
                                            </Alert>
                                            <br/>
                                            <Button sx={{ backgroundColor: "#B00020" }} variant="contained" onClick={e => { exportPatientData() }}>Export Patient Data</Button>
                                        </Grid>
                                    </Grid>
                                    <p></p>


                                    <Divider />
                                    <p></p>

                                </TabPanel>

                            </TabContext>
                        </Box>
                    </Container>
                </Layout>
            </LocalizationProvider>

        </>
    )

}




