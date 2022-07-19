import { Grid, Container, Snackbar, CircularProgress, useMediaQuery, TextField, Typography, CardContent, Card } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import { getCookie } from '../../lib/cookie';
import { apiHost, FhirApi } from '../../lib/api'
import Table from '../Table'

export default function GeneralReport({ results }) {

    let [report, selectReport] = useState()
    let [status, setStatus] = useState(null)
    let [results, setResults] = useState([])
    let [reports, setReports] = useState([])
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)


    let General = [{ totalBabies: "Total Number of Babies" },
    { "preterm": "Number of Preterm Babies" },
    { "term": "Number of Term Babies" },
    { "mortalityRate": "Mortality Rate" },
    {
        "mortalityRateTable": {
            type: "table",
            data: "mortalityRate"
        }
    }]


    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);

    return (
        <>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={e => { setOpen(false) }}
                message={message}
                key={"loginAlert"}
            />
            <br />


            <Container maxWidth="lg">
                {!report ?
                    <>
                        <Typography>Loading...</Typography>
                        <CircularProgress />
                    </>
                    :

                    <Grid container spacing={1} padding=".5em" >
                        {/* {JSON.stringify(reports)} */}
                        {(reports.length > 0) ? reports.map((report) => {
                            return <Grid item xs={12} md={12} lg={4}>
                                <Card>
                                    <CardContent>
                                        <Typography>{report[(Object.keys(report)[0])]}</Typography>
                                        {parseResults(results[(Object.keys(report)[0])])}

                                    </CardContent>
                                </Card>
                            </Grid>
                        }) :
                            ((results.length > 0) && <Typography sx={{ textAlign: "center" }}>No reports defined</Typography>)
                        }
                    </Grid>}
            </Container>

        </>
    )

}




