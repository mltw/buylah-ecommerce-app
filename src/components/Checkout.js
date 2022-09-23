import React, { Component } from 'react'
import NavBar from './NavBar';
import CartItem from './CartItem';
import { Layout, Breadcrumb, Button, Steps, message, Input, Form, Modal, Result } from 'antd';
import { Link } from 'react-router-dom';
import { findInfo } from '../actions';
import { collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
import { StepsContent, StepsAction } from './Styled'

const firebaseConfig = {
  apiKey: "AIzaSyDgQK1D1fnrto4i0CqGg9XhWbc0k_EtNaM",
  authDomain: "buylah-mltw.firebaseapp.com",
  projectId: "buylah-mltw",
  storageBucket: "buylah-mltw.appspot.com",
  messagingSenderId: "43961803360",
  appId: "1:43961803360:web:4dd3610ef8824f9aa8d905",
  measurementId: "G-L1C5PRX8P7"
};

// object to store some user information needed
var userDetails = {
    username: "",
    phoneNumber: "",
    email: ""
}

// find user information and store in userDetails 
const getUserDetails = async () => {
    // Initialize Firebase
    initializeApp(firebaseConfig);

    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "users"));
    
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().token === localStorage.getItem('token')){
            userDetails.username = doc.data().username;
            userDetails.phoneNumber = doc.data().prefix + doc.data().phone;
            userDetails.email = doc.data().email;
        }
    });
}

const { Content, Footer } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
  
class Checkout extends Component {
    state= {
        current: 0,
        isModalVisible: false,
        formEmail: "",
        formName: "",
        formAddress: "",
        formPhoneNum: "",
    }

    handleClose = () => {
        this.setState( s => ({...this.state, isModalVisible: false}))
    }

    componentDidMount(){
        // fetch items from cart in database
        this.props.func()

    }

