export type QueryParam = {
  name: string,
  value: string
}

function formatQueryParams(qp?: QueryParam[]): string {
  if (qp != undefined && qp.length > 0) {
    return "?" + qp.map(t => `${t.name}=${t.value}`).join("&")
  } else {
    return ""
  }
}

// Typed wrapper to better integrate fetch
export async function fetchJsonAs<T>(url: string, qp?: QueryParam[]): Promise<T> {
  const response = await fetch(url + formatQueryParams(qp))
  return await response.json()
}