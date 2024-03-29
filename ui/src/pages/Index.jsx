import { Grid, Container, CircularProgress, useMediaQuery, CardContent, Card, Snackbar, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';
import InfoCard from '../components/InfoCard';
import * as Plotly from 'plotly.js-dist'
import { apiHost } from '../lib/api';


export default function Index() {
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let [user, setUser] = useState({})
    let [statistics, setStatistics] = useState({})

    let getUser = async () => {
        let data = (await (await fetch(`${apiHost}/auth/me`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` }
            })).json())
        setUser(data.data)
        return
    }

    let getStatistics = async () => {
        let data = (await (await fetch(`${apiHost}/statistics`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` }
            })).json())
        console.log(data)
        if (data.status === "success") {
            delete data.status
            setStatistics(data)
            setMessage("Statistics fetched successfully")
            setOpen(true)
            setTimeout(() => { setOpen(false) }, 1500)
            return
        }
        setMessage("Failed to fetch statistics")
        setOpen(true)
        setTimeout(() => { setOpen(false) }, 1500)
        return

    }

    useEffect(() => {
        if (Object.keys(statistics).length > 0) {

            var layout = { height: 350, width: 350 };
            if (document.getElementById("firstFeeds")) {
                let total = (Object.keys(statistics.firstFeeding).map((x) => { return statistics.firstFeeding[x] })).reduce((a, b) => a + b, 0)
                Plotly.newPlot('firstFeeds', [{
                    type: 'pie', name: "First Feeds", automargin: true,
                    labels: Object.keys(statistics.firstFeeding).map((x) => { return (x) }),
                    values: Object.keys(statistics.firstFeeding).map((x) => { return (statistics.firstFeeding[x] / total * 100) })
                }], { ...layout, title: "Time all babies were given first feeds" });
            }
            if (document.getElementById("percentageFeeds")) {
                let total = (Object.keys(statistics.percentageFeeds).map((x) => { return statistics.percentageFeeds[x] })).reduce((a, b) => a + b, 0)
                Plotly.newPlot('percentageFeeds', [{
                    type: 'pie', name: "Percentage Feeds",
                    labels: Object.keys(statistics.percentageFeeds).map((x) => { return (x) }),
                    values: Object.keys(statistics.percentageFeeds).map((x) => { return statistics.percentageFeeds[x] / total * 100 })
                }], { ...layout, title: "Percentage feeds infants are feeding on" });
            }
            if (document.getElementById("mortalityRates")) {
                // let total = (Object.keys(statistics.mortalityRate.data).map((x) => { return statistics.firstFeeding[x] })).reduce((a, b) => a + b, 0)
                Plotly.newPlot('mortalityRates', [{
                    name: "Mortality Rates", automargin: true,
                    y: (statistics.mortalityRate.data).map((x) => { return (x.value) }),
                    x: (statistics.mortalityRate.data).map((x) => { return (x.month) }),
                    mode: "lines+markers",
                }], { title: "Mortality Rates" });
            }
            if (document.getElementById("expressingTimes")) {
                let yValues = (statistics.expressingTime).map((x) => { return (x.month) })
                // let total = (Object.keys(statistics.mortalityRate.data).map((x) => { return statistics.firstFeeding[x] })).reduce((a, b) => a + b, 0)
                Plotly.newPlot('expressingTimes', [{
                    automargin: true,
                    x: yValues,
                    y: (statistics.expressingTime).map((x) => { return (x.underFive) }),
                    mode: "lines+markers",
                    name: "Under Five"
                },
                {
                    automargin: true,
                    x: yValues,
                    y: (statistics.expressingTime).map((x) => { return (x.underSeven) }),
                    mode: "lines+markers",
                    name: "Under Seven"
                },
                {
                    automargin: true,
                    x: yValues,
                    y: (statistics.expressingTime).map((x) => { return (x.aboveSeven) }),
                    mode: "lines+markers",
                    name: "Above Seven"
                }], { title: "Number of times all mothers are expressing" });
            }
            return
        }
    }, [statistics])



    useEffect(() => {
        if (getCookie("token")) {
            getUser();
            getStatistics();
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/")
            return
        }
    }, [])

    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    let descriptions = {
        term: "Total Number of Term babies",
        preterm: "Total Number of Preterm babies",
        totalBabies: "Total number of babies",
        // lowBirthWeight: "Low birth weight",
        averageDays: "Avg. days to receiving mothers milk"
    }



    return (
        <>
            <Layout>
                <Container maxWidth="lg">
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={open}
                        onClose={""}
                        message={message}
                        key={"dashboard"}
                    />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>{`Dashboard`}</Typography>
                    <br /><br />
                    {(Object.keys(statistics) < 1) ?
                        <>
                            <Typography sx={{ textAlign: "center" }}>Loading...</Typography>
                            <CircularProgress sx={{ marginLeft: '47%' }} />
                        </>
                        :
                        <Grid container spacing={1} padding=".5em" >
                            {(Object.keys(statistics).length > 0) ? Object.keys(statistics).map((report) => {
                                if (Object.keys(descriptions).indexOf(report) > -1) {
                                    return <Grid item xs={12} key={report} md={12} lg={3}>
                                        <InfoCard value={statistics[report]} title={descriptions[report]} />
                                    </Grid>
                                }
                            }) :
                                ((statistics.length > 0) && <Typography sx={{ textAlign: "center" }}>No reports defined</Typography>)
                            }
                        </Grid>}
                    {
                        (Object.keys(statistics).length > 1) &&
                        <>
                            <br />
                            <Grid container gap={5} >
                                <Grid item xs={12} md={12} lg={6} sx={{ border: "1px solid grey", borderRadius: "10px" }}>
                                    <div id="firstFeeds" ></div>
                                </Grid>
                                <Grid item xs={12} md={12} lg={5} sx={{ border: "1px solid grey", borderRadius: "10px" }}>
                                    <div id="percentageFeeds"></div>
                                </Grid>
                            </Grid>
                        </>
                    }
                    {
                        (Object.keys(statistics).length > 1) &&
                        <>
                            <br />
                            <Grid container gap={2} >
                                <Grid item xs={12} md={12} lg={10} sx={{ border: "1px solid grey", borderRadius: "10px" }}>
                                    <div id="mortalityRates" ></div>
                                </Grid>
                                <Grid item xs={12} md={12} lg={10} sx={{ border: "1px solid grey", borderRadius: "10px" }}>
                                    <div id="expressingTimes"></div>
                                </Grid>
                            </Grid>
                        </>
                    }

                </Container>
            </Layout>
        </>
    )
}


let MenuCard = ({ title, url, icon }) => {
    let navigate = useNavigate()
    return (
        <Grid item xs={6} md={6} lg={3}>
            <Card sx={{ backgroundColor: "#37379b", borderRadius: "10px" }} onClick={e => { navigate(`${url}`) }}>
                <CardContent sx={{ textAlign: "center" }}>
                    {icon}
                    <Typography variant='h6' sx={{ color: "white" }}>{title}</Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

