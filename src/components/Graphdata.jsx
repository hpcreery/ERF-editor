import React from 'react'
const fs = window.require('fs')

// Updates plotdatat from directory given as a prop
function Graphdata(dir) {
	const colorArraySort = (rangearray, object, plotdata) => {
		if (plotdata[object] == undefined) {
			plotdata[object] = { red: [], yellow: [], green: [] }
		}
		if (object) {
			plotdata[object].red.push(rangearray[0])
			plotdata[object].yellow.push(rangearray[1])
			plotdata[object].green.push(rangearray[2])
		}
		return plotdata
	}

	const graphstruct = (dir) => {
		var contents = fs.readFileSync(dir, 'utf8')
		var lines = contents.split('\n')
		var filelength = lines.length
		console.log('there has been an update to the graph data structure')
		var plotdata = {}
		var erf

		// Iterate throght each line in .erf
		for (var i = 0; i < lines.length; i++) {
			var erf = { string: lines[i] }

			if (lines[i].startsWith('.')) {
				var value = erf.string.split(' ').slice(1).join(' ').concat('')
				var object = erf.string.split(' ').shift()
				if (
					object === '.name' ||
					object === '.uid' ||
					object === '.menu' ||
					object === '.modify'
				) {
				}
				if (object === '.param') {
				}
				if (object === '.model') {
				}
				if (object === '.range') {
					//this.plotdata[object] = {}
					var workingrange = object
				}
				if (object === '.pdef') {
				}
				if (object === '.vars') {
				}
			} else if (lines[i].startsWith('#')) {
			} else if (lines[i].startsWith(' ')) {
			} else if (lines[i].startsWith('\n')) {
			} else {
				var invalue = erf.string
					.split('=')
					.slice(1)
					.join('=')
					.concat('')
				var inobject = erf.string.split('=').shift().trim()
				var invalue = invalue.split('#')
				var comment = invalue[1]
				var invalue = invalue[0]

				// Line format:
				// object + ' ' + value + '#' + comment

				if (object === '.colors') {
				}
				if (object === '.ranges') {
					const rangearray = invalue.match(/-?\d+\.?\d*(?!o)/g) // old: -?\d+\.?\d*(?!o)
					colorArraySort(rangearray, inobject, plotdata)
				}
				if (object === '.pdef') {
				}
				if (object === '.vars') {
				}
			}
		}
		return plotdata
	}
	return graphstruct(dir)
}

export default Graphdata
