import React, { Component } from 'react'
import { Input } from 'antd'

const { Search } = Input;

class SearchBox extends Component {
    render() {
        return (
            <div>
                <Search 
                    size="large"
                    placeholder="Search items" 
                    allowClear 
                    onSearch= {(value) => this.props.func(value) } 
                    onChange = {(event) => this.props.func(event.target.value)}
                    style={{ maxWidth: 400 }} />
            </div>
        )
    }
}

export default SearchBox
