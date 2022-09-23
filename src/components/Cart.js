import { React, Component } from 'react';
import { Link} from 'react-router-dom';
import { findInfo } from '../actions';
import NavBar from './NavBar';
import CartItem from './CartItem';
import 'antd/dist/antd.css';
import { Layout, Breadcrumb, Button, Result } from 'antd';
import { FrownOutlined } from '@ant-design/icons';

const { Content, Footer } = Layout;


class Cart extends Component {
    componentDidMount(){
        // fetch items from cart in database
        this.props.func()
        this.props.onRequestUserDetails()
    }
    render() {
        console.log("this.props.cart is", this.props.cart)
    return (
        <Layout className="layout">
        <NavBar page={"cart"} logoutFunc = {this.props.logoutFunc}/>

        <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Shopping Cart</Breadcrumb.Item>
            </Breadcrumb>

            <div className="site-layout-content" 
                style={{background:"white", minHeight: "100vh", padding: "24px"}}>
                {(this.props.cart === undefined || this.props.cart.length===0)
                ?
                <Result
                    icon={<FrownOutlined />}
                    title="Your cart is empty"
                />
                : 
                <div> {this.props.cart.map(
                    product => 
                    {
                    const {image, price, title} = findInfo(this.props.items, product.productID, product.quantity) || {}
                    return <CartItem onUpdateCart={this.props.onUpdateCart} canEdit={true} 
                            key={product.productID} image={image} price={price} title={title} 
                            productID={product.productID} quantity={product.quantity}/>
                    })}
                    <div style={{margin: "20px", textAlign: "right"}}>
                        <h3>
                            Total price: RM
                            {(Math.round(this.props.cart.reduce(
                                (acc, current) => acc +current.price,0)*100)/100).toFixed(2)}*
                        </h3>
                        <p><i>*Shipping fees excluded and are calculated at checkout</i></p>
                        
                        <Button type="primary" >
                            <Link to="/cart/checkout">
                                Proceed to checkout
                            </Link>
                        </Button>
                    </div>
                </div>
                }
            </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>BuyLah © 2021</Footer>
    </Layout>
    )}
}

export default Cart
