import React, { Component } from 'react'
import './Theme.css'
import Pretty from './Pretty'

const fs = window.require('fs')
const electron = window.require('electron').remote
const dialog = electron.dialog

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
	constructor(props) {
		super(props)
		this.opendir = this.props.opendir

		console.log(this.state.dir)
	}
	state = { dir: this.props.dir }

	componentWillReceiveProps(nextProps) {
		this.setState({ dir: String(nextProps.dir) })
		console.log('File parser recieved props')
		console.log(String(nextProps.dir))

		this.contents = fs.readFileSync(String(nextProps.dir), 'utf8')
		this.lines = this.contents.split('\n')
		this.modelstruct()
	}
	graphstruct = () => {
		this.graphERF = {}
		for (var i = 0; i < this.lines.length; i++) {
			this.erf[i] = { string: this.lines[i] }

			if (this.lines[i].startsWith('.')) {
				var value = this.erf[i].string
					.split(' ')
					.slice(1)
					.join(' ')
					.concat('')
				var object = this.erf[i].string.split(' ').shift()
				if (object === '.range\r') {
					this.workingrange = value
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

				}
				if (object === '.ranges\r') {

				}
				if (object === '.pdef\r') {

				}
				if (object === '.vars\r') {

				}
			}
		}

	}
	// This Data model is out not used due to convoluted methods
	jsonstruct = () => {
		this.rawjsonERF = {
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
					this.rawjsonERF.header[object] = {
						id: i,
						object: object,
						value: value,
					}
				}
				if (object === '.param') {
					this.rawjsonERF.params[i] = {
						id: i,
						object: object,
						value: value,
					}
				}
				if (object === '.model') {
					this.rawjsonERF.models[value] = {
						id: i,
						object: object,
						value: value,
					}
					var workingmodel = this.rawjsonERF.models[value].value
				}
				if (object === '.ranges\r') {
					this.rawjsonERF.models[workingmodel].ranges = {
						id: i,
						object: object,
					}
				}
				if (object === '.pdef\r') {
					this.rawjsonERF.models[workingmodel].pdef = {
						id: i,
						object: object,
					}
				}
				if (object === '.vars\r') {
					this.rawjsonERF.models[workingmodel].vars = {
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
					this.rawjsonERF.models[workingmodel].colors = {
						id: i,
						object: object,
						value: value,
					}
				}
				if (object === '.ranges\r') {
					this.rawjsonERF.models[workingmodel].ranges[inobject] = {
						id: i,
						object: inobject,
						value: invalue,
						comment: comment,
					}
				}
				if (object === '.pdef\r') {
					this.rawjsonERF.models[workingmodel].pdef[inobject] = {
						id: i,
						object: inobject,
						value: invalue,
						comment: comment,
					}
				}
				if (object === '.vars\r') {
					this.rawjsonERF.models[workingmodel].vars[inobject] = {
						id: i,
						object: inobject,
						value: invalue,
						comment: comment,
					}
				}
			}
		}
		//console.log(JSON.stringify(this.erf))
		console.log(this.rawjsonERF)
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
		//console.log(dialog.showOpenDialog())
		//this.jsonstruct() // run after react mount to init data
		//this.modelstruct()
	}

	componentWillMount() {
		this.contents = fs.readFileSync(this.state.dir, 'utf8')
		this.lines = this.contents.split('\n')
		this.filelength = this.lines.length
		this.modelstruct() // main model structure
		this.jsonstruct()
	}

	render() {
		console.log(this.state.dir)
		return (
			<div className="File-Contents">
				<Pretty
					jsonERF={this.jsonERF}
					filelength={this.filelength}
					ERFmodels={this.ERFmodels}
					dir={this.state.dir}
					opendir={this.props.opendir}
				/>
				{console.log(this.jsonERF)}
			</div>
		)
	}
}

export default ReadFiles
