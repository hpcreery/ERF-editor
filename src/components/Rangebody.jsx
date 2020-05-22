import React, { useState, useMemo, useCallback } from 'react'
import { Text, createEditor } from 'slate'
import { Slate, Editable, withReact, Editor } from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from 'emotion'

const PlainRange = (props) => {
	const ranges = ''
	const [value, setValue] = useState([
		{
			children: [{ text: props.string }],
		},
  ])


  // need to add a catch if no number values are returned and support negaives
  const regexp1 = /(\d+)/g
  const regexp3 = /^(?:[^,]*[,]){0}[^\d]*(\d+(\.\d)?)/g               // either one of these work
  var regexp2 = new RegExp(/^(?:[^,]*[,]){0}[^\d]*(\d+(\.\d)?)/g)
  
  const search1 = "100"
  const result = regexp3.exec(value[0].children[0].text)
  console.log(regexp3.lastIndex) // gives number for positon of last number focus offset
  console.log(result) // string of mathced => find length to get offset anchor
  const search = result[1] // result[1] returns first group match
  console.log(search)
  

  const handleChange = (value) => {
    setValue(value)
  }

  // regex ^(?:[^,]*[,]){magicnumber}[^\d]*(\d+)
  // or capture all digits (\d+)



  const decorate = useCallback(
    ([node, path]) => {
      const ranges = []

      if (search && Text.isText(node)) {
        const { text } = node
        const parts = text.split(search)
        let offset = 0
        //console.log(parts)

        parts.forEach((part, i) => {
          //console.log(i)
          if (i !== 0) {
            ranges.push({
              anchor: { path, offset: offset - search.length },
              focus: { path, offset },
              highlight: true,
            })
          }

          offset = offset + part.length + search.length
        })
      }

      // var i
      // for (i = 0; i < 3; i++) {
      //   const { text } = node
      //   let offset = 0
      //   var regexp = `/^(?:[^,]*[,]){${i}}[^\d]*(\d+)/g`
      //   const search = regexp.exec(value[0].children[0].text)
      //   console.log(regexp)
      //   ranges.push({
      //     anchor: { path, offset: offset - search.length },
      //     focus: { path, offset },
      //     highlight: true,
      //   })



      //   offset = offset + part.length + search.length
      // }

      return ranges
    },
    [search]
  )

  const Leaf = ({ attributes, children, leaf }) => {
    return (
      <span
        {...attributes}
        className={css`
          font-weight: ${leaf.bold && 'bold'};
          background-color: ${leaf.highlight && '#ffeeba'};
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
			onChange={value => handleChange(value)}
		>
			<Editable
				placeholder="Enter some plain text..."
        onClick={(e) => console.log('clicked')}
        decorate={decorate}
        renderLeaf={props => <Leaf {...props} />}
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
