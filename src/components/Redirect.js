import React, { Component } from 'react'
import {Button, Result } from 'antd';
import { Link } from 'react-router-dom';

class Redirect extends Component {
    render() {
        console.log(this.props.promptSignIn)
        return (
          <Result
            status="404"
            title="404"
            subTitle= "Oops.. The page you are searching for doesn't exist"
            extra={this.props.promptSignIn === true ?
                <Button type="primary" shape="round" size="large">
                    <Link to="/">
                        Sign In
                    </Link>
                </Button>
                :
                <Button type="primary" shape="round" size="large">
                        <Link to="/home">
                            Back to Home
                        </Link>
                </Button>
            }
          />
        )
    }
}

export default Redirect
