import React, { Component } from 'react'
//import { render } from 'react-dom'
//import ReactDOM from 'react-dom';
import './File.css'

const electron = window.require('electron')
const path = window.require('path')
const ipc = electron.ipcRenderer
const fs = window.require('fs')
//const dir = path.join($dirname, '/../public/cmpetch.erf')
//const dir =
//('/Users/Professional/Documents/MyPrograms/JavaScript/Genesis/erfeditor/ERF-editor/public/cmpetch.erf')

// const lineReplace = require('line-replace')
// lineReplace({
//   file: 'a-file.txt',
//   line: 42,
//   text: 'Answer to the Ultimate Question of Life, the Universe, and Everything.',
//   addNewLine: true,
//   callback: ({file, line, text, replacedText}) => {}
// })

// 0205 p. 1002
// Init
// =======
// .name
// .uid
// .menu
// .modify <= if the program is modifying data
// .menu
//
// .param <= rudundant only on init
//
// Redundant Set
// =======
// .model
// .units
// .colors
//
// .ranges	.o	#
// .pdef	.o	#
// .vars	.o	#
// =======

// this.setState((state) => {
// 	return {quantity: state.quantity + 1};
//   });

class ReadFiles extends Component {
	jsonstruct = (startline) => {
		this.erf = {}
		for (var i = 0; i < this.lines.length; i++) {
			this.erf[i] = { string: this.lines[i] }

			if (this.lines[i].startsWith('.')) {
				var value = this.erf[i].string.split(' ').slice(1).join(' ')
				var header = this.erf[i].string.split(' ').shift()
				console.log(header)
				console.log(value)
			}

			//console.log(i)
			if (header == '.name') {
				//console.log('we got one')
			}
		}

		// if (this.lines[i].startsWith('.name')) {
		// 	var value = this.lines[i].split(" ").splice(1).join(" ")
		// 	this.erf.name = value

		// }
		// if (this.lines[i].startsWith('.uid')) {
		// 	var value = this.lines[i].split(" ").splice(1).join(" ")
		// 	this.erf.uid = value
		// }
		// if (this.lines[i].startsWith('.menu')) {
		// 	var value = this.lines[i].split(" ").splice(1).join(" ")
		// 	this.erf.menu = value
		// }
		// // cont each line
		// if (this.lines[i].startsWith('.params')) {
		// 	var value = this.lines[i].split(" ").splice(1).join(" ")
		// 	this.erf.params = value
		// }

		// if (this.lines[i].startsWith('.model')) {

		// 	var value = this.lines[i].split(" ").splice(1).join(" ")
		// 	//this.erf.model = {"name": value}
		// 	this.erf[i] = {"name": value}
		// 	//this.erf.model.name = value
		// }

		// if (this.lines[i].startsWith('.')) {

		// }
		console.log(this.erf)
		//console.log(JSON.stringify(this.erf))
	}

	modelstruct = () => {}

	componentDidMount() {
		this.jsonstruct()
		this.modelstruct()
	}

	componentWillMount() {
		this.contents = fs.readFileSync(this.props.dir, 'utf8')
		this.lines = this.contents.split('\n')
		//this.modelstruct(1)
	}
	render() {
		return <div className="Text-header">From File: {this.contents}</div>
	}
}

export default ReadFiles
