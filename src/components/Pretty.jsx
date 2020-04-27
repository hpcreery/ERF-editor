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
    Header
} from 'semantic-ui-react'
import {
	Link,
	animateScroll as scroll,
	scroller,
} from 'react-scroll'
import './Theme.css'

export class Pretty extends Component {
	constructor(props) {
        super(props)
        
        
        this.opendir = this.props.opendir
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

	contentmaker = (jsonERF) => {
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
											<Input
												action={{
													type: 'submit',
													content: 'Go',
												}}
                                                placeholder="Navigate to..."
                                                defaultValue={this.dir}
											/>
										</Menu.Item>
									</Menu>
								</Sticky>
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
							</div>
						)
					case '.menu':
						return(
							<div>
                                <Segment
                                    secondary
                                    className="Label"
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
						return
					case '.ranges\r':
						return (
							<div>
								<Header dividing className='Headers'>
                                    Ranges
                                </Header>
							</div>
						)
					case '.pdef\r':
						return(
							<div>
								<Header dividing className='Headers'>
                                    Parameter Defaults
                                </Header>
							</div>
						)
					case '.vars\r':
						return(
							<div>
								<Header dividing className='Headers'>
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
									/>
								</Grid.Column>
								<Grid.Column width={this.col3}>
                                {this.units}
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
									
											<Label size="large">
												{jsonERF.object}
											</Label>
						
								</Grid.Column>
								<Grid.Column width={this.col2}>
                                <Grid
								columns={4}
								verticalAlign="middle"
								className="densegrid"
							>
                                <Grid.Column
                                width={1}
                                textAlign='center'>

                                    =
                                </Grid.Column>
                                <Grid.Column
									width={5}
									textAlign="right"
								>
                                     <Input
										type="text"
										placeholder="Incrimental Values"
										defaultValue={jsonERF.string}
										fluid
										
										size="small"
									/>

                                </Grid.Column>
                                   
                                <Grid.Column
									width={5}
									textAlign="right"
								>
                                     <Input
										type="text"
										placeholder="Incrimental Values"
										defaultValue={jsonERF.string}
										fluid
										
										size="small"
									/>

                                </Grid.Column>
                                <Grid.Column
									width={5}
									textAlign="right"
								>
                                     <Input
										type="text"
										placeholder="Incrimental Values"
										defaultValue={jsonERF.string}
										fluid
										
										size="small"
									/>

                                </Grid.Column>
                                    </Grid>
								</Grid.Column>
								<Grid.Column width={this.col3}>
                                <Popup
										content={jsonERF.comment}
										position="top center"
										trigger={<Label><Icon name="info"/>info</Label>} />
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
									
											<Label size="large">
												{jsonERF.object}
											</Label>

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
                                <Popup
										content={jsonERF.comment}
										position="top center"
										trigger={<Label><Icon name="info"/>info</Label>} />
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
									
											<Label size="large">
												{jsonERF.object}
											</Label>

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
                                <Popup
										content={jsonERF.comment}
										position="top center"
										trigger={<Label><Icon name="info"/>info</Label>} />
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
	render() {
		const { jsonERF, filelength, ERFmodels, dir } = this.props
		//console.log(jsonERF)
		//console.log(JSON.stringify(jsonERF))
        this.dir = dir
        

		return (
			<div ref={this.titleRef} className="Table">
				<Grid columns={2}>
					<Grid.Column width={12} className="densegrid">
						{jsonERF.map((ERF) => this.contentmaker(ERF))}
					</Grid.Column>
					<Grid.Column width={4} className="densegrid">
                    <Sticky offset={41} context={this.titleRef}>

                        <Menu vertical>
                        {ERFmodels.map((ERF) => this.linkmaker(ERF))}
                        </Menu>
                        </Sticky>
						
                        <button onClick={() => this.opendir()}>
                            Push me
                        </button>
						
					</Grid.Column>
				</Grid>
			</div>
		)
	}
}

export default Pretty