    render() {
        getUserDetails();
        
        // the title and items to be rendered in each checkout stage
        const steps = [
            {
              title: 'Order summary',
              content: 
                this.props.cart.length===0 
                ?
                <h1> Cart is empty </h1>
                : 
                <div>
                    {this.props.cart.map(
                    product => 
                    {
                    const {image, price, title} = findInfo(this.props.items, product.productID, product.quantity) 
                    return <CartItem canEdit={false} key={product.productID} image={image} price={price} title={title} productID={product.productID} quantity={product.quantity}/>
                    })}
                    
                    <div style={{margin: "20px", textAlign: "right"}}>
                        <h4> Shipping fees: RM 20 </h4>
                        <h2>Total price: RM
                            {(Math.round(this.props.cart.reduce((acc, current) => acc +current.price,0)*100)/100 + 20).toFixed(2)}
                        </h2>
                    </div>
                </div>  
            },
            {
              title: 'Delivery details',
              content:
                <Form
                    id="address-form"
                    onFinish={(values) => {this.setState( s => (
                        {...this.state, 
                            current: this.state.current+1,
                            formEmail: values.email,
                            formName: values.username,
                            formAddress: values.address,
                            formPhoneNum: values.phone
                        }))}
                    }
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    size = "large"
                    type="flex" justify="center" align="middle"
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                        "username":  userDetails.username,
                        "email": userDetails.email,
                        "phone": userDetails.phoneNumber
                    }}
                >
                    <Form.Item
                        name="username"
                        label="Receiver: "
                        rules={[
                            {
                            required: true,
                            message: 'Please input the receiver\'s name!',
                            },
                        ]}>
                        <Input 
                            placeholder="Enter receiver's name" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Delivery address:"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your delivery address!',
                            },
                        ]}>
                    
                        <TextArea placeholder="Enter your delivery address" autoSize />
                    </Form.Item>
  
                    <Form.Item
                        name="email"
                        label="Email: "
                        rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                        ]}>
                        <Input 
                            placeholder="Enter your email" />
                    </Form.Item>
  
                    <Form.Item
                        name="phone"
                        label="Phone number:"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Phone number!',
                        },
                        ]}>
                        <Input
                            placeholder="Enter your phone number"
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="details"
                        label="Additional delivery details:"
                        >
                        <Input
                            placeholder="eg: Deliver during working hours (9am-6pm)"
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>
                </Form>
            },
            {
                title: 'Payment',
                content: 
              
                <Form
                    id="payment-form"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={(values) => {
                        message.loading('Placing order...', 1.5)
                        this.props.onCheckoutOrder(values, this.state, this.props.cart)
                        setTimeout( () => {
                            this.setState( s => ({current: 0, isModalVisible: true}))
                        }, 2000)
                    }
                    }
                    size = "large"
                    type="flex" justify="center" align="middle"
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                >
                    <Form.Item
                        name="cardnum"
                        label="Credit card number: "
                        rules={[
                            {
                                required: true,
                                message: 'Please input your credit card number!',
                            },
                            {
                                pattern: /([0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4})/,
                                message: "Please enter a valid card number"
                            },
                            {   max: 19, 
                                message: "Please enter a valid card number"
                            }
                        ]}>
                        <Input placeholder="0123 4567 8910 1112" />
                    </Form.Item>

                    <Form.Item
                        name="cvv"
                        label="CVV:"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your CVV!',
                            },
                            {
                                min: 3, 
                                message: "CVV only has 3 numbers"
                            },
                            {
                                max: 3, 
                                message: "CVV only has 3 numbers"
                            }
                        ]}>
                        <Input placeholder="123" />
                    </Form.Item>
  
                    <Form.Item
                        name="expdate"
                        label="Expiration date: "
                        rules={[
                            {
                                required: true,
                                message: 'Please input your card expiration date!',
                            },
                            {   
                                pattern: /([0-9][0-9]\/[2-9][0-9])/,
                                message: "Please enter a valid expiration date"
                            },
                            {   max: 5, 
                                message: "Please enter a valid expiration date"
                            }
                        ]}>
                        <Input placeholder="00/00" />
                    </Form.Item>
                </Form>
            }
        ];
          
        return (
            <Layout className="layout">
                <NavBar page={"cart"} logoutFunc = {this.props.logoutFunc}/>

                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>
                            <Link to="/cart">
                                Shopping Cart
                            </Link>
                        </Breadcrumb.Item>

                        <Breadcrumb.Item>
                            Checkout
                        </Breadcrumb.Item>
                  </Breadcrumb>

                  <div className="site-layout-content" 
                        style={{background:"white", minHeight: "100vh", padding: "24px"}}>
                        <Steps current={this.state.current} style={{paddingLeft:"20px", paddingRight: "20px"}}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>

                        {/* display the content declared above in "steps", based on current stage of process */}
                        <StepsContent>
                            {steps[this.state.current].content}
                        </StepsContent>
                    
                        {/* display the available buttons/actions on each stage of process */}
                        <StepsAction>
                            {/* at first step, only have "back to cart" button available */}
                            {this.state.current === 0 && (
                                <Button style={{ margin: '0 8px' }} >
                                    <Link to="/Cart">
                                        Back to Cart
                                    </Link>
                                </Button>
                            )}

                            {/* 2nd and above steps can have "previous" button */}
                            {this.state.current > 0 && (
                                <Button style={{ margin: '0 8px' }} onClick={() => this.setState( s => ({...this.state, current: this.state.current-1}))}>
                                    Previous
                                </Button>
                            )}

                            {/* 2nd and above steps (except last step) can have "next" button */}
                            {this.state.current < (steps.length - 1) && (this.props.cart.length!==0) && (

                                (this.state.current === 1
                                ?
                                <Button type="primary" form="address-form" key="submit" htmlType="submit" >
                                    Next
                                </Button>
                                :
                                <Button type="primary" onClick={() => this.setState( s => ({...this.state, current: this.state.current+1}))}>
                                    Next
                                </Button>)

                            )}

                            {/* last step would have "place order" button */}
                            {this.state.current === steps.length - 1 && (
                                <Button type="primary" 
                                    form="payment-form" key="submit" htmlType="submit"
                                >
                                    Place Order
                                </Button>
                            )}
                            
                        </StepsAction>
                    </div>

                    <Modal title="Order confirmation" visible={this.state.isModalVisible} footer={null}>
                        <Result
                            status="success"
                            title="Your order was placed successfully!"
                            subTitle={"Order number: #"+ Math.floor((Math.random() * 100) + 10)+
                                        " was placed at " + this.props.orderSummary.time + ". A confirmation email has been sent to your email."}
                            extra={[
                                // if orderSummary is empty, don't need to render it
                                Object.keys(this.props.orderSummary).length === 0 ?
                                <></> 
                                :
                                <div style={{textAlign: "left"}}>
                                    <hr></hr>
                                    <h3 style={{textAlign: "center"}}>Order Summary</h3>
                                    <p>Receiver name: {this.props.orderSummary.username} ({this.props.orderSummary.phone})</p>
                                    <p>Email: {this.props.orderSummary.email}</p>
                                    <p>Address: {this.props.orderSummary.address}</p>
                                    <p>Items:</p>
                                    <ol>{this.props.orderSummary.orderItems.map((item)=>{
                                        return <li key={item.productID}>{item.productTitle} <b>x {item.quantity}</b></li>
                                    })}
                                    </ol>
                                    <p style={{textAlign: "right"}}>
                                        <b>Total price: RM
                                        {(Math.round(this.props.orderSummary.orderItems.reduce(
                                            (acc, current) => acc + current.price,0)*100)/100 + 20).toFixed(2)}
                                        </b>
                                    </p>
                                    <hr></hr>
                                </div>,
                                <br></br>,
                                <Button type="primary" onClick={this.handleClose}>
                                    <Link to="/home">
                                        Back to home
                                    </Link>
                                </Button>
                            ]}
                        />

                    </Modal>
                </Content>

                <Footer style={{ textAlign: 'center' }}>BuyLah © 2021</Footer>
            
            </Layout>
        )
    }
}

export default Checkout
