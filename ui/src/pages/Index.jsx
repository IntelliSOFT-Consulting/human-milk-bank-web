import { Grid, Container, useMediaQuery, CardContent, Card, MenuItem, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';
import { FhirApi } from './../lib/api'
import { AccountCircle, Dashboard, FileDownload, FileUpload, Kitchen, ListAlt, People, PivotTableChart, Settings } from '@mui/icons-material';


export default function Index() {
    let navigate = useNavigate()
    let [user, setUser] = useState({})

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
        if (getCookie("token")) {
            getUser();
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/")
            return
        }
    }, [])

    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    let menuItems = [
        { title: "Reports", url: "/reports", icon: <PivotTableChart sx={{ color: "#B00020" }} /> },
        { title: "Data Import", url: "/import", icon: <FileUpload sx={{ color: "#B00020" }} /> },
        { title: "Data Export", url: "/export", icon: <FileDownload sx={{ color: "#B00020" }} /> },
        { title: "Patient List", url: "/patients", icon: <ListAlt sx={{ color: "#B00020" }} /> },
        { title: "Users", url: "/users", icon: <People sx={{ color: "#B00020" }} /> },
        { title: "My Account", url: "/account", icon: <AccountCircle sx={{ color: "#B00020" }} /> },

    ]

    return (
        <>
            <Layout>
                <br />
                <Container maxWidth="lg">
                    <Typography variant="h5">{`Welcome ${user.names ? user.names.split(" ")[0] : ''}`}</Typography>
                    <br/>
                    <Grid container rowSpacing={1} columnGap={1} minWidth="100%">
                        {menuItems.map((item) => {
                            return <MenuCard title={item.title} url={item.url} icon={item.icon} />
                        })}
                    </Grid>
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

