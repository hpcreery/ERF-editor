import React, { Component, createRef, useState } from 'react'
import PropTypes from 'prop-types'
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
import { Link, animateScroll as scroll, scroller } from 'react-scroll'
import Rangegraph from './Graph'
import PlainRange from './Rangebody'
import './Theme.css'

var Chart = require('chart.js')

export class Pretty extends Component {
	constructor(props) {
		super(props)
		console.log('Starting Construction')

		this.opendir = this.props.opendir
		this.jsonERF = this.props.jsonERF
		this.ERFmodels = this.props.ERFmodels
		this.plotdata = this.props.plotdata
		this.graphrange = Object.keys(this.plotdata)[0]
		console.log(' this is the first range to graph ' + this.graphrange)
		this.state = {
			dir: this.props.dir,
			graph: this.graphrange,
			jsonERF: this.jsonERF,
			ranges: {},
		}
		this.graphElement = React.createRef()
	}

	static propTypes = {}

	handleRangeChange = (e, { id, location, string, value }) => {
		value = e.target.value
		console.log(id + location + string + e.target.value)
	}
	handleBasicChange = (e, { id, string }) =>
		console.log(id + string + e.target.value)
	rangeSeperator(value, object) {
		const found = value.match(/-?\d+\.?\d*(?!o)/g) //-?\d+\.?\d*(?!o)
		//this.setState({ranges: })
		//vendors.some( vendor => vendor['Name'] === 'Magenic' )
		return found
	}

	colorSeperator = (ranges) => {
		const found = ranges.match(/\d+/g)
		return found
	}

	graphChange = (newgraphrange) => {
		this.graphrange = newgraphrange
		//this.setState({ graph: this.graphrange })
		this.graphElement.current.newGraph(newgraphrange)

		console.log(this.graphrange)
	}

	titleRef = createRef()
	bodyRef = createRef()

	titleBar = (name) => {
		return (
			<div>
				<Divider />
				<Segment inverted className="Label">
					ERF: {name}
				</Segment>
			</div>
		)
	}

