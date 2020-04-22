import React, { Component } from 'react'
//import '../App.css'

const electron = window.require('electron')
//const path = window.require('path')
//const ipc = electron.ipcRenderer
const fs = window.require('fs')
//const dir = path.join($dirname, '/../public/cmpetch.erf')
//const dir =
//('/Users/Professional/Documents/MyPrograms/JavaScript/Genesis/erfeditor/ERF-editor/public/cmpetch.erf')

export default class ReadFiles extends Component {
	ReadFiles = (props) => {
		this.contents = fs.readFileSync(props.dir, 'utf8')
		var lines = contents.split('\n')
		for (var i = 0; i < lines.length; i++) {
			// cont each line
		}
	}
	render() {
		return <div>From File: {this.contents}</div>
	}
}
