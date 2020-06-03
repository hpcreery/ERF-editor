const fs = window.require('fs')
const readline = window.require('readline')
const stream = window.require('stream')

function lineReplace({ file, line, text, addNewLine = true, callback }) {
	const readStream = fs.createReadStream(file)
	const tempFile = `${file}.tmp`
	const writeStream = fs.createWriteStream(tempFile)
	const rl = readline.createInterface(readStream, stream)
	let replacedText

	let currentLine = 0
	rl.on('line', (originalLine) => {
		++currentLine

		// Replace.
		if (currentLine === line) {
			replacedText = originalLine
			if (addNewLine) return writeStream.write(`${text}\r\n`) // added \r\n to support windows file formats and not break my stream -HC
			return writeStream.write(`${text}\r\n`)
		}

		// Save original line.
		writeStream.write(`${originalLine}\r\n`) // added \r\n to support windows file formats and not break my stream -HC
	})

	rl.on('close', () => {
		// Finish writing to temp file and replace files.
		// Replace original file with fixed file (the temp file).
		writeStream.end(() => {
			try {
				fs.unlink(file, (err) => fs.renameSync(tempFile, file)) // Delete original file.
				//fs.renameSync(tempFile, file) // Rename temp file with original file name.
			} catch (e) {
				throw e
			}

			callback({ file, line, replacedText, text })
		})
	})
}

module.exports = lineReplace
