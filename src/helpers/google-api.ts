import { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login"

export const determineIsLoginResponse = (
  toBeDetermined: GoogleLoginResponse | GoogleLoginResponseOffline,
): toBeDetermined is GoogleLoginResponse => {
  if ((toBeDetermined as GoogleLoginResponse).profileObj) {
    return true
  }
  return false
}