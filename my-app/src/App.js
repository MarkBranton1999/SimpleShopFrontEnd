import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import axios from 'axios';
import { Grid, Form, FormControl, Navbar, Glyphicon,
  Nav, NavItem, Well, Row, Col, Button, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LoginPage />
        </Route>
        <Route exact path="/create_account">
          <CreateAccount />
        </Route>
        <Route exact path="/shop">
          <ShopPage />
        </Route>
      </Switch>
    </Router>
  );
}

function CreateAccount(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const go_to_shop = () => {
    history.push("shop")
  }
  function create_account(e){
    e.preventDefault();
    axios.post('http://localhost:3000/create_account',{
      username: username,
      password: password
    }).then(res => {
      console.log(res);
      Cookies.set('username', username);
      Cookies.set('token', res.data.token);
      go_to_shop();
    });
  }
  return (
    <div className="App">
      <div className="App-header">
        <div className="Custom-header">
          <h1 style={{fontSize: "200%"}}>Create An Account</h1>
        </div>
        <Form onSubmit={create_account}>
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
                Create Account
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

function LoginPage(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const create_account = () => {
    history.push("create_account");
  }
  const go_to_shop = () => {
    history.push("shop");
  }
  function login(e){
    e.preventDefault();
    axios.get('http://localhost:3000/login/' + username + '/' + password).then(res => {
      console.log(res);
      Cookies.set('username', username);
      Cookies.set('token', res.data.token);
      go_to_shop();
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

function ShopPage(){
  const [isLoading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [itemsForCheckout, setItemsForCheckout] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0.00.toFixed(2));

  function mapInventoryToRow(index, invToMap, bound){
    //console.log(invToMap);
    var itemsInRow = [];
    for(var i = index; (i < index + bound) && (i < invToMap.length); i++ ){
      itemsInRow.push(invToMap[i]);
    }
    return itemsInRow;
  }

  function addToCart(item){
    //console.log("Hello");
    //console.log(item);
    var newItemsForCheckout = [...itemsForCheckout];
    console.log(itemsForCheckout);
    for(var i = 0; i < itemsForCheckout.length; i++){
      if(itemsForCheckout[i].productId === item.productId){
        newItemsForCheckout[i].quantity = (Number)(itemsForCheckout[i].quantity) + 1;
        setItemsForCheckout(newItemsForCheckout);
        setTotalPrice(((Number)(totalPrice) + (Number)(item.price)).toFixed(2));
        console.log(typeof totalPrice);
        return;
      }
    }
    var itemTmp = Object.assign({},item);
    itemTmp.price = (Number)(item.price).toFixed(2);
    itemTmp['quantity'] = 1;
    //console.log(itemTmp);
    //newItemsForCheckout.push(itemTmp);
    setItemsForCheckout(itemsForCheckout => [...itemsForCheckout, itemTmp]);
    setTotalPrice(((Number)(totalPrice) + (Number)(item.price)).toFixed(2));
    console.log(typeof totalPrice);
    return;

  }

  function checkout(e){
    e.preventDefault();
    axios.post('http://localhost:3000/place_order',{
      username: Cookies.get('username'),
      token: Cookies.get('token'),
      items: itemsForCheckout,
      total: totalPrice
    }).then(res => {
      console.log(res);
    });
  }
  useEffect(() => {
    axios.get('http://localhost:3000/inventory').then(res => {
      setInventory(res.data.data);
      setLoading(false);

    })
  }, []);

  if(isLoading){
    return (
      <div className="App">
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>
              SimpleShop
            </Navbar.Brand>
          </Container>
        </Navbar>
        <div className="App-header">
          <div className="Custom-header">
           <h1 style={{fontSize: "200%"}}>Loading...</h1>
          </div>
        </div>
      </div>
    );
  }
  else{
    return (
      <div className="App">
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>
              SimpleShop
            </Navbar.Brand>
          </Container>
        </Navbar>
        <div className="screen">
          <Container>
            <Row>
              <Col md={6}>
                <Container>
                  {inventory.map((item, index, inv) => {
                    if(index % 3 === 0){
                      return (
                      <Row>
                        <Col>
                          <Container>
                            <Row>
                              {mapInventoryToRow(index, inv, 3).map((itemInRow, index2, inv2) => {
                              return (
                              <Col>
                                  <br />
                                  <div><img src="https://via.placeholder.com/150" /></div>
                                  <div><h3>{itemInRow.productName}</h3></div>
                                  <div>${(Number)(itemInRow.price).toFixed(2)}</div>
                                  <div>Amount Available: {itemInRow.quantity}</div>
                                  <div>Product ID: {itemInRow.productId}</div>
                                  <Button variant="primary" onClick={() => addToCart(itemInRow)}>
                                    Add to Cart
                                  </Button>
                              </Col> );
                              })}
                            </Row>
                          </Container>
                        </Col>
                      </Row>);}
                  })}
                </Container>
              </Col>
              <Col md={6}>
                <Container>
                  <Row>
                    <Col>
                      <br />
                      <h1 style={{fontSize: "150%"}}>Checkout</h1>
                      <Container>
                        <Row>
                          {itemsForCheckout.map((item, index) => {
                            return (
                                <Col>
                                  <br />
                                  <div><img src="https://via.placeholder.com/150" /></div>
                                  <div><h3>{item.productName}</h3></div>
                                  <div>Quantity: {item.quantity}</div>
                                  <div>Product ID: {item.productId}</div>
                                  <div>Price: ${((Number)(item.price)*(Number)(item.quantity)).toFixed(2)}</div>
                                </Col>);
                          })}
                        </Row>
                      </Container>
                      <br />
                      <h3>Total: ${totalPrice}</h3>
                      <Button variant="success" onClick={(e) => checkout(e)}>
                        Checkout
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}
export default App;
