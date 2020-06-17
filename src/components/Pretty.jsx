import React, { Component, createRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
	Button,
	Segment,
	Divider,
	Label,
	Sticky,
	Icon,
	Popup,
	Grid,
	Menu,
	Table,
	Header,
	Dimmer,
	Loader
} from 'semantic-ui-react'
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import { Link, animateScroll as scroll, scroller } from 'react-scroll'
import Rangegraph from './Graph'
import PlainRange from './Rangebody'

import './Theme.css'
import 'semantic-ui-css/components/reset.min.css';
import 'semantic-ui-css/components/site.min.css';
import 'semantic-ui-css/components/container.min.css';
import 'semantic-ui-css/components/icon.min.css';
import 'semantic-ui-css/components/message.min.css';
import 'semantic-ui-css/components/header.min.css';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

const electron = window.require('electron')
const BrowserWindow = electron.remote.BrowserWindow
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

	// Whole method in creating a help window with error logging
	createhelpWindow(dir, range) {
		__dirname = path.resolve()
		var dir = dir.replace(/\\/g, '/')
		var filearray = dir.split('/')
		var file = filearray.pop().split('.')[0]
		var type = filearray.pop()
		var range = range.split('*').join('')
		var wholehelpdir = path.join(
			__dirname,
			`/public/help/${type}/${file}/ranges/${range}.htm`
		)

		try {
			// To call seperate method if file does not exist
			if (fs.existsSync(wholehelpdir)) {
				// Create the help window
				let helpWindow

				helpWindow = new BrowserWindow({
					width: 600,
					height: 400,
					webPreferences: { nodeIntegration: true },
				})

				// Don't need menu to see static document
				helpWindow.removeMenu()

				// and load the help.htm
				const starthelpUrl = url.format({
					pathname: wholehelpdir,
					protocol: 'file:',
					slashes: true,
				})

				helpWindow.loadURL(starthelpUrl)

				// Emitted when the window is closed.
				helpWindow.on('closed', function () {
					helpWindow = null
				})
			}
			else {
				setTimeout(() => {
					toast({
							type: 'warning',
							icon: 'medkit',
							size: 'small',
							title: 'Missing Info',
							description: 'Sorry, no help found',
							animation: 'fly left',
					});
			}, 5);
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

	// Change current active range for graph
	graphChange = (newgraphrange) => {
		this.graphrange = newgraphrange
		this.graphElement.current.newGraph(newgraphrange)
	}

	// Method called by Rangebody to call Graphdata and update graph with fresh data
	graphDataChange = () => {
		this.graphElement.current.newGraphData(this.state.dir)
	}

	titleRef = createRef()
	bodyRef = createRef()


	// Method to iterate thougth each line and render it in document based on type
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
					// case '.uid':
					// 	return (
					// 		<div>
					// 			<Segment
					// 				secondary
					// 				className='Label'
					// 				name={jsonERF.string}
					// 			>
					// 				UID: {jsonERF.string}
					// 			</Segment>
					// 			<Divider />
					// 		</div>
					// 	)
					case '.menu':
						// Heavenly regex : ^(?:[^,\r\n]*[,]){#}[^\w]*([^,\r\n]+)
						return (
							<div>
								<Segment
									secondary
									className='Label'
									name={jsonERF.string}
								>
									MENU: {jsonERF.string}
								</Segment>
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
				key={ERFmodel}
				activeClass='active'
				to={ERFmodel}
				spy={true}
				smooth={true}
				duration={500}
				offset={-93}
				isDynamic={true}
			>
				<Menu.Item as='a' key={ERFmodel}>{ERFmodel}</Menu.Item>
			</Link>
		)
	}


	render() {
		console.log('Initiating render method')

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

				<SemanticToastContainer position='bottom-right'/>
			</div>
		)
	}

		// Life-Cycle Methods
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
			console.log('Here is when it recieves Data ')
			
		}
	
		componentWillUpdate() {
			console.log('Component is about to update')
		}
	
		componentDidUpdate() {
			console.log('Component just Updated')
		}
	
		componentDidMount() {
			console.log('Component just Mounted')
		}
}

export default Pretty
