import { React, Component } from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'antd';
import { DatePicker, Form, Input, Button, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import logo from '../BuyLah-logo.png'
import { StyledRow, StyledCol } from './Styled';

const { Option } = Select;

const prefixSelector = (
    <Form.Item name="prefix" noStyle>
        <Select
            style={{
                width: 80,
            }}
            placeholder="Code"
        >
        <Option value="60">+60</Option>
        <Option value="65">+65</Option>
        </Select>
    </Form.Item>
);

class Signup extends Component {

    render(){
    return (
        <StyledRow type="flex" justify="center" align="middle">

            <Col span={6}></Col>

            <StyledCol span={12} stype="flex" justify="center" align="middle">

                <div style={{maxWidth: "250px", overflow:"hidden"}}>
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
                    onFinish = {(values) => {
                        this.props.prop.onRegisterUser(values)
                    }}
                >
                    <h1>Sign Up for an account</h1>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                            // source for regex: https://www.w3resource.com/javascript/form/email-validation.php
                            {
                                pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ , 
                                message: "Please enter a valid email"
                            }
                        ]}>
                        <Input 
                            prefix={<MailOutlined className="site-form-item-icon" />} 
                            placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your Username!',
                            },
                            
                        ]}>
                        <Input 
                            prefix={<UserOutlined className="site-form-item-icon" />} 
                            placeholder="Enter a username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                            { 
                                min: 8, 
                                message: 'Password must be a minimum of 8 characters.' 
                            }
                        ]}
                    >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Enter a password min. 8 characters"
                    />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Phone number!',
                            },
                        ]}>
                        <Input
                            addonBefore={prefixSelector}
                            placeholder="Enter your phone number"
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>

                    <Form.Item 
                        name="dob"
                        rules={[
                            {
                                required: true,
                                message: 'Please select your Birth date!',
                            },
                        ]}>
                        <DatePicker 
                            placeholder="Select your birth date"
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>
    
                    <Form.Item style = {{paddingTop: "10px"}}>
                        <Button type="primary" shape="round" htmlType="submit" size="large">
                            Sign Up
                        </Button>
                    </Form.Item>
    
                    <Form.Item>
                        <Button type="default" shape="round" size="large">
                            <Link to= "/">Sign In</Link>
                        </Button>
                    </Form.Item>
            
                </Form>
        
            </StyledCol>
            
            <Col span={6}></Col>

        </StyledRow>
    )}
}

export default Signup
