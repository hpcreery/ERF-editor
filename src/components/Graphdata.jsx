import React from 'react'
const fs = window.require('fs')

function Graphdata(dir) {
	const colorArraySort = (rangearray, object, plotdata) => {
		console.log('umm ' + rangearray + object)
		if (plotdata[object] == undefined) {
			plotdata[object] = { red: [], yellow: [], green: [] }
		}
		if (object) {
			plotdata[object].red.push(rangearray[0])
			plotdata[object].yellow.push(rangearray[1])
			plotdata[object].green.push(rangearray[2])
		}
		//console.log(plotdata)
		return plotdata
	}

	const graphstruct = (dir) => {
		var contents = fs.readFileSync(dir, 'utf8')
		var lines = contents.split('\n')
		var filelength = lines.length
		//console.log(filelength)
		//graphstruct() // rearranged data for the graph
		console.log('there has been an update to the graph data structure')
		var plotdata = {}
		var erf

		for (var i = 0; i < lines.length; i++) {
			var erf = { string: lines[i] }
			//console.log(erf)

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
				if (object === '.ranges\r') {
					//this.plotdata[object] = {}
					var workingrange = object
				}
				if (object === '.pdef\r') {
				}
				if (object === '.vars\r') {
				}
			} else if (lines[i].startsWith('#')) {
			} else if (lines[i].startsWith(' ')) {
			} else if (lines[i].startsWith('\r')) {
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
				if (object === '.ranges\r') {
					const rangearray = invalue.match(/-?\d+\.?\d*(?!o)/g) //-?\d+\.?\d*(?!o)
					//console.log('here is a range' + rangearray)
					colorArraySort(rangearray, inobject, plotdata)
				}
				if (object === '.ranges') {
					const rangearray = invalue.match(/-?\d+\.?\d*(?!o)/g) //-?\d+\.?\d*(?!o)
					//console.log('here is a range' + rangearray)
					colorArraySort(rangearray, inobject, plotdata)
				}
				if (object === '.pdef\r') {
				}
				if (object === '.vars\r') {
				}
			}
		}
		//console.log(plotdata)
		return plotdata
	}
	return graphstruct(dir)
}

export default Graphdata
