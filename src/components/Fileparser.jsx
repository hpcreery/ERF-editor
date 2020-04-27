import React, { Component } from 'react'
import './Theme.css'
import Pretty from './Pretty'

//import { appendFile } from 'fs'
//const electron = window.require('electron')
//const path = window.require('path')
//const ipc = electron.ipcRenderer
const fs = window.require('fs')
//const dir = path.join($dirname, '/../public/cmpetch.erf')
//const dir =
//('/Users/Professional/Documents/MyPrograms/JavaScript/Genesis/erfeditor/ERF-editor/public/cmpetch.erf')

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

class ReadFiles extends Component {
	jsonstruct = () => {
		this.jsonERF = {
			header: {},
			params: {},
			models: {},
		}
		this.erf = {}
		for (var i = 0; i < this.lines.length; i++) {
			this.erf[i] = { string: this.lines[i] }

			if (this.lines[i].startsWith('.')) {
				var value = this.erf[i].string
					.split(' ')
					.slice(1)
					.join(' ')
					.concat('')
				var object = this.erf[i].string.split(' ').shift()
				if (
					object === '.name' ||
					object === '.uid' ||
					object === '.menu' ||
					object === '.modify'
				) {
					this.jsonERF.header[object] = {
						id: i,
						object: object,
						value: value,
					}
				}
				if (object === '.param') {
					this.jsonERF.params[i] = {
						id: i,
						object: object,
						value: value,
					}
				}
				if (object === '.model') {
					this.jsonERF.models[value] = {
						id: i,
						object: object,
						value: value,
					}
					var workingmodel = this.jsonERF.models[value].value
				}
				if (object === '.ranges\r') {
					this.jsonERF.models[workingmodel].ranges = {
						id: i,
						object: object,
					}
				}
				if (object === '.pdef\r') {
					this.jsonERF.models[workingmodel].pdef = {
						id: i,
						object: object,
					}
				}
				if (object === '.vars\r') {
					this.jsonERF.models[workingmodel].vars = {
						id: i,
						object: object,
					}
				}
			} else if (this.lines[i].startsWith('#')) {
			} else if (this.lines[i].startsWith(' ')) {
			} else if (this.lines[i].startsWith('\r')) {
			} else {
				var invalue = this.erf[i].string
					.split(' ')
					.slice(1)
					.join(' ')
					.concat('')
				var inobject = this.erf[i].string.split(' ').shift()
				var invalue = invalue.split('#')
				var comment = invalue[1]
				var invalue = invalue[0]

				// Line format:
				// object + ' ' + value + '#' + comment

				if (object === '.colors') {
					this.jsonERF.models[workingmodel].colors = {
						id: i,
						object: object,
						value: value,
					}
				}
				if (object === '.ranges\r') {
					this.jsonERF.models[workingmodel].ranges[inobject] = {
						id: i,
						object: inobject,
						value: invalue,
						comment: comment,
					}
				}
				if (object === '.pdef\r') {
					this.jsonERF.models[workingmodel].pdef[inobject] = {
						id: i,
						object: inobject,
						value: invalue,
						comment: comment,
					}
				}
				if (object === '.vars\r') {
					this.jsonERF.models[workingmodel].vars[inobject] = {
						id: i,
						object: inobject,
						value: invalue,
						comment: comment,
					}
				}
			}
		}
		//console.log(JSON.stringify(this.erf))
		//console.log(jsonERF)
	}

	modelstruct = () => {
		this.jsonERF = []
		this.ERFmodels = []
		for (var i = 0; i < this.lines.length; i++) {
			if (this.lines[i].startsWith('.')) {
				var value = this.lines[i]
					.split(' ')
					.slice(1)
					.join(' ')
					.concat('')
				var object = this.lines[i].split(' ').shift()
				this.jsonERF.push({
					id: i,
					type: 'header',
					object: object,
					string: value,
				})
				//this.erf.push({'string': this.lines[i] })
				if (object === '.model') {
					//this.jsonERF.models[value] = {'id': i, 'object': object, 'value': value}
					var workingmodel = value
					this.ERFmodels.push(value)
				}
			} else if (this.lines[i].startsWith('#')) {
			} else if (this.lines[i].startsWith(' ')) {
			} else if (this.lines[i].startsWith('\r')) {
			} else {
				var invalue = this.lines[i]
					.split(' ')
					.slice(1)
					.join(' ')
					.concat('')
				var inobject = this.lines[i].split(' ').shift()
				var invalue = invalue.split('#')
				var comment = invalue[1]
				var invalue = invalue[0]
				this.jsonERF.push({
					id: i,
					type: 'sub',
					model: workingmodel,
					parent: object,
					object: inobject,
					string: invalue,
					comment: comment,
				})
			}
		}
		//console.log(JSON.stringify(this.erf))
		//console.log(this.jsonERF)
	}

	componentDidMount() {
		//this.jsonstruct() // run after react mount to init data
		//this.modelstruct()
	}

	componentWillMount() {
		this.contents = fs.readFileSync(this.props.dir, 'utf8')
		this.lines = this.contents.split('\n')
		this.filelength = this.lines.length
		this.modelstruct() // main model structure
		//this.jsonstruct()
	}
	render() {
		return (
			<div className="File-Contents">
				<Pretty
					jsonERF={this.jsonERF}
					filelength={this.filelength}
					ERFmodels={this.ERFmodels}
				/>
			</div>
		)
	}
}

export default ReadFiles
