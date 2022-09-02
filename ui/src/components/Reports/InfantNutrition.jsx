import { Grid, Container, Snackbar, CircularProgress, useMediaQuery, TextField, Typography, CardContent, Card } from '@mui/material'
import React, { useState, useEffect } from 'react'
// import { getCookie } from '../../lib/cookie';
// import { apiHost, FhirApi } from '../../lib/api'
import InfoCard from '../InfoCard'
import Table from '../Table'

export default function LactationSupport({ results }) {

    console.log(results)

    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let descriptions = {
        infantsExposedToFormula: "Number of Infants Exposed To Formula",
        infantsFullyFedOnMothersMilk: "Infants fully fed on mother's own milk",
        infantsReceivingExclusiveHumanMilkDiets: "Infants receiving exclusive human milk diets",
        // percentageFeeds: "Percentage feeds received by all infants"
    }

    let isMobile = useMediaQuery('(max-width:600px)');

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
                                return <Grid item xs={12} md={12} lg={4}>
                                    <InfoCard value={results[report]} title={descriptions[report]} />
                                </Grid>
                            }
                        }) :
                            ((results.length > 0) && <Typography sx={{ textAlign: "center" }}>No reports defined</Typography>)
                        }
                    </Grid>}
                <br />
                {(Object.keys(results).length > 0) && (Object.keys(results).indexOf('percentageFeeds') > -1) &&
                    <Grid container spacing={1} padding=".5em" >
                        <Grid item xs={12} md={12} lg={6}>
                            <Table rows={(Object.keys(results.percentageFeeds).map((feed) => {
                                return { month: feed, value: results.percentageFeeds[feed] }
                            }))} title="Percentage feeds received by all infants" />
                        </Grid>
                    </Grid>}
            </Container>

        </>
    )

}




