import { useState, useEffect } from 'react'
import {
    Card, CardContent, Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function InfoCard({ title, value }) {

    let navigate = useNavigate()

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant='p' sx={{ fontSize:"12px"}}>{title}</Typography>
                    <Typography variant='h5' sx={{ fontWeight: "bold" }}>{value}</Typography>
                </CardContent>
            </Card>
        </>
    )
}




