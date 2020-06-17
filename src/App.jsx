import React, { Component } from 'react'
import './App.css'
import ReadFiles from './components/Fileparser' // Components can only live in src folder where index resides
import PageDimmer from './components/PageDimmer'

const electron = window.require('electron')
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer

var dirc = 'temp'

class App extends Component {
	state = {
		dir: dirc,
		dim: true
	}

	directoryopener = () => {
		this.setState({ dim: true })
		this.openedir =
			dialog.showOpenDialogSync({
				filters: [{ name: 'External Rescource', extensions: ['erf'] }],
				properties: ['openFile'],
			}) || this.state.dir
		console.log(String(this.openedir) + ' Directory to open')
		this.setState({ dir: String(this.openedir) })
	}

	directoryList = () => {}


	render() {
		console.log('Initiating render method')

		return (
			<div>
				<div className='App'>
					<ReadFiles
						dir={this.state.dir}
						opendir={this.directoryopener}
					/>
				</div>
			</div>
		)
	}

	// Life-Cycle Methods
	componentDidMount() {
		console.log('Component just Mounted')
		ipc.send('synchronous-message', 'ping')
		ipc.on('synchronous-reply', (event, arg) => {
			console.log(arg) // prints "pong"
		})
	}

	componentWillMount() {
		console.log('Component is about to be Mounted')
		this.directoryopener()
	}

	componentDidUpdate() {
		console.log('Component just Updated')
	}
	
	componentWillUpdate() {
		console.log('Component is about to update')
	}
		


}

export default App
