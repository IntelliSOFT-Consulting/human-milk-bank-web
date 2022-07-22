import { Grid, Container, CircularProgress, useMediaQuery, CardContent, Card, Snackbar, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';
import InfoCard from '../components/InfoCard';
import * as Plotly from 'plotly.js-dist'


export default function Index() {
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)
    let [user, setUser] = useState({})
    let [statistics, setStatistics] = useState({})

    let getUser = async () => {
        let data = (await (await fetch("/auth/me",
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` }
            })).json())
        setUser(data.data)
        return
    }

    useEffect(() => {
        var data = [{
            values: [19, 26, 55],
            labels: ['Residential', 'Non-Residential', 'Utility'],
            type: 'pie'
        }];

        var layout = {
            height: 400,
            width: 500
        };
        if (document.getElementById("firstFeeds")) {
            Plotly.newPlot('firstFeeds', data, layout);
            return
        }
    }, [statistics, document.getElementById("firstFeeds")])

    let getStatistics = async () => {
        let data = (await (await fetch("/statistics",
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
        term: "Term babies",
        preterm: "Preterm babies",
        totalBabies: "Total number of babies",
        lowBirthWeight: "Low birth weight",
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
                            <Typography>Loading...</Typography>
                            <CircularProgress />
                        </>
                        :
                        <Grid container spacing={1} padding=".5em" >
                            {(Object.keys(statistics).length > 0) ? Object.keys(statistics).map((report) => {
                                if (Object.keys(descriptions).indexOf(report) > -1) {
                                    return <Grid item xs={12} md={12} lg={3}>
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
                            <Grid container spacing={1} padding=".5em" >
                                <Grid item xs={12} md={12} lg={6}>
                                    <div id="firstFeeds" style={{ width: "100%", height: "400px" }}></div>
                                </Grid>
                                <Grid item xs={12} md={12} lg={6}>
                                    <div id="percentageFeeds" style={{ width: "100%", height: "400px" }}></div>
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

