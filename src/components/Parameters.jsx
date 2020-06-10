import React, { Component } from 'react'
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
import './Theme.css'
import '../../public/enlarge_pad.htm'

export default class ParameterMenu extends Component {
	constructor(props) {
		super(props)
		this.paramodel = this.props.paramodel
	}
	render() {
		return (
			<div>
				<Menu>
					<Menu.Item>
						<Icon name='cogs'></Icon>
					</Menu.Item>
					<Menu.Item>Model: {this.paramodel}</Menu.Item>
				</Menu>
				<Divider />

				{console.log(this.paramodel)}
			</div>
		)
	}
}
