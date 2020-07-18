import React from 'react';
import logo from './logo.svg';
import './App.css';


var ClientOAuth2 = require('client-oauth2')
 
// https://console.developers.google.com/apis/credentials?organizationId=0&project=fresh-coconut
const FRESH_COCONUT_OAUTH_CLIENT_ID = '844970364462-s5ph6npbj5urca4v8kgvtq67lomt9o9m.apps.googleusercontent.com'

const googleoauth2 = new ClientOAuth2({
  // https://www.npmjs.com/package/client-oauth2
  accessTokenUri: 'https://www.googleapis.com/oauth2/v4/token',
  authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
  clientId: localStorage.getItem('OAUTH_CLIENT_ID') || FRESH_COCONUT_OAUTH_CLIENT_ID,  
  redirectUri: 'http://debian.tenk.co:3000/oauth2/callback',
  scopes: ['profile']
})

const oauth2Client = googleoauth2;

const applicationState = {
  
}


const fetchJSONSetState = (url, setState, key) => {
  fetch(url).then(response => {
    return response.json().then(value => {
      const state = { [key]: value }
      setState(state)
    })
  })
}

const getUserProfile = (setState) => {
  console.log('applicationState', applicationState)
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${applicationState.credentials.access_token}`
  return fetchJSONSetState(url, setState, 'userProfile')
}

const getCredentials = (setState) => {
  if (window.location.href.match(/oauth2/))
    oauth2Client.token.getToken(window.location.href).then(response => {
      const credentials = response.data
      setState({ credentials })
      localStorage.setItem('credentials', JSON.stringify(credentials))
      applicationState.credentials = credentials
      window.history.pushState('', 'Login succcessful', '/success-login')
    })
}

const getInitialState = () => {
  const credentials = localStorage.getItem('credentials')
  const state = {}
  try {
    applicationState.credentials = state['credentials'] = JSON.parse(credentials)    
    console.log(applicationState.credentials)
  } catch (e) {
      localStorage.removeItem('credentials')
  }
  return state
}

const UserProfile = ({ userProfile }) => {
  return (<div>
    {userProfile.name}
    <img className="profile" alt={userProfile.name} src={userProfile.picture} />
  </div>)
}

const getDags = (setState) => {    
    const url = `http://debian.tenk.co:5000/api/dags`
    return fetchJSONSetState(url, setState, 'dags')
}

class App extends React.Component {

  componentDidMount() {
    if (applicationState.credentials) {
      getUserProfile(this.setState.bind(this))
    }
  }

  logout() {
    localStorage.removeItem('credentials')
    window.location.href = '/logout'
  }

  render() {
    
    const setState = this.setState.bind(this)
    const uri = googleoauth2.token.getUri([])
    if (!this.state.credentials) {
      getCredentials(setState)
    }
    const dags = this.state.dags || []
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {(this.state.userProfile && <UserProfile userProfile={this.state.userProfile} />) || <button><a href={uri}>Login</a></button>}
          <button onClick={() => this.logout()}>Logout</button>
        </div>
        <div>
          <button onClick={() => getDags(setState)}>Get DAGS</button>
        </div>
        <div>
          <table>
            <tbody>
              {dags.map(dag => {
                return (
                  <tr key={dag.dag_id}>
                    <td><div>{dag.dag_id}</div></td>
                    <td><div>{dag.owners}</div></td>
                    <td><div>{new Date(Date.parse(dag.last_scheduler_run)).toLocaleString()}</div></td>                    
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  state = getInitialState()

}

export default App;
