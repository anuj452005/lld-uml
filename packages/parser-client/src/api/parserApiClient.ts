import { ParserRequest, ParserResponse } from '../contracts/parserContracts'

export async function parseJava(source: string): Promise<ParserResponse> {
  const request: ParserRequest = { source }

  const response = await fetch('/api/v1/parser/java', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    if (response.status === 413) {
      return {
        success: false,
        warnings: [],
        errors: [
          {
            code: 'PAYLOAD_TOO_LARGE',
            message: 'Source code exceeds 1MB limit.',
          },
        ],
      }
    }

    const errorText = await response.text()
    return {
      success: false,
      warnings: [],
      errors: [
        {
          code: 'API_ERROR',
          message: errorText || `API returned status ${response.status}`,
        },
      ],
    }
  }

  const result = await response.json()
  return result.data as ParserResponse
}
