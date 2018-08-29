import React, { Component } from "react";
import Pagination from "react-js-pagination";
require("bootstrap/less/bootstrap.less");


export default class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
    activePage: 8   
    };
    this.handlePageChange = this.handlePageChange.bind(this)
  }
 
  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({activePage: pageNumber});
  }
 
  render() {
    return (
      <div>
        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={2}
          totalItemsCount={3}
          pageRangeDisplayed={8}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }  
}
