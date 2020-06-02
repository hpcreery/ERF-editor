import React, { Component } from 'react'
import PropTypes from 'prop-types'
var Chart = require('chart.js')
import './Theme.css'
import {
	Button,
	Segment,
	Divider,
	Input,
	Label,
	Sticky,
	Icon,
	Popup,
	Rail,
	Grid,
	Menu,
	Table,
	Header,
	Placeholder,
	Ref,
	Sidebar,
	Dropdown,
} from 'semantic-ui-react'
import { Slider } from 'react-semantic-ui-range'

export class Rangegraph extends Component {
	constructor(props) {
		super(props)
		this.plotdata = this.props.plotdata
		this.ERFmodels = this.props.ERFmodels
		this.graphrange = this.props.graphrange
		this.max = 20

		this.state = { graphrange: this.graphrange, max: this.max }
	}
	static propTypes = {}

	graphFilter = (workingrange) => {
		var colors = ['red', 'yellow', 'green']
		colors.forEach((color) => {
			console.log(workingrange[color])
			workingrange[color].forEach(this.filter)
		})
		//this.plotdata[this.state.currentrange].green.forEach(this.filter)
		//console.log(workingrange)
	}

	filter = (currentValue, index, parentarray) => {
		if (Number(currentValue) >= 1000) {
			//parentarray[index] = null
			//max =
			//console.log(currentValue)
		}
	}

	chartRef = React.createRef()
	//rangeChart = new Chart()

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
						data: this.plotdata[this.state.graphrange].red,
						backgroundColor: 'rgba(99, 10, 10, 0.5)',
						borderColor: 'rgba(99, 10, 10, 1)',
						borderWidth: 1,
						maxBarThickness: 40,
						minBarLength: 1,
					},
					{
						label: ' Mils',
						data: this.plotdata[this.state.graphrange].yellow,
						steppedLine: 'after',
						backgroundColor: 'rgba(99, 99, 10, 0.5)',
						borderColor: 'rgba(99, 99, 10, 1)',
						borderWidth: 1,
						maxBarThickness: 40,
						minBarLength: 1,
					},
					{
						label: ' Mils',
						data: this.plotdata[this.state.graphrange].green,
						steppedLine: 'after',
						backgroundColor: 'rgba(10, 90, 10, 0.5)',
						borderColor: 'rgba(10, 90, 10, 1)',
						borderWidth: 1,
						maxBarThickness: 40,
						minBarLength: 1,
					},
				],
			},
			options: {
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
							},
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
		console.log('Component just Mounted')
		//this.graphFilter(this.plotdata[this.graphrange])
		//this.graphFilter(this.plotdata[this.state.currentrange])
		//console.log(this.plotdata[this.state.currentrange].green)

		this.buildChart()
		//this.rangeChart.update()
	}
	componentWillMount() {
		console.log('Component is about to be Mounted')
	}

	componentDidReceiveProps(nextProps) {
		console.log('Component just recieved Props')
		//this.graphFilter(nextProps.plotdata.green)
		//this.plotdata = nextProps.plotdata
		//this.graphrange = nextProps.graphrange
		//this.graphFilter(this.plotdata[this.graphrange])
		//this.rangeChart.update()
		this.buildChart()
	}
	componentWillReceiveProps(nextProps) {
		console.log('Component is about to recieve props')
		this.plotdata = nextProps.plotdata
		this.graphrange = nextProps.graphrange
		this.ERFmodels = nextProps.ERFmodels
		this.setState({ graphrange: this.graphrange })
		console.log(this.plotdata[this.graphrange])

		//this.buildChart()
	}

	componentDidUpdate() {
		console.log('Component just Updated')
		//this.graphFilter(this.plotdata[this.graphrange])
		//console.log(this.plotdata[this.graphrange].red)

		console.log(this.plotdata[this.graphrange])
		//this.rangeChart.update()
		//this.buildChart()
		//this.rangeChart.update()
		this.buildChart()
	}

	componentWillUpdate() {
		console.log('Component is about to update')
		//this.setState({ graphrange: this.graphrange })
	}

	newGraph = (newgraphrange, newplotdata) => {
		console.log('Rendering new graph')
		this.graphrange = newgraphrange
		this.setState({ graphrange: newgraphrange })
		console.log(this.state.graphrange)

		//this.plotdata = newplotdata
	}

	render() {
		console.log('Initiating render method')

		return (
			<div>
				<Sticky offset={41} context={this.titleRef}>
					<Menu>
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
}

export default Rangegraph
