import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Text, createEditor } from 'slate'
import { Slate, Editable, withReact, Editor } from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from 'emotion'
import lineReplace from 'line-replace'
import { Label, Grid, Icon } from 'semantic-ui-react'
import './Theme.css'

// TESTING
import Graphdata from './Graphdata'

const PlainRange = (props) => {
	const ranges = ''
	const [value, setValue] = useState([
		{
			children: [{ text: props.string }],
		},
	])
	const [mod, setMod] = useState(false)

	// End of lines show as '$' and carriage returns usually show as '^M'.
	//console.log(props.string)

	// useEffect(() => {
	//   // Update the document title using the browser API
	//   document.title = `You clicked ${count} times`;
	// });

	// need to add a catch if no number values are returned and support negaives
	// const regexp1 = /(\d+)/g
	// var number = 0
	// var regexp2 = /^(?:[^,]*[,]){(number)}[^\d]*(\d+(\.\d)?)/g // either one of these work
	// var regexp3 = new RegExp(
	// 	'^(?:[^,]*[,]){' + number + '}[^\\d]*(\\d+(\\.\\d)?)',
	// 	'g'
	// )
	// var result = regexp3.exec(value[0].children[0].text)
	// console.log(regexp3 + regexp3.lastIndex) // gives number for positon of last number focus offset
	// console.log(result) // string of mathced => find length to get offset anchor
	// const search = result[1] // result[1] returns first group match
	// console.log(search)

	const handleChange = (value) => {
		setValue(value)
	}

	const keyPress = (e) => {
		// also do not allow character
		// console.log('pushed ', e.keyCode)
		if (e.keyCode == 13) {
			console.log('write', e.target.value)
			e.preventDefault()
			//setMod(false)
			writeChange()
		} else if (mod !== true) {
			//console.log('changing mod' + mod)
			setMod(true)
		}

		if (e.keyCode < 48 || e.keyCode > 57) {
			if (
				e.keyCode != 188 &&
				e.keyCode != 8 &&
				e.keyCode != 37 && //left
				e.keyCode != 39 && //right
				e.keyCode != 35 && //
				e.keyCode != 36 &&
				e.keyCode != 32
			) {
				e.preventDefault()
			}
		}
	}

	const writeChange = () => {
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
				//Graphdata(props.dir)
				props.graphdatachange()
			},
		})
	}

	const labelRender = () => {
		if (mod == true) {
			return (
				<Label
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

		// if (search && Text.isText(node)) {
		// 	const { text } = node
		// 	const parts = text.split(search)
		// 	let offset = 0
		// 	//console.log(parts)

		// 	parts.forEach((part, i) => {
		// 		//console.log(i)
		// 		if (i !== 0) {
		// 			ranges.push({
		// 				anchor: { path, offset: offset - search.length },
		// 				focus: { path, offset },
		// 				highlight: true,
		// 			})
		// 		}

		// 		offset = offset + part.length + search.length
		// 	})
		// }

		var i
		var search
		var presearch
		var offset
		var colors = [
			'rgba(99, 10, 10, 0.25)',
			'rgba(99, 99, 10, 0.25)',
			'rgba(10, 90, 10, 0.25)',
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
				// console.log(
				// 	search + ' ' + regexp + ' ' + offset + ' ' + search.length
				// )
				
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
				// method if range is not completex
			}
		}

		//console.log(ranges)
		return ranges
	})

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
					{/* {console.log(value[0].children[0].text)} */}
				</Slate>
			</Grid.Column>

			<Grid.Column width={5}>
				{mod && (
					<Label size='small' color='red' className='Labelright'>
						<Icon name='download' fitted='true' />
					</Label>
				)}
			</Grid.Column>
		</Grid>
	)
}

const initialValue = [
	{
		children: [
			{ text: 'This is editable plain text, just like a <textarea>!' },
			{ text: 'This is editable plain text, just like a <textarea>!' },
		],
	},
]

export default PlainRange
