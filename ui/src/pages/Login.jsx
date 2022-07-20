import { Divider, Container, TextField, Button, Stack, Grid, Typography, Snackbar, Paper, useMediaQuery, Box } from '@mui/material'
import { useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiHost } from '../lib/api'
import { setCookie } from '../lib/cookie'

export default function Login() {

    let [loginInfo, setLoginInfo] = useState({})
    let navigate = useNavigate()
    let isMobile = useMediaQuery('(max-width:600px)');
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)

    let login = async () => {
        setOpen(false)
        let requiredFields = ['email', 'password']
        for (let i; i < requiredFields.length; i++) {
            if (!(requiredFields[i] in Object.keys(loginInfo))) {
                console.log(`${requiredFields[i]} is missing`)
                setMessage(`${requiredFields[i]} is missing`)
                setOpen(true)
                return
            }
        }
        setOpen(false)
        try {
            let data = (await (await fetch(`${apiHost}/auth/login`,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify(loginInfo)
                }
            )).json())
            if (data.status === "error") {
                setMessage(data.message)
                setOpen(true)
                return
            }
            else {
                setCookie("token", data.token, 0.25)
                if (window.localStorage.getItem("next_page")) {
                    navigate(window.localStorage.getItem("next_page"))
                    window.localStorage.removeItem("next_page")
                    return
                }
                navigate('/')
                return
            }
        } catch (error) {
            setMessage(error)
            setOpen(true)
            return
        }

    }
    return (
        <>
            <Paper sx={{ backgroundColor: "#37379b", color: 'white', minWidth: '100%' }}>
                <br />
                <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 'bold' }}>Neonatal Nutrition Digital Adaptation Kit</Typography>
                <br />
            </Paper>
            {/* <br/> */}
            <Typography variant="h6" sx={{ textAlign: "center" }}>Diving Digital Excellence to Optimize Newborn Feeding in Kenya and Beyond</Typography>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={""}
                message={message}
                key={"loginAlert"}
            />
            <Stack
                direction={{ xs: 'column', sm: 'column', md: 'column', lg: 'row', xl: 'row' }}
                spacing={2}
                divider={<Divider orientation="vertical" sx={{ color: "#37379b", backgroundColor: "#37379b", maxWidth: '100%' }} flexItem />}
            >
                {/* Left Grid  */}

                <Box sx={{
                    alignContent: 'center', justifyContent: 'center', alignItems: 'center', width: (isMobile) ? '100%' : '50%',
                    minWidth: (isMobile) ? '100%' : '50%',
                    maxWidth: (isMobile) ? '100%' : '50%'
                }}>
                    <br />
                    <br />
                    <br />
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 'bold' }}>Login</Typography>
                    <br />
                    <Container sx={{
                        padding: '3.5em', alignContent: 'center',
                        justifyContent: 'center', alignItems: 'center',
                        textAlign: 'center',
                        paddingTop: '2em'
                    }}>
                        <TextField
                            sx={{ minWidth: "50%" }}
                            type="email"
                            label="Email Address"
                            placeholder="Email Address"
                            size="small"
                            onChange={e => { setLoginInfo({ ...loginInfo, email: e.target.value }) }}

                        />
                        <br /><br />
                        <TextField
                            type="password"
                            label="Password"
                            placeholder="Password"
                            sx={{ minWidth: "50%" }}
                            size="small"
                            onChange={e => { setLoginInfo({ ...loginInfo, password: e.target.value }) }}
                        />
                        <br />
                        <br />
                        <br />
                        <Button variant="contained"
                            disableElevation onClick={e => { login() }}
                            sx={{ width: "45%", backgroundColor: "#B00020", borderRadius: "10px" }}>Login</Button>

                        <br />
                        <br />
                        <br />
                        <br />
                        <Typography sx={{ textDecoration: "underline", float: 'right', color: '#37379b' }}
                            textAlign="center"
                        ><a href="/reset-password">Forgot Password?</a></Typography>
                        <br />


                    </Container>
                    {(!isMobile) && <><br /><br /><br /><br /></>}


                </Box>



                {/* Right Grid  */}
                <Box sx={{ padding: '3em' }}>
                    <p></p>

                    {(!isMobile) &&
                        <img src={'landing_page.svg'} style={{ width: "500px" }} alt="landing_page_img" />
                    }
                    <p></p>

                    <Divider />
                    <p></p>

                    <Grid container gap={2}>
                        <Grid item sx={4}>
                            <Typography variant="p" sx={{ textDecoration: "underline" }}>In partnership with:</Typography>
                            <p></p>
                        </Grid>
                        <Grid item sx={4}>
                            <img src="philips-foundation.jpg" style={{ maxWidth: "100px" }} />
                        </Grid>
                        <Grid item sx={4}>
                            <img src="/path-logo.png" style={{ maxWidth: "100px" }} />
                        </Grid>
                    </Grid>

                </Box>
            </Stack>
        </>
    )

}




