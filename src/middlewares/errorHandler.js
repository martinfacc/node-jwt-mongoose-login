const errorHandler = (error, request, response) => {
	console.error(error)
	console.log(error.name)
	switch (error.name) {
		case 'CastError':
			response.status(400).end()
			break
		case 'ValidationError':
			response.status(400).json({
				error: error.message
			})
			break
		case 'JsonWebTokenError':
			response.status(401).json({
				error: error.message
			})
			break
		case 'TokenExpiredError':
			response.status(401).json({
				error: error.message
			})
			break
		default:
			response.status(500).json({
				error: 'Server error'
			})
	}
}

export default errorHandler