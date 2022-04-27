const errorDictionary = {
	customError: {
		callback(error) {
			const { custom } = error
			this.status = 500
			Object.assign(this, custom)
		}
	},
	noAuthenticationHeader: {
		status: 401,
		message: 'No authentication header'
	},
	invalidAuthenticationToken: {
		status: 401,
		message: 'Invalid authentication token'
	},
	invalidSession: {
		status: 401,
		message: 'Invalid session'
	},
	creatingSessionError: {
		status: 409,
		message: 'Error creating session'
	},
	MongoServerError: {
		status: 500,
		message: 'Mongo server error'
	}
}

/* eslint-disable no-unused-vars */
const errorHandler = (error, request, response, next) => {
	const errorName = error.name === 'Error' ? error.message : error.name
	console.log({ errorName, error })

	const errorElement = errorDictionary[errorName] ?? {
		status: 500,
		message: 'Internal server error'
	}

	if (errorElement.callback) {
		errorElement.callback(error)
		delete errorElement.callback
	}

	response.status(errorElement.status).json(errorElement)
}

export default errorHandler