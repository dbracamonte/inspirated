import React from 'react';
import Root from './components/root';
import HomePage from './pages/Home';
import LogInPage from './pages/LogIn';
import RegistryPage from './pages/Registry';
import RegisteredPage from './pages/Registered';
import Rateday from './pages/Rateday';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import GuardRoute from './components/guardRoute';
import { AuthContextProvider } from './context/auth';

const App = (
  <Router>
    <AuthContextProvider>
      <Root>
        <Switch>
          <GuardRoute type='public' exact path='/' component={HomePage} />
          <GuardRoute type='public' path='/login' component={LogInPage} />
          <GuardRoute type='public' path='/registry' component={RegistryPage} />
          <GuardRoute type='private' path='/registered' component={RegisteredPage} />
          <GuardRoute type='private' path='/rateday' component={Rateday} />
        </Switch>
      </Root>
    </AuthContextProvider>
  </Router>
)

export default App;