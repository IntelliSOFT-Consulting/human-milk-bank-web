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
                    <Typography variant='p'>{title}</Typography>
                    <Typography variant='h6'>{value}</Typography>
                </CardContent>
            </Card>
        </>
    )
}




