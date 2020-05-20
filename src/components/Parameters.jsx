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

export default class ParameterMenu extends Component {
	constructor(props) {
		super(props)
		this.paramodel = this.props.paramodel
	}
	render() {
		return (
			<div>
				<Button>{this.paramodel}</Button>
				{console.log(this.paramodel)}
			</div>
		)
	}
}
