import React, { Component } from 'react'
import { accountSelector } from '../store/selectors'
import { connect } from 'react-redux'

class Navbar extends Component {
  render() {
   
  return(
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <a className="navbar-brand" href="/#">Meme van de dag</a>   
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">         
          <a 
          className="nav-link small"
          href={`https://etherscan.io/address/${this.props.account}`}
          target="_blank"
          rel="noopener noreferrer"
          >
          {this.props.account}
         
          </a>             
        </li>
      </ul>
    </nav>
    
    )

  }
}
function mapStateToProps(state) {
  return {
    account: accountSelector(state)
  }
}
export default connect(mapStateToProps)(Navbar)