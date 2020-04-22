import React, { Component } from 'react'
//import { render } from 'react-dom'
//import ReactDOM from 'react-dom';
import './App.css'

const electron = window.require('electron')
const path = window.require('path')
const ipc = electron.ipcRenderer
const fs = window.require('fs')
//const dir = path.join($dirname, '/../public/cmpetch.erf')
//const dir =
//('/Users/Professional/Documents/MyPrograms/JavaScript/Genesis/erfeditor/ERF-editor/public/cmpetch.erf')


class ReadFiles extends Component {
	
	componentWillMount() {
		this.contents = fs.readFileSync(this.props.dir, 'utf8')
		var lines = this.contents.split('\n')
		for (var i = 0; i < lines.length; i++) {
			// cont each line
		
		}
	}
	render() {
		return (
			<div>
				From File: {this.contents}
			</div>
		);
	}
}

export default ReadFiles