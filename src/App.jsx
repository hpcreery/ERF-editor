import React, { Component } from 'react'
import './App.css'
import ReadFiles from './components/Fileparser' // Components can only live in src folder where index resides

const electron = window.require('electron')
const dialog = electron.remote.dialog
//const path = window.require('path')
const ipc = electron.ipcRenderer
//const fs = window.require('fs')
//const dir = path.join(__dirname, '/../public/cmpetch.erf')
var dirc =
//	'/Users/Professional/Documents/MyPrograms/JavaScript/Genesis/erfeditor/ERF-editor/public/cmpetch.erf'
//const dirc =
	'C:\\Users\\huntercreery\\Documents\\Projects\\JS\\ERF\\editor\\public\\cmpetch.erf'



class App extends Component {
	state = {
		dir: dirc,
	}

	directoryopener = () => {
		//console.log(dialog.showOpenDialog())
		//dirc = dialog.showOpenDialog()
		//this.setState(dialog.showOpenDialog({ properties: ['openFile'] }))
		this.openedir = dialog.showOpenDialogSync({ properties: ['openFile'] })
		console.log(this.openedir)
		this.setState({dir: this.openedir})
	}

		

	

	componentDidMount() {
		ipc.send('synchronous-message', 'ping')
		ipc.on('synchronous-reply', (event, arg) => {
			console.log(arg) // prints "pong"
		})
		
	}

	componentDidUpdate() {}

	render() {
		return (
			<div>
				<div className="App">
					<ReadFiles dir={this.state.dir} opendir={this.directoryopener} />
				</div>
			</div>
		)
	}
}

export default App
