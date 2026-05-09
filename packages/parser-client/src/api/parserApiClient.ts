import { ParserRequest, ParserResponse } from '../contracts/parserContracts'

export async function parseJava(source: string, baseUrl: string = '/api/v1', token?: string): Promise<ParserResponse> {
  const request: ParserRequest = { source }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${baseUrl}/parser/java`, {
    method: 'POST',
    headers,
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

    let errorMessage = `API returned status ${response.status}`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.error || errorJson.message || errorMessage;
    } catch (e) {
      const errorText = await response.text();
      errorMessage = errorText.substring(0, 200) || errorMessage;
    }

    return {
      success: false,
      warnings: [],
      errors: [
        {
          code: 'API_ERROR',
          message: errorMessage,
        },
      ],
    }
  }

  const result = await response.json()
  const data = result.data as ParserResponse

  return {
    success: data?.success ?? false,
    diagram: data?.diagram,
    warnings: data?.warnings ?? [],
    errors: data?.errors ?? [],
  }
}
