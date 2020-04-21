import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

const electron = window.require('electron')
const ipc = electron.ipcRenderer
const fs = window.require('fs')
const dir = 'C:\\Users\\huntercreery\\Documents\\Projects\\JS\\ERF\\editor\\public\\text.txt'



const ReadFiles = (props) => {
	var contents = fs.readFileSync(props.dir, 'utf8')
	return (
		<div>
			From Function: {contents}
		</div>
	)
}

class App extends Component {
	


	componentDidMount() {
		
		ipc.send('synchronous-message', 'ping')
		ipc.on('synchronous-reply', (event, arg) => {
			console.log(arg) // prints "pong"
		  })
		

	}

	componentDidUpdate() {

	}



	render() {
		
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Welcome to The Running App</h2>
				</div>
				<p className="App-intro">Hello Electron! </p>
				<ReadFiles dir={dir}/>
			</div>
		)
	}
}

export default App