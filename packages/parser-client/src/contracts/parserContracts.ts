import { UMLDiagram } from './umlTypes'

export interface ParserRequest {
  source: string
}

export interface ParserWarning {
  code: string
  message: string
  line?: number
}

export interface ParserError {
  code: string
  message: string
  line?: number
  column?: number
}

export interface ParserResponse {
  success: boolean
  diagram?: UMLDiagram
  warnings: ParserWarning[]
  errors: ParserError[]
}
