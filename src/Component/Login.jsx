import React, { useState ,useContext } from 'react'
import { AuthContext } from '../Context/AuthProvider';
import {Link} from 'react-router-dom';
import logo from '../logo.png';
import {Button,TextField,Card,CardMedia,Typography,Container,Grid,Paper,CardContent,CardActions,makeStyles} from '@material-ui/core';
const Login = (props) => {
    const [email,setemail]=useState("");
    const [password,setpassword]=useState("");
    const {login}=useContext(AuthContext);
    const paperStyle={padding :20,height:'70vh',width:'25%', margin:"9% auto"};
    let useStyle=makeStyles({
      fullWidth:{
          width:"100%"
      },
      alignCenter:{
          textAlign:"center",
          padding:"2%"
      },
      marginTop:{
          width:"100%",
          marginTop:"0.5rem"
      }
  });
    let classes=useStyle();
    async function handelLogin(e){
        try{
            await login(email,password);
            props.history.push("/");
        }
        catch(err){
           
            setemail("");
            setpassword("");
        }
        
    }
    return ( 
        <>
        
        <Container elevation={10} style={paperStyle} >
         
              <Card variant="outlined">
                <CardMedia image={logo} style={{ height: "5rem", backgroundSize: "contain" }}>
                </CardMedia>
                <CardContent>
                  <TextField className={classes.marginTop} label="email" value={email} onChange={ (e)=>{setemail(e.target.value)}} variant="outlined" size="small"></TextField>
                  <TextField className={classes.marginTop} label="password" value={password} onChange={ (e)=>{setpassword(e.target.value)}} variant="outlined" size="small"></TextField>
                </CardContent>
                <CardActions>
                  <Button className={classes.marginTop} onClick={handelLogin} variant="contained" color="secondary">Login</Button>
                </CardActions>
              </Card>
              <Card variant="outlined">
                 <Typography>
                   Don't have account ?
                   <Link to='/signup'>
                   Sign Up</Link>
                 </Typography>
              </Card>
           
        </Container>
        </>
     );
}
 
export default Login;