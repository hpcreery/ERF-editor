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
import ParameterMenu from './Parameters'
import PlainParamter from './Parameterbody'
import './Theme.css'

const electron = window.require('electron')
const BrowserWindow = electron.remote.BrowserWindow
const dialog = electron.remote.dialog
const ipc = electron.ipcRenderer
const path = window.require('path')
const url = window.require('url')
const fs = window.require('fs')

var Chart = require('chart.js')

export class Pretty extends Component {
	constructor(props) {
		super(props)
		console.log('Starting Construction')
		this.opendir = this.props.opendir
		this.jsonERF = this.props.jsonERF
		this.ERFmodels = this.props.ERFmodels
		this.plotdata = this.props.plotdata
		this.paramodel = this.ERFmodels[0]
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

	createhelpWindow(dir, range) {
		__dirname = path.resolve()
		var dir = dir.replace('\\', '/')
		var filearray = dir.split('/')
		var file = filearray.pop().split('.')[0]
		var type = filearray.pop()
		console.log(type + ' ' + file)
		var wholehelpdir = path.join(
			__dirname,
			`/public/help/${type}/${file}/ranges/${range}.htm`
		)

		try {
			if (fs.existsSync(wholehelpdir)) {
				//file exists

				// let mainfile = path.parse(this.state.dir).name
				// console.log(mainfile)
				// Create the help window
				let helpWindow

				helpWindow = new BrowserWindow({
					width: 600,
					height: 400,
					webPreferences: { nodeIntegration: true },
				})
				helpWindow.removeMenu()
				// and load the help.htm necessary
				const starthelpUrl = url.format({
					pathname: wholehelpdir,
					protocol: 'file:',
					slashes: true,
				})

				helpWindow.loadURL(starthelpUrl)

				// Emitted when the window is closed.
				helpWindow.on('closed', function () {
					// Dereference the window object, usually you would store windows
					// in an array if your app supports multi windows, this is the time
					// when you should delete the corresponding element.
					helpWindow = null
				})
			}
		} catch (err) {
			console.error(err)
		}
	}

	handleRangeChange = (e, { id, location, string, value }) => {
		value = e.target.value
		//console.log(id + location + string + e.target.value)
	}

	handleBasicChange = (e, { id, string }) => {
		console.log(id + string + e.target.value)
	}

	rangeSeperator(value, object) {
		const found = value.match(/-?\d+\.?\d*(?!o)/g) //-?\d+\.?\d*(?!o) or -?\d+\.?\d*(?=.*\.o)
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

	graphDataChange = () => {
		this.graphElement.current.newGraphData(this.state.dir)
	}

	titleRef = createRef()
	bodyRef = createRef()

	titleBar = (name) => {
		return (
			<div>
				<Divider />
				<Segment inverted className='Label'>
					ERF: {name}
				</Segment>
			</div>
		)
	}

	contentMaker = (jsonERF) => {
		this.col1 = 6
		this.col2 = 8
		this.col3 = 1

		switch (jsonERF.type) {
			case 'header':
				switch (jsonERF.object) {
					case '.name':
						return (
							<div>
								<Sticky offset={41} context={this.titleRef}>
									<Menu>
										<Menu.Item>
											<Icon name='file alternate' />
										</Menu.Item>
										<Menu.Item>
											ERF: {jsonERF.string}
										</Menu.Item>

										<Menu.Item
											position='right'
											onClick={() => this.opendir()}
										>
											Open ERF
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
									className='Label'
									name={jsonERF.string}
								>
									UID: {jsonERF.string}
								</Segment>
								<Divider />
							</div>
						)
					case '.menu':
						// Heavenly regex : ^(?:[^,\r\n]*[,]){#}[^\w]*([^,\r\n]+)
						// var regexp = new RegExp(
						// 	'^(?:[^,]*[,]){' + i + '}[^\\d]*(\\d+(\\.\\d)?)',
						// 	'g'
						// )
						// type = regexp.exec(value[0].children[0].text)
						return (
							<div>
								<Segment
									secondary
									className='Label'
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
												className='Label'
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
						//console.log(this.colors)
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
					case '.ranges':
						return (
							<div>
								<Header dividing className='Headers'>
									Ranges
								</Header>
							</div>
						)
					// case '.pdef':
					// 	return (
					// 		<div>
					// 			<Header dividing className='Headers'>
					// 				Parameter Defaults
					// 			</Header>
					// 		</div>
					// 	)
					// case '.vars':
					// 	return (
					// 		<div>
					// 			<Header dividing className='Headers'>
					// 				Variables
					// 			</Header>
					// 		</div>
					// 	)
				}

			case 'sub':
				// switch (jsonERF.object) {
				// 	case '.param':
				// 		return (
				// 			<Grid
				// 				columns={3}
				// 				verticalAlign='middle'
				// 				className='densegrid'
				// 			>
				// 				<Grid.Column
				// 					width={this.col1}
				// 					textAlign='right'
				// 				>
				// 					<Button size='tiny'>Parameter</Button>
				// 				</Grid.Column>
				// 				<Grid.Column width={this.col2}>
				// 					<Input
				// 						type='text'
				// 						placeholder='Incrimental Values'
				// 						defaultValue={jsonERF.string}
				// 						fluid
				// 						size='small'
				// 						id={jsonERF.id}
				// 						string={jsonERF.string}
				// 						onChange={this.handleBasicChange}
				// 					/>
				// 				</Grid.Column>
				// 				<Grid.Column width={this.col3}></Grid.Column>
				// 			</Grid>
				// 		)
				// }
				switch (jsonERF.parent) {
					case '.ranges':
						//console.log(this.rangevalue)
						//this.rangePlotterData(this.rangevalue, jsonERF.object)
						return (
							<Grid
								columns={3}
								verticalAlign='middle'
								className='densegrid'
							>
								<Grid.Column
									width={this.col1}
									textAlign='right'
								>
									<Button
										animated
										size='mini'
										onClick={() =>
											this.graphChange(jsonERF.object)
										}
									>
										<Button.Content visible>
											{jsonERF.object}
										</Button.Content>
										<Button.Content hidden>
											Graph
										</Button.Content>
									</Button>
								</Grid.Column>
								<Grid.Column width={this.col2}>
									<Grid
										columns={2}
										verticalAlign='middle'
										className='densegrid'
									>
										<Grid.Column
											width={1}
											textAlign='center'
										></Grid.Column>
										<Grid.Column
											width={15}
											textAlign='left'
										>
											<PlainRange
												key={jsonERF.object}
												dir={this.state.dir}
												string={jsonERF.string}
												jsonblock={jsonERF}
												graphdatachange={() =>
													this.graphDataChange()
												}
											/>
										</Grid.Column>
									</Grid>
								</Grid.Column>
								<Grid.Column width={this.col3}>
									<Popup
										content={jsonERF.comment}
										position='top center'
										trigger={
											<Label
												size='small'
												as='a'
												onClick={() =>
													this.createhelpWindow(
														this.state.dir,
														jsonERF.object
													)
												}
											>
												<Icon
													name='info'
													fitted='true'
												/>
											</Label>
										}
									/>
								</Grid.Column>
							</Grid>
						)
					// case '.pdef':
					// 	return (
					// 		<div>
					// 			<PlainParamter jsonERF={jsonERF} />
					// 		</div>
					// 	)
					// case '.vars':
					// 	return (
					// 		<Grid
					// 			columns={3}
					// 			verticalAlign='middle'
					// 			className='densegrid'
					// 		>
					// 			<Grid.Column
					// 				width={this.col1}
					// 				textAlign='right'
					// 			>
					// 				<Label size='large'>{jsonERF.object}</Label>
					// 			</Grid.Column>
					// 			<Grid.Column width={this.col2}>
					// 				<Input
					// 					type='text'
					// 					placeholder='Incrimental Values'
					// 					defaultValue={jsonERF.string}
					// 					fluid
					// 					size='small'
					// 					id={jsonERF.id}
					// 					string={jsonERF.string}
					// 					onChange={this.handleBasicChange}
					// 				/>
					// 			</Grid.Column>
					// 			<Grid.Column width={this.col3}>
					// 				<Popup
					// 					content={jsonERF.comment}
					// 					position='top center'
					// 					trigger={
					// 						<Label>
					// 							<Icon name='info' />
					// 							info
					// 						</Label>
					// 					}
					// 				/>
					// 			</Grid.Column>
					// 		</Grid>
					// 	)
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
				activeClass='active'
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
		console.log(this.plotdata)
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
			<div ref={this.titleRef} className='Table' id='Table'>
				<Grid columns={3}>
					<Grid.Column width={3} className='densegrid'>
						<Sticky offset={41} context={this.titleRef}>
							<Menu size='small' vertical>
								{this.ERFmodels.map((ERF) =>
									this.linkmaker(ERF)
								)}
							</Menu>
							<div ref={this.bodyRef} className='Table'></div>
						</Sticky>
					</Grid.Column>
					<Grid.Column width={7} className='densegrid'>
						{this.state.jsonERF.map((ERF) =>
							this.contentMaker(ERF)
						)}
					</Grid.Column>

					<Grid.Column width={6} className='densegrid'>
						<Sticky offset={41} context={this.titleRef}>
							<Rangegraph
								ref={this.graphElement}
								plotdata={this.plotdata}
								ERFmodels={this.ERFmodels}
								graphrange={this.graphrange}
							/>
							{console.log(this.plotdata[this.graphrange])}
							{console.log(this.plotdata)}
							{console.log(this.graphrange)}
							{console.log(this.ERFmodels)}
							{/* <ParameterMenu paramodel={this.paramodel} /> */}
						</Sticky>
					</Grid.Column>
				</Grid>
			</div>
		)
	}
}

export default Pretty
