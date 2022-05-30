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
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'


export default function DataImport({ id }) {

    let [patient, setPatient] = useState({})
    let [data, setData] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let getPatientDetails = async ({ id }) => {
        setOpen(false)
        let data = (await (await fetch(`/patient/${id}`,
            {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` },
            }
        )).json())
        console.log(data)
        setOpen(false)
        if (data.status === "error") {
            setMessage(data.error)
            setOpen(true)
            return
        }
        else {
            setPatient(data.patient)
            return
        }
    }

    useEffect(() => {
        getPatientDetails(id)
    }, [])
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
                                        <Tab label="Preview " value="2" />
                                        <Tab label="Confirm Import" value="3" />
                                        <Tab label="Past Import Tasks" value="4" />
                                    </TabList>
                                </Box>

                                {/* 1. Rapid Assessment */}
                                <TabPanel value="1">
                                    {/* <p></p> */}
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Select Input File</Typography>
                                    <Divider />
                                    <p></p>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid item xs={12} md={12} lg={8}>
                                            <TextField
                                                fullWidth="80%"
                                                type="text"
                                                multiline
                                                minRows={4}
                                                label="Input FHIR Bundle"
                                                placeholder="Input FHIR Bundle"
                                                size="small"
                                                onChange={e => { console.log(e) }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <p></p>
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold', textAlign: "center" }}>or</Typography>
                                    <Grid container spacing={1} padding=".5em" >
                                        <Grid container spacing={1} padding=".5em" >
                                            <Grid item xs={12} md={12} lg={8}>
                                                <label htmlFor="contained-button-file">
                                                    <Input accept="image/*" id="contained-button-file" multiple type="file" />
                                                    <Button variant="contained" component="span">
                                                        Upload FHIR Bundle (json file)
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
                                    <Divider />
                                    <p></p>
                                    <Stack direction="row" spacing={2} alignContent="right" >
                                        {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                        <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                        <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }}>Next</Button>
                                    </Stack>
                                    <p></p>
                                </TabPanel>

                                {/* Newborn Admission  */}
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
                                        <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }}>Save</Button>
                                    </Stack>
                                    <p></p>

                                </TabPanel>


                                {/* Feeding Needs Assessment  */}
                                <TabPanel value="3">
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Confirm and Begin Import</Typography>
                                    <Divider />
                                    <p></p>

                                    <Divider />
                                    <p></p>
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}></Typography>

                                    <p></p>
                                    <Divider />
                                    <p></p>
                                    <Divider />
                                    <p></p>
                                    <Stack direction="row" spacing={2} alignContent="right" >
                                        {(!isMobile) && <Typography sx={{ minWidth: '80%' }}></Typography>}
                                        <Button variant='contained' disableElevation sx={{ backgroundColor: 'gray' }}>Cancel</Button>
                                        <Button variant="contained" disableElevation sx={{ backgroundColor: "#115987" }}>Save</Button>
                                    </Stack>
                                    <p></p>
                                </TabPanel>

                                {/* Prescribe Feeds  */}
                                <TabPanel value="4">
                                    <Typography variant='p' sx={{ fontSize: 'large', fontWeight: 'bold' }}>Past Import Tasks</Typography>
                                    <Divider />
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




