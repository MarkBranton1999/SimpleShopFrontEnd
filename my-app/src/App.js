import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory
} from "react-router-dom";
import axios from 'axios';
import { Grid, Form, FormControl, Navbar, Glyphicon,
  Nav, NavItem, Well, Row, Col, Button, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App(props) {
  const history = useHistory();
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LoginPage />
        </Route>
        <Route exact path="/create_account">
          <CreateAccount />
        </Route>
      </Switch>
    </Router>
  );
}

function CreateAccount(){
  return <h2>Create An Account</h2>
}

function LoginPage(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const create_account = () => {
    history.push("create_account");
  }
  function login(e){
    e.preventDefault();
    axios.get('http://localhost:3000/login/' + username + '/' + password).then(res => {
          console.log(res);
    });
  }

  return (
    <div className="App">
      <div className="App-header">
        <div className="Custom-header">
          <h1 style={{fontSize: "200%"}}>Welcome to SimpleShop!</h1>
        </div>
        <Form onSubmit={login}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label></Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setUsername(e.target.value)}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
          </Form.Group>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Col>
            <Col md="auto">
              <Button variant="primary" onClick={create_account}>
                Create An Account
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
export default App;
