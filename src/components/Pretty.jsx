import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Segment } from 'semantic-ui-react'

export class Pretty extends Component {
    static propTypes = {

    }
    contentmaker = (jsonERF, filelength) => {
        for (var i = 0; i < filelength; i++) {
            if ( jsonERF[i].object == '.name') {
                console.log(jsonERF[i])
                return <div> ERF: {jsonERF[i].string.toString()}</div>
            }

        }
        
    }
    

    render() {
        const { jsonERF, filelength } = this.props
        console.log(jsonERF)
        return (
            <div>
                
                <Segment inverted secondary>{this.contentmaker(jsonERF, filelength)}</Segment>
                <Button inverted>Secondary</Button>
            </div>
        )
    }
}

export default Pretty
