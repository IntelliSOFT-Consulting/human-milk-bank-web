import { Grid, Container, Snackbar, CircularProgress, useMediaQuery, TextField, Typography, CardContent, Card } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import { getCookie } from '../../lib/cookie';
import { apiHost, FhirApi } from '../../lib/api'
import Table from '../Table'
import InfoCard from '../InfoCard'

export default function GeneralReport({ results }) {

    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    let descriptions = {
        term: "Term babies",
        preterm: "Preterm babies",
        totalBabies: "Total babies",
        lowBirthWeight: "Low birth weight",
        mortalityRate: "Mortality rate"
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
                        {(Object.keys(results).length > 0) ? Object.keys(results).map((report) => {
                            if (Object.keys(descriptions).indexOf(report) > -1) {
                                return <Grid item xs={12} md={12} lg={3}>
                                    <InfoCard value={results[report]} title={descriptions[report]} />
                                </Grid>
                            }
                        }) :
                            ((results.length > 0) && <Typography sx={{ textAlign: "center" }}>No reports defined</Typography>)
                        }
                        {(Object.keys(results).length > 0) && (Object.keys(results).indexOf('mortalityRates') > -1) &&
                            <Grid item xs={12} md={12} lg={6}>
                                <Table rows={results.mortalityRates} title="Mortality Rates by Month" />
                            </Grid>}

                    </Grid>}

            </Container>

        </>
    )

}