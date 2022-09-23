import { ValidationError } from 'class-validator'
import { convertValidationError } from './convert'
import { defaultErrors } from './defaultErrors'
import { ErrorList, ErrorResponse } from './types'

export class CustomError <T extends string> extends Error {
  static errors: ErrorList = defaultErrors

  name: T
  id?: string
  status: number
  validationErrors: ValidationError[]

  constructor (error: T|ValidationError[], id?: string) {
    super()

    if (error instanceof Array) {
      this.validationErrors = error

      error = 'validation_error' as T
    }

    this.name = error
    this.id = id

    if (!(error in CustomError.errors)) {
      throw new Error(`Error ${error} is not defined`)
    }

    this.message = CustomError.errors[error].description
    this.status = CustomError.errors[error].status
  }

  setDesc (desc: string) {
    this.message = desc
  }

  get response (): ErrorResponse {
    return {
      error: this.name,
      error_id: this.id,
      error_description: this.message,
      error_validation: convertValidationError(this.validationErrors)
    }
  }
}

