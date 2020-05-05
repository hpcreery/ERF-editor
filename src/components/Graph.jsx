import React, { Component } from 'react'
import PropTypes from 'prop-types'
var Chart = require('chart.js')
import './Theme.css'

export class Rangegraph extends Component {
	constructor(props) {
		super(props)
		this.plotdata = this.props.plotdata
		this.ERFmodels = this.props.ERFmodels
		this.graphrange = this.props.graphrange

		this.state = {}
	}
	static propTypes = {}

	graphFilter = (workingrange) => {
		var colors = ['red', 'yellow', 'green']
		colors.forEach((color) => {
			workingrange[color].forEach(this.filter)
		})
		//this.plotdata[this.state.currentrange].green.forEach(this.filter)
		console.log(workingrange)
	}

	filter = (currentValue, index, parentarray) => {
		if (Number(currentValue) >= 100) {
			parentarray[index] = null
			//console.log(currentValue)
		}
	}

	chartRef = React.createRef()
	//rangeChart = new Chart()

	buildChart = () => {
		this.graphFilter(this.plotdata[this.graphrange])
		if (typeof this.rangeChart !== 'undefined') this.rangeChart.destroy()

		const chartref = this.chartRef.current.getContext('2d')
		this.rangeChart = new Chart(chartref, {
			type: 'horizontalBar',

			data: {
				labels: this.ERFmodels,
				datasets: [
					{
						label: ' Mils',
						steppedLine: 'after',
						data: this.plotdata[this.graphrange].red,
						backgroundColor: 'rgba(99, 10, 10, 0.5)',
						borderColor: 'rgba(99, 10, 10, 1)',
						borderWidth: 1,
					},
					{
						label: ' Mils',
						data: this.plotdata[this.graphrange].yellow,
						steppedLine: 'after',
						backgroundColor: 'rgba(99, 99, 10, 0.5)',
						borderColor: 'rgba(99, 99, 10, 1)',
						borderWidth: 1,
					},
					{
						label: ' Mils',
						data: this.plotdata[this.graphrange].green,
						steppedLine: 'after',
						backgroundColor: 'rgba(10, 90, 10, 0.5)',
						borderColor: 'rgba(10, 90, 10, 1)',
						borderWidth: 1,
					},
				],
			},
			options: {
				tooltips: {
					backgroundColor: 'rgba(255, 255, 255, 0.9)',
					titleFontColor: '#000',
					bodyFontColor: '#000',
					borderColor: 'rgba(0, 0, 0, 0.3)',
					borderWidth: 1,
				},
				scales: {
					xAxes: [
						{
							stacked: false,
						},
					],
					yAxes: [
						{
							stacked: true,
							ticks: {
								beginAtZero: true,
							},
						},
					],
				},
			},
		})
	}

	componentDidMount() {
		//this.graphFilter(this.plotdata[this.graphrange])
		//this.graphFilter(this.plotdata[this.state.currentrange])
		//console.log(this.plotdata[this.state.currentrange].green)

		this.buildChart()
		//this.rangeChart.update()
	}

	componentDidReceiveProps(nextProps) {
		//this.graphFilter(nextProps.plotdata.green)
		//this.plotdata = nextProps.plotdata
		//this.graphrange = nextProps.graphrange
		//this.graphFilter(this.plotdata[this.graphrange])
		//this.rangeChart.update()
		this.buildChart
	}
	componentWillReceiveProps(nextProps) {
		this.plotdata = nextProps.plotdata
		this.graphrange = nextProps.graphrange
		this.ERFmodels = nextProps.ERFmodels
		console.log(this.plotdata[this.graphrange])
		this.buildChart()
	}

	componentDidUpdate() {
		//this.graphFilter(this.plotdata[this.graphrange])
		//console.log(this.plotdata[this.graphrange].red)

		console.log(this.plotdata[this.graphrange])
		console.log('We got something here')
		//this.rangeChart.update()
		//this.buildChart()
		//this.rangeChart.update()
	}

	render() {
		return (
			<div>
				{this.graphrange}
				{}
				<canvas id="myChart" ref={this.chartRef} height="200" />
			</div>
		)
	}
}

export default Rangegraph