	contentMaker = (jsonERF) => {
		this.col1 = 4
		this.col2 = 10
		this.col3 = 2

		switch (jsonERF.type) {
			case 'header':
				switch (jsonERF.object) {
					case '.name':
						return (
							<div>
								<Sticky offset={41} context={this.titleRef}>
									<Menu>
										<Menu.Item>
											<Icon name="file alternate" />
										</Menu.Item>
										<Menu.Item>
											ERF: {jsonERF.string}
										</Menu.Item>

										<Menu.Item position="right">
											{this.state.dir}
										</Menu.Item>
									</Menu>
								</Sticky>
								<Divider />
							</div>
						)
					case '.uid':
						return (
							<div>
								<Segment
									secondary
									className="Label"
									name={jsonERF.string}
								>
									UID: {jsonERF.string}
								</Segment>
								<Divider />
							</div>
						)
					case '.menu':
						return (
							<div>
								<Segment
									secondary
									className="Label"
									name={jsonERF.string}
								>
									MENU: {jsonERF.string}
								</Segment>
								<Divider />
							</div>
						)
					case '.model':
						return (
							<div>
								<Divider />
								<Table>
									<Table.Header name={jsonERF.string}>
										<Sticky
											offset={93}
											context={this.titleRef}
										>
											<Segment
												secondary
												className="Label"
											>
												MODEL: {jsonERF.string}
											</Segment>
										</Sticky>
									</Table.Header>
								</Table>
							</div>
						)
					case '.units':
						this.units = jsonERF.string
						return
					case '.colors':
						this.colors = this.colorSeperator(jsonERF.string)
						console.log(this.colors)
						document.documentElement.style.setProperty(
							'--firstrangecolor',
							'#' + this.colors[0]
						)
						document.documentElement.style.setProperty(
							'--secondrangecolor',
							'#' + this.colors[1]
						)
						document.documentElement.style.setProperty(
							'--thirdrangecolor',
							'#' + this.colors[2]
						)
						return
					case '.ranges\r':
						return (
							<div>
								<Header dividing className="Headers">
									Ranges
								</Header>
							</div>
						)
					case '.pdef\r':
						return (
							<div>
								<Header dividing className="Headers">
									Parameter Defaults
								</Header>
							</div>
						)
					case '.vars\r':
						return (
							<div>
								<Header dividing className="Headers">
									Variables
								</Header>
							</div>
						)
				}

			case 'sub':
				switch (jsonERF.object) {
					case '.param':
						return (
							<Grid
								columns={3}
								verticalAlign="middle"
								className="densegrid"
							>
								<Grid.Column
									width={this.col1}
									textAlign="right"
								>
									<Label size="large">Parameter</Label>
								</Grid.Column>
								<Grid.Column width={this.col2}>
									<Input
										type="text"
										placeholder="Incrimental Values"
										defaultValue={jsonERF.string}
										fluid
										size="small"
										id={jsonERF.id}
										string={jsonERF.string}
										onChange={this.handleBasicChange}
									/>
								</Grid.Column>
								<Grid.Column width={this.col3}></Grid.Column>
							</Grid>
						)
				}
				switch (jsonERF.parent) {
					case '.ranges\r':
						this.rangevalue = this.rangeSeperator(
							jsonERF.string,
							jsonERF.object
						)
						console.log(this.rangevalue)
						//this.rangePlotterData(this.rangevalue, jsonERF.object)
						return (
							<Grid
								columns={3}
								verticalAlign="middle"
								className="densegrid"
							>
								<Grid.Column
									width={this.col1}
									textAlign="right"
								>
									<Label
										size="small"
										onClick={() =>
											this.graphChange(jsonERF.object)
										}
									>
										{jsonERF.object}
									</Label>
								</Grid.Column>
								<Grid.Column width={this.col2}>
									<Grid
										columns={2}
										verticalAlign="middle"
										className="densegrid"
									>
										<Grid.Column
											width={1}
											textAlign="center"
										>
											=
										</Grid.Column>
										<Grid.Column
											width={15}
											textAlign="left"
										>

											<PlainRange invalue={jsonERF.string}/>
										</Grid.Column>

									</Grid>
								</Grid.Column>
								<Grid.Column width={this.col3}>
									<Popup
										content={jsonERF.comment}
										position="top center"
										trigger={
											<Label size="small">
												<Icon name="info" />
												info
											</Label>
										}
									/>
								</Grid.Column>
							</Grid>
						)
					case '.pdef\r':
						return (
							<Grid
								columns={3}
								verticalAlign="middle"
								className="densegrid"
							>
								<Grid.Column
									width={this.col1}
									textAlign="right"
								>
									<Label size="large">{jsonERF.object}</Label>
								</Grid.Column>
								<Grid.Column width={this.col2}>
									<Input
										type="text"
										placeholder="Incrimental Values"
										defaultValue={jsonERF.string}
										fluid
										size="small"
										id={jsonERF.id}
										string={jsonERF.string}
										onChange={this.handleBasicChange}
									/>
								</Grid.Column>
								<Grid.Column width={this.col3}>
									<Popup
										content={jsonERF.comment}
										position="top center"
										trigger={
											<Label>
												<Icon name="info" />
												info
											</Label>
										}
									/>
								</Grid.Column>
							</Grid>
						)
					case '.vars\r':
						return (
							<Grid
								columns={3}
								verticalAlign="middle"
								className="densegrid"
							>
								<Grid.Column
									width={this.col1}
									textAlign="right"
								>
									<Label size="large">{jsonERF.object}</Label>
								</Grid.Column>
								<Grid.Column width={this.col2}>
									<Input
										type="text"
										placeholder="Incrimental Values"
										defaultValue={jsonERF.string}
										fluid
										size="small"
										id={jsonERF.id}
										string={jsonERF.string}
										onChange={this.handleBasicChange}
									/>
								</Grid.Column>
								<Grid.Column width={this.col3}>
									<Popup
										content={jsonERF.comment}
										position="top center"
										trigger={
											<Label>
												<Icon name="info" />
												info
											</Label>
										}
									/>
								</Grid.Column>
							</Grid>
						)
				}
		}
	}

	handlescroll = (location) => {
		scroller.scrollTo(location, {
			duration: 500,
			smooth: true,
			offset: -100, // Scrolls to element + 50 pixels down the page
		})
	}

	linkmaker = (ERFmodel) => {
		return (
			<Link
				activeClass="active"
				to={ERFmodel}
				spy={true}
				smooth={true}
				duration={500}
				offset={-93}
				isDynamic={true}
			>
				<Menu.Item>{ERFmodel}</Menu.Item>
			</Link>
		)
	}

