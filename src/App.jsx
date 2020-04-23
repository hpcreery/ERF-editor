import React, { Component } from 'react'
import './App.css'
import ReadFiles from './components/Fileparser' // Components can only live in src folder where index resides

const electron = window.require('electron')
//const path = window.require('path')
const ipc = electron.ipcRenderer
//const fs = window.require('fs')
//const dir = path.join(__dirname, '/../public/cmpetch.erf')
//const dirc =
//	'/Users/Professional/Documents/MyPrograms/JavaScript/Genesis/erfeditor/ERF-editor/public/cmpetch.erf'
const dirc =
	'C:\\Users\\huntercreery\\Documents\\Projects\\JS\\ERF\\editor\\public\\cmpetch.erf'

class App extends Component {
	componentDidMount() {
		ipc.send('synchronous-message', 'ping')
		ipc.on('synchronous-reply', (event, arg) => {
			console.log(arg) // prints "pong"
		})
	}

	componentDidUpdate() {}

	render() {
		return (
			<div className="App">
				<ReadFiles dir={dirc} />
			</div>
		)
	}
}

export default App
