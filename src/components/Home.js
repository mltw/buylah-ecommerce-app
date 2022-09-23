import { React, Component } from 'react';
import NavBar from './NavBar';
import Item from './Item';
import 'antd/dist/antd.css';
import { Layout, Breadcrumb, Result } from 'antd';
import SearchBox from './SearchBox';

const { Content, Footer } = Layout;

class Home extends Component {
    componentDidMount(){
        this.props.func()
    }

    render() {
        return (            
            <Layout className="layout">

                <NavBar logoutFunc = {this.props.logoutFunc}/>
                
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                    </Breadcrumb>

                    <div style={{background:"white", minHeight: "100vh", padding: "30px", textAlign: "center"}}>
                        <SearchBox func = {this.props.func}/>
                        
                        {/* Items displayed here*/}
                        {this.props.items.length === 0 
                        ? 
                        <Result
                            status="404"
                            title="There are no such items matching your search"
                        />
                        : 
                        <div>
                        
                        {this.props.items.map(item => {
                            return (
                                <Item 
                                    onUpdateCart = {this.props.onUpdateCart}
                                    key = {item.id}
                                    id = {item.id}
                                    title = {item.title}
                                    price = {item.price}
                                    image = {item.image}
                                    description = {item.description}
                                    category = {item.category}
                                />
                            )
                        })}
                        </div>
                        }
                    </div>
                </Content>

                <Footer style={{ textAlign: 'center' }}>BuyLah © 2021</Footer>

          </Layout>
        )
    }
}

export default Home
