import React, { Component } from 'react'
import 'antd/dist/antd.css';
import EditableTable from './EditableTable';
export default class App extends Component {
  render() {
    return (
      <div className="container"> 
      <h1 style={{marginLeft:'40%'}}>Verizon AR Campaign Management System</h1>
        <EditableTable/>
      </div>
    )
  }
}
