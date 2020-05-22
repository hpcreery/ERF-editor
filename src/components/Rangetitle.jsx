import React, { useState, useMemo } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

const PlainRange = (props) => {
  const [value, setValue] = useState([
    {
      children: [
        { text: props.invalue },
      ],
    },
  ])

  return (
    <textarea value={value} placeholder="Please dont leave me empty" onClick={e => console.log("clicked")} onChange={value => setValue(value)} />
  )
}



export default PlainRange