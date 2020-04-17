import React, { Component } from 'react';
import Web3 from 'web3';
import { loadWeb3,
         loadAccount         
} from '../store/interactions' 
import { accountSelector } from '../store/selectors'
import './App.css';
import Meme from '../abis/Meme.json'
import Navbar from './Navbar'
import {connect} from 'react-redux' 
// create ipfs access
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData(dispatch) {
    const web3 = loadWeb3(dispatch)
    // Load account
    await loadAccount(web3, dispatch)
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({ contract })
      const memeHash = await contract.methods.get().call()
      this.setState({ memeHash })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
// react state objects
    this.state = {
      // here you create a state component memHash
      memeHash: '',
      contract: null,
      web3: null,
      buffer: null,
      account: null
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    //process the file into a buffer to send to ipfs
    const file = event.target.files[0]
    //this is done with reader
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  //Example hash: ""
  //Example url: https://ipfs.infura.io/ipfs/https://ipfs.infura.io/ipfs/

  onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    // from the documentation we can add state-file-buffer to ipfs which
    // is created from captureFile function 

    //cllback function retruns error and result
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      //if there was an error lets tell the console
      if(error) {
        console.error(error)
        return
      }
       this.state.contract.methods.set(result[0].hash).send({ from: this.props.account }).then((r) => {
         return this.setState({ memeHash: result[0].hash })
       })
    })
  }

  render() {
    return (
      <div>
       <Navbar/>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <h2>Meme Van De Dag</h2> 
               
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} alt=""/>
                              
                <p>&nbsp;</p>
                <h2>Verander de Meme</h2>
                <form onSubmit={this.onSubmit}>  
                <label class="custom-file-upload"> 
                <div class="upload-wrap">
                <button type="button" class="nice-button" >Kies de nieuwe meme</button>           
                  <input type='file' class='upload-btn' onChange={this.captureFile} />
                  </div>
                  <input type='submit' value='Verstuur en bevestig de metamask transaction' />
                  </label>

                </form>                
              </div>
            </main>

          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
   account: accountSelector(state)  
  }
}

export default connect(mapStateToProps)(App); 