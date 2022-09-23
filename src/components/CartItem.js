import React, { Component } from 'react'
import { Layout, Popover, Button, InputNumber, Modal, Result } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

class CartItem extends Component {

    state = {
        isModalVisible: false
    }

    // to handle closing of confirmation of deletion modal
    handleClose = () => {
        this.setState( s => ({...this.state, isModalVisible: false}))
    }

    render() {
    return (
        <div>
            <Layout style={{margin: "20px", border: "0px black solid", textAlign:"center", 
                            boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.0px"}}>
                <Sider theme="light">
                    <div style={{maxWidth: "300px", overflow:"hidden", margin:"auto", padding: "10px"}}>
                        <img src={this.props.image} alt="Logo" 
                            style={{width:"80%", maxHeight: "150px", objectFit:"contain", padding: "8px"}}/>
                    </div>
                </Sider>

                <Layout style={{margin: "10px"}}>
                    <Content style={{background:"clear", textAlign:"left"}}>
                        <h3> {this.props.title} </h3>
                        {this.props.canEdit === true 
                        ?
                        <h4>Quantity: 
                            <InputNumber min={1} max={10} defaultValue={this.props.quantity} style={{marginLeft: "10px"}}
                                onChange={(value) => this.props.onUpdateCart(this.props.productID, this.props.title, this.props.price, value, 'UPDATE')} />
                        </h4>
                        :
                        <h4> Quantity: {this.props.quantity} </h4>
                        }
                        <h4>Price: RM
                            {(Math.round((this.props.quantity * this.props.price)*100)/100).toFixed(2)} 
                        </h4>
                    </Content>
                    
                    {/* items in cart and not in checkout can be removed or edit their quantity */}
                    {this.props.canEdit === true 
                    ?
                    <Sider theme="light" style={{background: "#f0f2f5", margin:"auto"}} width="50">
                        <Popover content={"Remove item from cart"}>
                            <DeleteOutlined 
                                onClick={()=> this.setState(()=>({isModalVisible: true}))}
                                style={{fontSize: '16px', color:"red"}}/>
                        </Popover>
                    </Sider>
                    :
                    <></>
                    } 
                </Layout>

            </Layout>

        <Modal visible={this.state.isModalVisible} 
            onCancel={this.handleClose}
            footer={[
                <Button key = "cancel" onClick={this.handleClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" 
                    onClick={()=> 
                        this.props.onUpdateCart(this.props.productID, this.props.title, this.props.price, 0, 'DELETE')}
                    >
                    Confirm
                </Button>,
            ]}
         >
            <Result
                status="warning"
                title="Remove this item from your cart?"
                subTitle="This action can't be undone!">
            </Result>
        </Modal>
    </div>
    )}
}

export default CartItem
