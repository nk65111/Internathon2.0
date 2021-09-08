import React from 'react';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import ReactMapboxGl, { Popup } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = ReactMapboxGl({
    accessToken:
        'pk.eyJ1Ijoibml0ZXNoNjUxMTEiLCJhIjoiY2t0YjNqZ2hxMXNjNDJvcW5kbnhyNHN4cyJ9.FFLPx8TjLSuhiPcfUhGzbw'
});

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


const MapBox = (props) => {
    const { handleClose, open, location } = props;
    console.log(location)
    const classes = useStyles();

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={ handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <div >
                {(location)?
                <Map
                    style="mapbox://styles/mapbox/streets-v9"
                    containerStyle={{
                        height: '50vh',
                        width: '50vw'
                    }}
                    center={[78.9629, 20.5937]}
                    zoom={[3]}
                >
                    <Popup
                        coordinates={[location.lng, location.lat]}
                        offset={{
                            'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
                        }}>
                        <h3>My Location</h3>
                    </Popup>
                </Map>:
                <Card>
                    <CardContent>
                        <h3>Location Not Provided</h3>
                    </CardContent>
                </Card>
                }
            </div>
        </Modal>
    )
}

export default MapBox;