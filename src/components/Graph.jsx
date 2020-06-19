import React, { Component } from 'react'
import PropTypes from 'prop-types'
var Chart = require('chart.js')
import './Theme.css'
import {
	Divider,
	Sticky,
	Icon,
	Menu,
} from 'semantic-ui-react'
import { Slider } from 'react-semantic-ui-range'
import Graphdata from './Graphdata'

export class Rangegraph extends Component {
	constructor(props) {
		super(props)
		this.plotdata = this.props.plotdata
		this.ERFmodels = this.props.ERFmodels
		this.graphrange = this.props.graphrange
		this.max = 20

		this.state = {
			graphrange: this.graphrange,
			max: this.max,
			plotdata: this.plotdata,
		}
	}
	static propTypes = {}

	// INACTIVE: can be used to filter points to chart
	graphFilter = (workingrange) => {
		var colors = ['red', 'yellow', 'green']
		colors.forEach((color) => {
			console.log(workingrange[color])
			workingrange[color].forEach(this.filter)
		})
	}

	// INACTIVE: can be used to filter points to chart
	filter = (currentValue, index, parentarray) => {
		if (Number(currentValue) >= 1000) {
			//parentarray[index] = null
		}
	}

	chartRef = React.createRef()


	// Main Method for Range Chart using Chart.js
	buildChart = () => {
		Chart.Tooltip.positioners.custom = function (elements, position) {
			if (!elements.length) {
				return false
			}
			var offset = 0
			//adjust the offset left or right depending on the event position
			if (elements[0]._chart.width / 2 > position.x) {
				offset = 2
			} else {
				offset = -2
			}
			return position
		}
		this.graphFilter(this.state.plotdata[this.graphrange])
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
						data: this.state.plotdata[this.state.graphrange].red,
						backgroundColor: 'rgba(99, 10, 10, 1)',
						borderColor: 'rgba(99, 10, 10, 1)',
						borderWidth: 1,
						maxBarThickness: 40,
						minBarLength: 1,
					},
					{
						label: ' Mils',
						data: this.state.plotdata[this.state.graphrange].yellow,
						steppedLine: 'after',
						backgroundColor: 'rgba(99, 99, 10, 1)',
						borderColor: 'rgba(99, 99, 10, 1)',
						borderWidth: 1,
						maxBarThickness: 40,
						minBarLength: 1,
					},
					{
						label: ' Mils',
						data: this.state.plotdata[this.state.graphrange].green,
						steppedLine: 'after',
						backgroundColor: 'rgba(10, 90, 10, 1)',
						borderColor: 'rgba(10, 90, 10, 1)',
						borderWidth: 1,
						maxBarThickness: 40,
						minBarLength: 1,
					},
				],
			},
			options: {
				animation: false,
				tooltips: {
					enabled: true,
					mode: 'index',
					position: 'custom',
					intersect: true,
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
							ticks: {
								max: this.state.max,
								min: 0,
								stepSize: 1,
								fontColor: "white",
							},
							gridLines: { color: "#707275" },
							scaleLabel: {
								display: true,
								labelString: 'Mils',
								fontColor:'#FFFFFF',
								fontSize: 10
							},
						}
						,
					],
					yAxes: [
						{
							stacked: true,
							ticks: {
								beginAtZero: true,
								fontColor: "white",
							},
							gridLines: { color: "#707275" }
						},
					],
				},
			},
		})
	}

	// Called from Pretty to update Range to Graph
	newGraph = (newgraphrange, newplotdata) => {
		console.log('Rendering new graph')
		this.graphrange = newgraphrange
		this.setState({ graphrange: newgraphrange })
	}

	// Called from Pretty to update Grah Data dn Range
	newGraphData = (dir) => {
		console.log('Rendering new graph with new data')
		this.plotdata = Graphdata(dir)
		this.setState({ plotdata: this.plotdata })
	}

	render() {
		console.log('Initiating render method')

		return (
			<div>
				<Sticky offset={41} context={this.titleRef}>
					<Menu inverted>
						<Menu.Item>
							<Icon name='chart bar'></Icon>
						</Menu.Item>
						<Menu.Item>Range: {this.graphrange}</Menu.Item>
					</Menu>
					<Divider />
				</Sticky>
				<canvas id='myChart' ref={this.chartRef} height='200' />
				<Slider
					value={this.state.max}
					color='grey'
					settings={{
						start: 2,
						min: 1,
						max: 100,
						step: 1,
						onChange: (value) => {
							this.setState({ max: value })
							console.log(value)
						},
					}}
				/>
				<div className='Spacer'></div>
			</div>
		)
	}

	// Life-Cycle Methods
	componentDidMount() {
		console.log('Component just Mounted')
		this.buildChart()
	}
	componentWillMount() {
		console.log('Component is about to be Mounted')
	}

	componentWillReceiveProps(nextProps) {
		console.log('Component is about to recieve props')
		this.plotdata = nextProps.plotdata
		this.graphrange = nextProps.graphrange
		this.ERFmodels = nextProps.ERFmodels
		this.setState({ graphrange: this.graphrange })
		this.setState({ plotdata: this.plotdata })
		console.log(this.plotdata)
		console.log(this.graphrange)
		console.log(this.plotdata[this.graphrange])
	}

	componentDidUpdate() {
		console.log('Component just Updated')
		console.log(this.plotdata[this.graphrange])
		this.buildChart()
	}

	componentWillUpdate() {
		console.log('Component is about to update')
	}

}

export default Rangegraph
