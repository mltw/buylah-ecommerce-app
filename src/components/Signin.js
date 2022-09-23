import { React, Component } from 'react';
import { Link } from 'react-router-dom';
import {  Col } from 'antd';
import { Form, Input, Button, Checkbox, Modal, Result } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import logo from '../BuyLah-logo.png';
import { StyledRow, StyledCol } from './Styled';

class Signin extends Component {
    state = {
        isModalVisible: false
    }

    handleClose = () => {
        this.setState( s => ({isModalVisible: false}))
    }

    render(){
    return (
        this.props.signedIn ?
        <h1>Youve signed in</h1>
        :
        <StyledRow type="flex" justify="center" align="middle">
            <Col span={6}></Col>

            <StyledCol span={12} type="flex" justify="center" align="middle">
                <div style={{maxWidth: "350px", overflow:"hidden"}}>
                    <img src={logo} alt="Logo" style={{width:"100%", objectFit:"contain"}}/>
                </div>

                <Form
                    size = "large"
                    type="flex" justify="center" align="middle"
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}

                    onFinish = {(values) => this.props.prop.onValidateUser(values)}
                >
                    <h1>Welcome back!</h1>
                    
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}>
                        <Input 
                            prefix={<MailOutlined className="site-form-item-icon" />} 
                            placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                            { min: 8, message: 'Password is a minimum of 8 characters.' }
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item style = {{paddingTop: "10px"}}>
                        <Button type="primary" shape="round" htmlType="submit" className="login-form-button" size="large">
                            Sign In
                        </Button>

                    </Form.Item>

                    <Form.Item>
                        <Button type="default" shape="round" className="login-form-button" size="large">
                            <Link to= "/signup">
                                Sign Up
                            </Link>
                        </Button>
                    </Form.Item>
                </Form>
            
            </StyledCol>

            <Col span={6}></Col>

            <Modal visible={this.state.isModalVisible} 
                onCancel={this.handleClose}
                footer={[
                    <Button key="submit" type="primary" onClick={this.handleClose}>
                        Got it
                    </Button>,
                ]}
            >
                <Result
                    status="error"
                    title="Sign in failed"
                    subTitle="Invalid email/password combination.">
                </Result>
            </Modal>
        </StyledRow>
        
        )
    }
}
export default Signin;
