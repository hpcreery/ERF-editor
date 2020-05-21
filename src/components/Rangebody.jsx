import React, { useState, useMemo } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

const PlainRange = (props) => {
	const ranges = ''
	const [value, setValue] = useState([
		{
			children: [{ text: props.string }],
		},
	])
	const editor = useMemo(() => withHistory(withReact(createEditor())), [])
	return (
		<Slate
			editor={editor}
			value={value}
			onChange={(value) => setValue(value)}
		>
			<Editable
				placeholder="Enter some plain text..."
				onClick={(e) => console.log('clicked')}
			/>
			{console.log(value[0].children[0].text)}
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
