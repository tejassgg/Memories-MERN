import { useState } from "react";
import { Grid, Button, Typography, Paper, Container, Avatar} from "@material-ui/core";
import { GoogleLogin } from "react-google-login";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import useStyles from "./styles";
import Input from "./Input";
import Icon from "./Icon";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { AUTH } from '../../constants/actionTypes';
import {signin,signup} from '../../action/auth';

const initialState = {firstName: '', lastName: '', email: '', password:'', confirmPassword: '' };

const Auth = () => {
  const [formData, setFormData] =useState(initialState);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isSignUp){
      dispatch(signup(formData,history))
    }
    else{
      dispatch(signin(formData,history))
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name] : e.target.value})
  };

  const switchMode = () => {
    setFormData(initialState);
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setShowPassword(false);
  };

  const googleSuccess = async(res) =>{
    const result = res?.profileObj;
    const token = res?.tokenId;
    try {
        dispatch({type: AUTH, data: {result, token}});
        history.push('/');
    } catch (error) {
        console.log(error);
    }
  };

  const googleFailure = (error) =>{
      console.log(error);
      console.log("Google Signin Was Unsuccessfull. Try Again Later");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />s
        </Avatar>
        <Typography variant="h5">{isSignUp ? "SignUp" : "Sign In"} </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignUp && (
              <Input
                name="confirmPassword"
                label="Confirm Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            fullWidth
          >
            {isSignUp ? "SIGN UP" : "SIGN IN"}
          </Button>

          <GoogleLogin
            clientId="413934310051-pn64k8m4aebt2r49573g4opdddjqgf70.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color="primary"
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant="contained"
              >
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
          
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignUp
                  ? "Already Have an Acoount? Sign In"
                  : "Don't Have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
