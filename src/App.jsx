import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import ReadFiles from '../components/Fileparser'

const electron = window.require('electron')
const path = window.require('path')
const ipc = electron.ipcRenderer
const fs = window.require('fs')
//const dir = path.join($dirname, '/../public/cmpetch.erf')
const dir =
	'/Users/Professional/Documents/MyPrograms/JavaScript/Genesis/erfeditor/ERF-editor/public/cmpetch.erf'

// const ReadFiles = (props) => {
// 	var contents = fs.readFileSync(props.dir, 'utf8')
// 	var lines = contents.split('\n')
// 	for (var i = 0; i < lines.length; i++) {
// 		// cont each line
// 	}
// 	return <div>From File: {contents}</div>
// }

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
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Welcome to The Running App</h2>
				</div>
				<p className="App-intro">Hello Electron! </p>
				<ReadFiles dir={dir} />
			</div>
		)
	}
}

export default App