	componentWillReceiveProps(nextProps) {
		console.log('Component is about to Recieved Props')

		//this.setState({ ERFmodels: nextProps.ERFmodels })
		this.ERFmodels = nextProps.ERFmodels
		this.jsonERF = nextProps.jsonERF
		this.setState({ jsonERF: this.jsonERF })
		console.log('Here is when it recieves Data ')
		console.log(this.jsonERF)
		this.plotdata = nextProps.plotdata
		this.graphChange(Object.keys(this.plotdata)[0])
		this.setState({ dir: String(nextProps.dir) })
	}

	componentWillMount() {
		console.log('Component is about to be Mounted')

		//this.jsonERF = this.props.jsonERF
		console.log('Here is when it recieves Data ')
		//console.log(this.jsonERF)
	}

	componentWillUpdate() {
		console.log('Component is about to update')
	}

	componentDidUpdate() {
		console.log('Component just Updated')
	}

	//chartRef = React.createRef()
	componentDidMount() {
		console.log('Component just Mounted')
		// const chartref = this.chartRef.current.getContext('2d')
		// new Chart(chartref, {
		// 	type: 'horizontalBar',
		// 	data: {
		// 		labels: ['Red', 'Blue', 'Yellow', 'Green'],
		// 		datasets: [
		// 			{
		// 				label: ' Severity || Mils',
		// 				steppedLine: 'after',
		// 				data: [1, 1, 3, 5],
		// 				backgroundColor: 'rgba(255, 99, 132, 0.2)',
		// 				borderColor: 'rgba(255, 99, 132, 1)',
		// 				borderWidth: 1,
		// 			},
		// 			{
		// 				label: ' Severity || Mils',
		// 				data: [12, 9, 13, 25],
		// 				steppedLine: 'after',
		// 				backgroundColor: 'rgba(75, 192, 192, 0.2)',
		// 				borderColor: 'rgba(75, 192, 192, 1)',
		// 				borderWidth: 1,
		// 			},
		// 		],
		// 	},
		// 	options: {
		// 		tooltips: {
		// 			backgroundColor: 'rgba(255, 255, 255, 0.9)',
		// 			titleFontColor: '#000',
		// 			bodyFontColor: '#000',
		// 			borderColor: 'rgba(0, 0, 0, 0.3)',
		// 			borderWidth: 1,
		// 		},
		// 		scales: {
		// 			xAxes: [
		// 				{
		// 					stacked: false,
		// 				},
		// 			],
		// 			yAxes: [
		// 				{
		// 					stacked: true,
		// 					ticks: {
		// 						beginAtZero: true,
		// 					},
		// 				},
		// 			],
		// 		},
		// 	},
		// })
	}

	render() {
		console.log('Initiating render method')

		//const { jsonERF, filelength, dir } = this.props
		//console.log(jsonERF)
		//console.log(JSON.stringify(jsonERF))
		//this.dir = dir

		return (
			<div ref={this.titleRef} className="Table" id="Table">
				<Grid columns={3}>
					<Grid.Column width={3} className="densegrid">
						<Sticky offset={41} context={this.titleRef}>
							<Menu vertical>
								<Menu.Item onClick={() => this.opendir()}>
									Open ERF
								</Menu.Item>
								{this.ERFmodels.map((ERF) =>
									this.linkmaker(ERF)
								)}
							</Menu>
							<div ref={this.bodyRef} className="Table"></div>
						</Sticky>
					</Grid.Column>
					<Grid.Column width={7} className="densegrid">
						{this.state.jsonERF.map((ERF) =>
							this.contentMaker(ERF)
						)}
					</Grid.Column>

					<Grid.Column width={6} className="densegrid">
						<Sticky offset={41} context={this.titleRef}>
							<Rangegraph
								ref={this.graphElement}
								plotdata={this.plotdata}
								ERFmodels={this.ERFmodels}
								graphrange={this.graphrange}
							/>
							{console.log(this.ERFmodels)}
							<PlainRange invalue={"this is cool"}/>
							<PlainRange invalue={"this is cooler"}/>
							<PlainRange invalue={"this is cool"}/>
						</Sticky>
					</Grid.Column>
				</Grid>
			</div>
		)
	}
}

export default Pretty
