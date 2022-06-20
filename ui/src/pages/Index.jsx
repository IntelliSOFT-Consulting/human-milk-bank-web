import { Paper, Stack, TextField, Button, Container, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';

import { FhirApi } from './../lib/api'

export default function Index() {
    let navigate = useNavigate()

    let selectPatient = (id) => {
        window.localStorage.setItem("currentPatient", id)
    }

    

    
 
    
    useEffect(() => {
        if (getCookie("token")) {
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/")
            return
        }
    }, [])


    const [selectionModel, setSelectionModel] = useState([]);

    const columns = [
        { field: 'id', headerName: 'Patient ID', width: 150, editable: true },
        { field: 'lastName', headerName: 'Last Name', width: 150, editable: true },
        { field: 'firstName', headerName: 'First Name', width: 150, editable: true },
        { field: 'age', headerName: 'Age', width: 200 },
        // { field: 'role', headerName: 'Date of admission', width: 150 }
    ];

    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    // console.log(args)

    return (
        <>
            <Layout>
                <br />
                {/* <Stack direction="row" gap={1} sx={{ paddingLeft: isMobile ? "1em" : "2em", paddingRight: isMobile ? "1em" : "2em" }}>
                    <TextField type={"text"} size="small" sx={{ width: "80%" }} placeholder='Patient Name or Patient ID' />
                    <Button variant="contained" size='small' sx={{ width: "20%" }} disableElevation>Search</Button>
                </Stack> */}
                <br />
                <Container maxWidth="lg">
                   
                </Container>
            </Layout>
        </>
    )
}




