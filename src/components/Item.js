import React, { Component } from 'react'
import { Card } from 'antd';
import { Modal, Button, message } from 'antd';

const { Meta } = Card;

class Item extends Component {

    state = {
        isModalVisible: false
    }

    showModal = (e) => {
        e.stopPropagation();
        this.setState( s => ({isModalVisible: true}))
    };

    handleClose = (e) => {
        e.stopPropagation();
        this.setState( s => ({isModalVisible: false}))
    };

    render() {

        const { id, title, price, image, description, category, onUpdateCart } = this.props

        return (
            <Card
                onClick={this.showModal} 
                hoverable
                style={{ maxWidth:"200px", border: "0px solid grey", display: "inline-block", margin: '20px', textAlign: "left"}}
                cover={
                    <img alt={"product" + id} src={image} style={{maxHeight: "200px", maxWidth:"200px", padding: "20px"}}/>
                }

                actions={[
                    <Button type="default" style={{borderRadius: "2px"}} onClick = {e => {
                        e.stopPropagation()
                        message.success('Item added to cart!')
                        onUpdateCart(id, title, price, 0, 'INCREMENT')
                    }}>
                    Add to cart
                    </Button>
                ]}
            >

                <Meta
                    title={title}
                    description={"RM"+price}
                />

                <Modal maskClosable title="Product details" visible={this.state.isModalVisible} 
                    onCancel={this.handleClose} 
                    footer={[
                        <Button key="back" onClick={this.handleClose}>
                            Close
                        </Button>,
                        <Button key="submit" type="primary" 
                            onClick={ (e) => {
                                e.stopPropagation();
                                this.props.onUpdateCart(id, title, price, 0, 'INCREMENT')
                                message.success('Item added to cart!')
                                this.setState( s => ({isModalVisible: false}))
                                }} >
                            Add to cart
                        </Button>,
                    ]}>
                    <p>Name: {title}</p>
                    <p>Category: {category}</p>
                    <p>Description: {description}</p>
                </Modal>
            </Card>
        )
    }
}

export default Item
