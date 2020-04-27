import React, { Component, createRef } from 'react'
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
} from 'semantic-ui-react'
import './Theme.css'

export class Pretty extends Component {
	constructor(props) {
		super(props)
	}

	static propTypes = {}

	titleRef = createRef()
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

	headermaker = (jsonERF) => {
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
											<Input
												action={{
													type: 'submit',
													content: 'Go',
												}}
												placeholder="Navigate to..."
											/>
										</Menu.Item>
									</Menu>
								</Sticky>
							</div>
						)
					case '.uid':
						return (
							<div ref="hello">
								<Sticky offset={41} context={this.titleRef}>
									<Menu>
										<Menu.Item>
											<Icon name="file alternate" />
										</Menu.Item>
										<Menu.Item>
											ERF: {jsonERF.string}
										</Menu.Item>

										<Menu.Item position="right">
											<Input
												action={{
													type: 'submit',
													content: 'Go',
												}}
												placeholder="Navigate to..."
											/>
										</Menu.Item>
									</Menu>
								</Sticky>
							</div>
						)
					case '.menu':
						return
					case '.param':
						return
				}
		}
	}
	contentmaker = (jsonERF) => {
		this.col1 = 4
		this.col2 = 10
		this.col3 = 2
		switch (jsonERF.type) {
			case 'header':
				switch (jsonERF.object) {
					case '.model':
						return (
							<div>
								<Table>
									<Table.Header colSpan="3">
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
						return
					case '.colors':
						return
					case '.ranges\r':
						return (
							<div>
								<Label color="black">Ranges</Label>
							</div>
						)
					case '.pdef\r':
						return
					case '.vars\r':
						return
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
									/>
								</Grid.Column>
								<Grid.Column width={this.col3}>
									units
								</Grid.Column>
							</Grid>
						)
				}
				switch (jsonERF.parent) {
					case '.ranges\r':
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
									<Popup
										content={jsonERF.comment}
										position="top center"
										trigger={
											<Label size="large">
												{jsonERF.object}
											</Label>
										}
									/>
								</Grid.Column>
								<Grid.Column width={this.col2}>
									<Input
										type="text"
										placeholder="Incrimental Values"
										defaultValue={jsonERF.string}
										label={{ content: 'mils' }} // Change mils to dynamic
										labelPosition="right"
										fluid
										size="small"
									/>
								</Grid.Column>
								<Grid.Column width={this.col3}>
									units
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
									<Popup
										content={jsonERF.comment}
										position="top center"
										trigger={
											<Label size="large">
												{jsonERF.object}
											</Label>
										}
									/>
								</Grid.Column>
								<Grid.Column width={this.col2}>
									<Input
										type="text"
										placeholder="Incrimental Values"
										defaultValue={jsonERF.string}
										fluid
										size="small"
									/>
								</Grid.Column>
								<Grid.Column width={this.col3}>
									units
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
									<Popup
										content={jsonERF.comment}
										position="top center"
										trigger={
											<Label size="large">
												{jsonERF.object}
											</Label>
										}
									/>
								</Grid.Column>
								<Grid.Column width={this.col2}>
									<Input
										type="text"
										placeholder="Incrimental Values"
										defaultValue={jsonERF.string}
										fluid
										size="small"
									/>
								</Grid.Column>
								<Grid.Column width={this.col3}>
									units
								</Grid.Column>
							</Grid>
						)
				}
				return (
					<div>
						<Input
							type="text"
							placeholder={jsonERF.comment}
							size="small"
							fluid
							defaultValue={jsonERF.string}
							className="densegrid"
						>
							<Popup
								wide="very"
								position="bottom left"
								content={jsonERF.comment}
								trigger={
									<Label className="Objectname">
										{jsonERF.object}
									</Label>
								}
							/>
							<input />
						</Input>

						<br />
					</div>
				)
		}
		//}
	}

	render() {
		const { jsonERF, filelength } = this.props
		//console.log(jsonERF)
		//console.log(JSON.stringify(jsonERF))

		return (
			<div ref={this.titleRef} className="Table">
				<Grid columns={2}>
					<Grid.Column width={12} className="densegrid">
						{jsonERF.map((ERF) => this.headermaker(ERF))}
						{/* <Grid.Column width={this.col1}>asdf</Grid.Column>
							<Grid.Column width={this.col1}>asdf</Grid.Column>
							<Grid.Column width={this.col1}>asdf</Grid.Column> */}
						{/* {jsonERF.map((ERF) => this.columnmaker(ERF))}
						This is cool */}
						{jsonERF.map((ERF) => this.contentmaker(ERF))}
					</Grid.Column>
					<Grid.Column width={4} className="densegrid">
						{/* <Segment>
							{jsonERF.map((ERF) => this.contentmaker(ERF))}
						</Segment> */}
					</Grid.Column>
				</Grid>
				{/* {this[`20_ref`].current.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				})} */}
			</div>
		)
	}
}

export default Pretty
