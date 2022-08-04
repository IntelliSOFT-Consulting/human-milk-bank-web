import { Container, TextField, Stack, Input, Button, Grid, Snackbar, Typography, Divider, useMediaQuery } from '@mui/material'
import { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getCookie } from '../lib/cookie'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { apiHost, FhirApi } from '../lib/api'
import { SignalCellularNullSharp } from '@mui/icons-material'

export default function DataImport() {


    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [data, setData] = useState()
    let [selectedFile, setFile] = useState(null)
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let importData = async () => {
        if (!selectedFile) {
            setOpen(false)
            setMessage("Import file not selected")
            setOpen(true)
            setTimeout(() => {
                setOpen(false)
            }, [1500])
            return
        }
        let d;
        d = await selectedFile.text()
        console.log(JSON.parse(d))
        let response = await fetch(`${apiHost}/import`, {
            method: "POST",
            body: JSON.stringify(JSON.parse(d)),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getCookie('token')}`
            }
        })

        // setMessage("PayloadTooLargeError: request entity too large")
        console.log(response)
        setMessage("PayloadError: Data already exists")
        setOpen(true)
        setTimeout(() => {
            setOpen(false)
        }, [1500])
        return

    }


    useEffect(() => {
        if (getCookie("token")) {
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/import")
            return
        }
    }, [])
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Layout>
                    <Container sx={{ border: '1px white dashed' }}>
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            open={open}
                            onClose={""}
                            message={message}
                            key={"loginAlert"}
                        />
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList
                                        value={value}
                                        onChange={handleChange}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        aria-label="scrollable auto tabs example">
                                        <Tab label="Select Import Data" value="1" />

                                    </TabList>
                                </Box>

                                {/* 1. Rapid Assessment */}
                                <TabPanel value="1">
                                    {/* <p></p> */}
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Select Input File</Typography>
                                    <Divider />
                                    <p></p>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid container spacing={1} padding=".5em" >
                                            <Grid item xs={12} md={12} lg={8}>
                                                <label htmlFor="contained-button-file">
                                                    <Input accept="application/JSON" id="import-file" type="file" placeholder={"FHIR Bundle (.json file)"} onChange={e => { setFile(e.target.files[0]) }} />
                                                    <Button sx={{ backgroundColor: "#B00020" }} variant="contained" onClick={e => { importData() }} component="span">
                                                        Import Data
                                                    </Button>
                                                </label>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Divider />
                                    <p></p>
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}></Typography>
                                    <Grid container spacing={1} padding=".5em" >

                                    </Grid>
                                    <p></p>

                                    <p></p>
                                </TabPanel>

                                {/* Data Preview */}
                                <TabPanel value="2">
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Preview Data</Typography>
                                    <Divider />
                                    <p></p>
                                    <Grid container spacing={1} padding=".5em" >

                                    </Grid>
                                    <p></p>
                                    <Divider />
                                    <p></p>
                                    <Divider />
                                    <p></p>
                                    <Stack direction="row" spacing={2} alignContent="right" >
                                        {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                        <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                        <Button variant="contained" disableElevation sx={{ backgroundColor: "#37379b" }}>Save</Button>
                                    </Stack>
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




