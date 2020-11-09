import React, {useState, useEffect} from 'react'
import Web3 from 'web3'
import styled from 'styled-components'
//components
import Navbar from './components/layout/Navbar'
import Main from './components/Main'
//smart contract
import Decentragram from './contracts/Decentragram.json'
//ipfs
import ipfs from './utils/ipfs'

const App = () => {
  const [account, setAccount] = useState('')
  const [loading, setLoading] = useState(false)
  const [decentragram, setDecentragram] = useState(null)
  const [images, setImages] = useState([])
  const [imageCount, setImageCount] = useState(null)

  useEffect(() => {
	loadWeb3()
	loadBlockchainData()
  }, [])

  const loadWeb3 = async () => {
	  if(window.ethereum) {
		  window.web3 = new Web3(window.ethereum)
		  await window.ethereum.enable()
	  }
	  else if(window.web3) {
		  window.web3 = new Web3(window.web3.currentProvider)
	  }
	  else {
		  window.alert('Non etherium browser detected. Try Metamask extension!')
	  }
  }

  const loadBlockchainData = async () => {
	  setLoading(true)
	  const web3 = window.web3
	  const accounts = await web3.eth.getAccounts()
	  setAccount(accounts[0])

	  //get address on contrat
	  const networkId = await web3.eth.net.getId() 
	  const networkData = Decentragram.networks[networkId]
	  if(networkData) {
		const decentragram = new web3.eth.Contract(Decentragram.abi, networkData.address)
		setDecentragram(decentragram)
		const imageCount = await decentragram.methods.imageCount().call()
		setImageCount(imageCount)
		// console.log(imageCount)
		//images
		for (let i = 1; i <= imageCount; i++) {
			const image = await  decentragram.methods.images(i).call()
			setImages(oldArray => [...oldArray, image])
			// console.log(image)
		}

		//sort images
		setImages(oldArray => [...oldArray.sort((a, b) => b.tipAmount - a.tipAmount)])
	} else {
		window.alert('Decentragram not deployed!')
	  }
	  setLoading(false)
  }
  
  //upload to ipfs
  const uploadImage = async(data) => {
	console.log("uploading to ipfs....",data)

	ipfs.add(data.buffer, { onlyHash: true })
		.then((result) => {
			// console.log(result)
			//adding to BC
			setLoading(true)
			decentragram.methods.uploadImage(result.path, data.description).send({from: account}).on('transactionHash', (hash) => {
				setLoading(false)
			})
		})
		.catch(err => console.log(err))
  }

  //tip
  const tipOwner = async(id) => {
	  let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
	//   console.log(id, tipAmount)
	  setLoading(true)
	  decentragram.methods.tipImageOwner(id).send({from: account, value: tipAmount}).on('transactionHash', (hash) => {
		  	setLoading(false)
	  })
  }

  return (
    <>
      <Navbar account={account}/>
      <Wrapper>
        {
          loading 
          ? <h1 style={{marginTop: '6vh'}}>Loading...</h1>
          : <Main
				uploadImage={uploadImage}
				images={images}
				tipOwner={tipOwner}
		    />
        }
      </Wrapper>
    </>
  )
}

export default App

const Wrapper = styled.div`
	margin: 0 auto;
	width: 25rem;
	padding: 2rem 1rem;
`