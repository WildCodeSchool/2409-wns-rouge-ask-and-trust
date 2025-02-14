// Interface for Apperror structure
interface IAppError {
	statusCode: number
	errorType?: string
	additionalInfo?: string
	isOperational?: boolean
}

// AppError class with proper TypeScript types
export class AppError extends Error implements IAppError {
	statusCode: number
	errorType?: string
	additionalInfo?: string
	isOperational: boolean

	constructor(
		message: string,
		statusCode: number = 500,
		errorType?: string,
		additionalInfo?: string,
		isOperational: boolean = true
	) {
		super(message)
		Object.setPrototypeOf(this, new.target.prototype)

		this.statusCode = statusCode
		this.errorType = errorType
		this.additionalInfo = additionalInfo
		this.isOperational = isOperational
		Error.captureStackTrace(this)
	}
}
