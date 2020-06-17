import React, { Component } from 'react'
import {
	Dimmer,
	Loader
} from 'semantic-ui-react'

const electron = window.require('electron')

class PageDimmer extends Component {
  constructor(props){
    super(props)
		this.dimin = true
		this.state = {
			dim: true
		}

	}


	


	render() {
		console.log('Initiating render method')
		console.log(this.state.dim)

		return (
				<Dimmer active={this.state.dim}>
				  <Loader indeterminate>Preparing Files</Loader>
				</Dimmer>
		)
	}

	// Life-Cycle Methods
	componentDidMount() {
		console.log('Component just Mounted')
		this.setState({ dim: false })
	}

	componentWillMount() {
		console.log('Component is about to be Mounted')
		this.setState({ dim: true })
	}

	componentDidUpdate() {
		console.log('Component just Updated')
		this.setState({ dim: false })
		
		
	}
	
	componentWillUpdate() {
		console.log('Component is about to update')
		//this.setState({ dim: true })
	}

	componentWillReceiveProps() {
		//this.setState({ dim: true })
	}
		


}

export default PageDimmer
