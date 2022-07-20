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
    let [reports, setReports] = useState([])
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)


    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    let descriptions = {
        term: "Term Babies",
        preterm: "PreTerm Babies",
        totalBabies: "Total Babies",
        mortalityRate: "Mortality Rate"
    }
    let table = {
        mortalityRate: "Morta"
    }
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
                {!results ?
                    <>
                        <Typography>Loading...</Typography>
                        <CircularProgress />
                    </>
                    :
                    <Grid container spacing={1} padding=".5em" >
                        {(reports.length > 0) ? reports.map((report) => {
                            //switch statement
                            return <Grid item xs={12} md={12} lg={4}>

                            </Grid>
                        }) :
                            ((results.length > 0) && <Typography sx={{ textAlign: "center" }}>No reports defined</Typography>)
                        }
                    </Grid>}
            </Container>

        </>
    )

}




