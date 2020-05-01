import React, { FunctionComponent } from 'react'
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'
import { GoogleApiClientId } from '../constants/app-constants'

export interface LoginViewProps {
  loginSuccessCallback: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void
  loginFailureCallback: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void
}

export const LoginView: FunctionComponent<LoginViewProps> = (props) => (
  <div className='m-2'>
    <span className='mr-2'>To proceed: </span>
    <GoogleLogin
      clientId={GoogleApiClientId}
      buttonText='Login'
      onSuccess={props.loginSuccessCallback}
      onFailure={props.loginFailureCallback}
      cookiePolicy={'single_host_origin'}
    />
  </div>
)
