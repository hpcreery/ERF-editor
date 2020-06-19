import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Text, createEditor } from 'slate'
import { Slate, Editable, withReact, Editor } from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from 'emotion'
import lineReplace from 'line-replace'
import { Label, Grid, Icon } from 'semantic-ui-react'
import './Theme.css'

const PlainRange = (props) => {
	const ranges = ''
	const [value, setValue] = useState([
		{
			children: [{ text: props.string }],
		},
	])
	const [mod, setMod] = useState(false)
	const [icon, setIcon] = useState('download')
	const [load, setLoad] = useState(false)

	// If range was edited, set state to show edit alert
	const handleChange = (value) => {
		setValue(value)
	}

	// Prevent Default key press actions when editing range values. Custom Key actions are set here
	const keyPress = (e) => {
		if (e.keyCode === 13) {
			console.log('write', e.target.value)
			e.preventDefault()
			writeChange()
		} else if (mod !== true) {
			setMod(true)

		}

		if (e.keyCode < 48 || e.keyCode > 57) {
			if (
				e.keyCode !== 188 &&
				e.keyCode !== 8 &&
				e.keyCode !== 37 &&
				e.keyCode !== 39 &&
				e.keyCode !== 35 &&
				e.keyCode !== 36 &&
				e.keyCode !== 32
			) {
				e.preventDefault()
			}
		}
	}

	// Method to write changes, this is where line-replace comes in play
	const writeChange = () => {
		setLoad(true)
		setIcon('sync')
		console.log(props.jsonblock.id + 1)
		lineReplace({
			file: props.dir.toString(),
			line: props.jsonblock.id + 1,
			text:
				props.jsonblock.object +
				' =' +
				value[0].children[0].text +
				' #' +
				props.jsonblock.comment,
			addNewLine: false,
			callback: (e) => {
				console.log(e)
				setMod(false)
				console.log(props.dir)
				props.graphdatachange()
				setLoad(false)
				setIcon('download')

			},
		})
	}

	const labelRender = () => {
		if (mod == true) {
			return (
				<Label
					inverted
					color='red'
					horizontal
					as='a'
					onClick={console.log('write')}
				>
					Write
				</Label>
			)
		} else {
			return
		}
	}

	// regex ^(?:[^,]*[,]){magicnumber}[^\d]*(\d+)
	// or capture all digits (\d+)

	const decorate = useCallback(([node, path]) => {
		const ranges = []
		var i
		var search
		var presearch
		var offset
		var colors = [
			'rgba(99, 10, 10, 1)',
			'rgba(99, 99, 10, 1)',
			'rgba(10, 90, 10, 1)',
		]
		for (i = 0; i < 3; i++) {
			const { text } = node
			var offset = 0
			var regexp = new RegExp(
				'^(?:[^,]*[,]){' + i + '}[^\\d]*(\\d+(\\.\\d)?)',
				'g'
			)

			try {
				presearch = regexp.exec(value[0].children[0].text)
				search = presearch[1]
				offset = regexp.lastIndex
				ranges.push({
					anchor: { path, offset: offset - search.length },
					focus: { path, offset },
					highlight: true,
					color: colors[i],
				})
			} catch (err) {
				console.log(props.jsonblock.id)
				presearch = regexp.exec(value[0].children[0].text)
				console.log(props.jsonblock)
			}
		}
		return ranges
	})

	// This sets highlights colors to text
	// Strange Slate.js method
	const Leaf = ({ attributes, children, leaf }) => {
		return (
			<span
				{...attributes}
				className={css`
					font-weight: ${leaf.bold && 'bold'};
					background-color: ${leaf.highlight && leaf.color};
				`}
			>
				{children}
			</span>
		)
	}

	const editor = useMemo(() => withHistory(withReact(createEditor())), [])

	return (
		<Grid columns={2}>
			<Grid.Column width={11}>
				<Slate
					editor={editor}
					value={value}
					onChange={(value) => handleChange(value)}
				>
					<Editable
						placeholder='I cant be empty'
						onClick={(e) => console.log('clicked')}
						onKeyDown={(e) => keyPress(e)}
						decorate={decorate}
						renderLeaf={(props) => <Leaf {...props} />}
					/>
				</Slate>
			</Grid.Column>

			<Grid.Column width={5}>
				{mod && (
					<Label as='a' size='small' color='red' className='Labelright' onClick={() => writeChange()}>
						<Icon name={icon} fitted='true' loading={load}/>
					</Label>
				)}
			</Grid.Column>
		</Grid>
	)
}

export default PlainRange
