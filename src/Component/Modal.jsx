import React, { useState, useContext } from 'react';
import { } from "../Context/AuthProvider";
import { uuid } from 'uuidv4';
import { firebaseDB, firebaseStorage, timeStamp } from '../Config/Firbase';
import { AuthContext } from "../Context/AuthProvider";
import { PhotoCamera } from '@material-ui/icons';
import PropTypes from 'prop-types';


import { makeStyles, InputLabel, MenuItem, FormControl, Select, Button, Container, Card, CardActions, LinearProgress, Typography, Box } from '@material-ui/core';


function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {

    value: PropTypes.number.isRequired,
};




const useStyles = makeStyles((theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    fullWidth: {
        width: "100%"
    },
    alignCenter: {
        textAlign: "center",
        padding: "2%"
    },
    marginTop: {
        width: "100%",
        marginTop: theme.spacing(2),
    },
    root: {
        width: '100%',
    }
}));



function Modal({ setOpenModal }) {

    const classes = useStyles();
    const [postType, setPostType] = React.useState('');
    const [location, setLocation] = useState({ lat: '', lng: '' });
    const [open, setOpen] = React.useState(false);
    const [file, setfile] = useState(null);
    let { signOut, currentUser } = useContext(AuthContext);
    const [uploadVideoError, setUploadVideoError] = useState("");
    const [progesscheck, setprogess] = useState(0);
    const paperStyle = { padding: 20, height: '70vh', width: '25%', margin: "4% auto" };
    const handleChange = (event) => {
        setPostType(event.target.value);
    };

    function handlefileInput(e) {
        let file = e.target.files[0];
        setfile(file);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const getLocation = () => {
        // check if user's browser supports Navigator.geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(displayLocation, showError, options);
        } else {
            console.log("Sorry, your browser does not support this feature... Please Update your Browser to enjoy it");
        }
    }

    // Displays the different error messages
    const showError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("You denied the request for your location.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Your Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.log("Your request timed out. Please try again");
                break;
            case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred please try again after some time.");
                break;
        }
    }

    //Makes sure location accuracy is high
    const options = {
        enableHighAccuracy: true
    }

    const displayLocation = (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat: lat, lng: lng });
    }


    async function handleOnUpload() {
        try {
            console.log(postType);
            if (file.size / 1000000 > 5) {
                setUploadVideoError("Selected File Exceeds 5MB cannot upload !");
                return;
            }
            let uid = currentUser.uid;
            let uploadVideoObject;
            if (postType == "Image") {
                uploadVideoObject = firebaseStorage.ref(`profileImage/${uid}/${Date.now()}.jpg`).put(file);
            } else if (postType == "Reels") {
                uploadVideoObject = firebaseStorage.ref(`profileImage/${uid}/${Date.now()}.mp4`).put(file);

            }


            uploadVideoObject.on("state_changed", fun1, fun2, fun3);
            function fun1(snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setprogess(progress);
            }
            function fun2(err) {
                console.log(err);
            }
            async function fun3() {
                let videoUploadUrl = await uploadVideoObject.snapshot.ref.getDownloadURL();
                let pid = uuid();
                await firebaseDB.collection("posts").doc(pid).set({
                    pid: pid,
                    uid: uid,
                    VideoLink: videoUploadUrl,
                    comment: [],
                    likes: [],
                    postType: postType,
                    location: location,
                    createdAt: timeStamp()
                });
                let doc = await firebaseDB.collection("users").doc(uid).get();
                let document = doc.data();
                await document.postCreated.push(pid);
                await firebaseDB.collection("users").doc(uid).set(document);
                setUploadVideoError("");
                setOpenModal(false);
            }
        } catch (err) {
            console.log(err.message);
        }
    }


    return (
        <>

            <Container elevation={10} style={paperStyle} variant="outlined">
                <Card>
                    <div className="form">
                        <div className="postType">
                            <div style={{ margin: "0.5rem", width: "95%" }}>
                                <FormControl className={classes.formControl, classes.fullWidth} >
                                    <InputLabel id="demo-controlled-open-select-label">Post Type</InputLabel>
                                    <Select
                                        labelId="demo-controlled-open-select-label"
                                        id="demo-controlled-open-select"
                                        open={open}
                                        onClose={handleClose}
                                        onOpen={handleOpen}
                                        value={postType}
                                        onChange={handleChange}
                                    >
                                        {/* <MenuItem value={"Blog"}>Blog</MenuItem> */}
                                        <MenuItem value={"Image"}>Image</MenuItem>
                                        <MenuItem value={"Reels"}>Reels</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>

                    <CardActions>
                        <Button variant="contained" color="secondary" component="label" className={classes.fullWidth} >Select File<input type="file" onChange={handlefileInput} hidden /></Button>
                    </CardActions>
                    <CardActions>
                        <Button variant="contained" color="secondary" className={classes.fullWidth} onClick={getLocation}>Add Location</Button>
                    </CardActions>
                    <CardActions>
                        <Button onClick={() => { setOpenModal(false) }} variant="contained" color="secondary" className={classes.fullWidth} >Cancel</Button>
                    </CardActions>

                    <CardActions>
                        <Button variant="contained" color="secondary" className={classes.fullWidth} onClick={handleOnUpload} style={{ marginTop: "5%" }} startIcon={<PhotoCamera></PhotoCamera>}>Upload</Button>
                    </CardActions>
                    <CardActions>
                        <div className={classes.root}>
                            <LinearProgressWithLabel value={progesscheck} />
                        </div>
                    </CardActions>
                </Card>
            </Container>
        </>
    );
}

export default Modal;