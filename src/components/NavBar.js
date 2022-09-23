import { React, Component } from 'react';
import 'antd/dist/antd.css';
import { HomeOutlined, ShoppingCartOutlined, MenuOutlined } from '@ant-design/icons';
import { Layout, Menu, Modal, Result, Button } from 'antd';
import logo from '../BuyLah-logo.png'
import { Link } from 'react-router-dom';

const { Header } = Layout;
const { SubMenu } = Menu;

class NavBar extends Component {

    state = {
        isModalVisible: false
    }

    handleClose = () => {
        this.setState( s => ({isModalVisible: false}))
    }

    render() {
        return (
            <Header style={{overflow:"auto"}}>

            <div style={{overflow: "hidden"}}>
                <img src={logo} alt="Logo" 
                    style={{borderRadius:"5px", background:"white", maxWidth: "90px", 
                            overflow:"hidden", width:"100%", objectFit:"contain"}}/>
                
                <div style={{float:"right"}}>

                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={this.props.page === "cart"? ['cart'] : ['home']} >
                       
                        <Menu.Item key="home" icon={<HomeOutlined />}>
                            <Link to="/home">Home</Link>
                        </Menu.Item>

                        <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
                            <Link to="/cart">Cart</Link>
                        </Menu.Item>
                        
                        <SubMenu key="menu" icon={<MenuOutlined />} title="Menu">
                            <Menu.Item key="logout" 
                                onClick={()=>this.setState( s => ({isModalVisible:true}))}>
                                Log Out
                                {/* <SignoutButton /> */}
                            </Menu.Item>

                            <Menu.Item disabled key="profile">
                                Profile
                            </Menu.Item>
                        </SubMenu>

                    </Menu>
                </div>
            </div>

            <Modal visible={this.state.isModalVisible} 
                    onCancel={this.handleClose}
                    footer={[
                        <Button key="cancel" onClick={this.handleClose}>
                            Cancel
                        </Button>,
                        <Button key="logout" type="primary" onClick={this.props.logoutFunc}>
                            <Link to="/home">
                                Log Out
                            </Link>
                        </Button>,
                    ]}
            >
                <Result
                    title="Are you sure you want to log out?"
                    subTitle="Items added into your cart will be saved">
                </Result>
            </Modal>
        </Header>
    )}
}

export default NavBar
