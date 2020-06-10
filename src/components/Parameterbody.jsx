import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Text, createEditor } from 'slate'
import { Slate, Editable, withReact, Editor } from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from 'emotion'
import lineReplace from 'line-replace'
import {
	Label,
	Grid,
	Icon,
	Input,
	Button,
	Popup,
	Checkbox,
	Dropdown,
} from 'semantic-ui-react'
import './Theme.css'

// Heavenly regex : ^(?:[^,\r\n]*[,]){#}[^\w]*([^,\r\n]+)

function PlainParameter(props) {
	const [value, setValue] = useState()
	const [mod, setMod] = useState(false)
	var { jsonERF } = props

	const PInput = (props) => {
		var { jsonERF } = props
		//p_mil, p_inch, p_mm, p_microns
		return (
			<Input
				type='text'
				placeholder='Incrimental Values'
				defaultValue={jsonERF.string}
				fluid
				size='mini'
				id={jsonERF.id}
				string={jsonERF.string}
				onChange={console.log('changed')}
			/>
		)
	}

	const PLayer = (props) => {
		var { jsonERF } = props
		//layer
	}

	const PInt = (props) => {
		var { jsonERF } = props
	}

	const PRadio = (props) => {
		var { jsonERF } = props
	}

	const PSet = (props) => {
		var { jsonERF } = props
	}

	const PMenu = (props) => {
		var { jsonERF } = props
	}

	return (
		<div>
			<Grid columns={3} verticalAlign='middle' className='densegrid'>
				<Grid.Column width={6} textAlign='right'>
					<Button animated size='mini'>
						<Button.Content visible>
							{jsonERF.object}
						</Button.Content>
						<Button.Content hidden>Hello</Button.Content>
					</Button>
				</Grid.Column>
				<Grid.Column width={8}>
					<PInput jsonERF={jsonERF} />
				</Grid.Column>
				<Grid.Column width={1}>
					<Popup
						content={jsonERF.comment}
						position='top center'
						trigger={
							<Label size='small' as='a'>
								<Icon name='info' fitted='true' />
							</Label>
						}
					/>
				</Grid.Column>
			</Grid>
		</div>
	)
}

export default PlainParameter
