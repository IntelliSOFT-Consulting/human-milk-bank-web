import { Stack, FormControl,Select,MenuItem, InputLabel, Container, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as qs from 'query-string';
import Layout from '../components/Layout';
import { getCookie } from '../lib/cookie';
import { FhirApi } from './../lib/api'

export default function Reports() {
    let [patients, setPatients] = useState()
    let [data, setData] = useState({})
    let navigate = useNavigate()

    let getPatients = async () => {

        let data = await FhirApi({ url: '/fhir/Patient', method: 'GET'})
        let p = data.data.entry.map((i) => {
            let r = i.resource
            return { id: r.id, lastName: r.name[0].family, firstName: r.name[0].given[0],
                age: `${(Math.floor((new Date() - new Date(r.birthDate).getTime()) / 3.15576e+10))} years`
            }
        })
        setPatients(p)
    }

    let deletePatient = async () => {

    }
 
    useEffect(() => {
        getPatients()
    }, [])

    useEffect(() => {
        if (getCookie("token")) {
            return
        } else {
            navigate('/login')
            window.localStorage.setItem("next_page", "/patients")
            return
        }
    }, [])

    let isMobile = useMediaQuery('(max-width:600px)');

    let args = qs.parse(window.location.search);
    // console.log(args)

    return (
        <>
            <Layout>
                <br />
                <Stack direction="row" gap={1} sx={{ paddingLeft: isMobile ? "1em" : "2em", paddingRight: isMobile ? "1em" : "2em" }}>
                <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Report</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={data.role}
                                    label="Role"
                                    onChange={e => { setData({ ...data, role: e.target.value }) }}
                                    size="small"
                                >
                                    <MenuItem value={"ADMINISTRATOR"}>Report 1</MenuItem>
                                    <MenuItem value={"STAFF"}>Report 1</MenuItem>
                                    <MenuItem value={"PRACTITIONER"}>Report 1</MenuItem>
                                </Select>
                            </FormControl>
                </Stack>
                <br /><br />
                <Container maxWidth="lg">
                </Container>
            </Layout>
        </>
    )

}




