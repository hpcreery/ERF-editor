import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Text, createEditor } from 'slate'
import { Slate, Editable, withReact, Editor } from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from 'emotion'
import lineReplace from 'line-replace'

const PlainRange = (props) => {
	const ranges = ''
	const [value, setValue] = useState([
		{
			children: [{ text: props.string }],
		},
	])

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
		console.log(props.jsonblock.id + 1)
		lineReplace({
			file: props.dir.toString(),
			line: props.jsonblock.id + 1,
			text:
				props.jsonblock.object +
				' = ' +
				value[0].children[0].text +
				' # ' +
				props.jsonblock.comment,
			addNewLine: false,
			callback: (e) => console.log(e),
		})
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
		<Slate
			editor={editor}
			value={value}
			onChange={(value) => handleChange(value)}
		>
			<Editable
				placeholder='I cant be empty'
				onClick={(e) => console.log('clicked')}
				decorate={decorate}
				renderLeaf={(props) => <Leaf {...props} />}
			/>
			{/* {console.log(value[0].children[0].text)} */}
		</Slate>
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
