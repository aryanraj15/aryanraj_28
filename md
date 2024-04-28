  "result": [
        {
            "typeId": 1,
            "typeName": "Casual Leave",
            "typeIcon": "AssignmentIcon",
            "typeColor": "4CAF50",
            "balance": null,
            "isAvailable": null
        },
        {
            "typeId": 4,
            "typeName": "Paternity Leave",
            "typeIcon": "AccessTimeIcon",
            "typeColor": "4fc3f7",
            "balance": null,
            "isAvailable": null
        }
    ],



import React, { useState, useEffect } from 'react';
import { Grid, Typography, Avatar } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { styled } from "@mui/material/styles";

import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import Paper from '@mui/material/Paper';

const LeadgerCard = (props) => {
    const { resData } = props;

    const getColorObject = (colorString) => {
        // Remove the # symbol if present
        const colorCode = colorString.startsWith("#") ? colorString.substring(1) : colorString;
        return colorCode ? `#${colorCode}` : null;
    };

    const color = getColorObject(resData?.typeColor);
    console.log(color)

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        margin: 3,
        borderRadius: "10px",
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <Grid item xs={5}>
            <Item>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom component="div">
                                    {resData?.typeName}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    {resData?.balance} DAYS
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Avatar sx={{ bgcolor: color }}>
                                <AssignmentIcon />
                            </Avatar>
                        </Grid>
                    </Grid>
                </Grid>
            </Item>
        </Grid>
    );
}

export default LeadgerCard;
