import { Card , CardContent, Typography} from '@material-ui/core'
import React from 'react'
import "./InfoBox.css"

function InfoBox({title, cases, isRed, isGreen, isBlack, total, active, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && "infoBox--red"} ${isBlack && "infoBox--black"}`}>
            <CardContent>
                <Typography className="infoBox__title" color="textPrimary">
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${isRed && "infoBox--red"} ${isGreen && "infoBox--green"} ${isBlack && "infoBox--black"}`}>{cases}</h2>
                <Typography className="infoBox__total" color="textPrimary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
