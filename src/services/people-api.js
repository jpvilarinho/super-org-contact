const GOOGLE_PEOPLE_API_URL = 'https://people.googleapis.com/v1/people/me/connections'

export async function fetchAllContacts(accessToken) {
  const contacts = []
  let pageToken = ''

  do {
    const url = new URL(GOOGLE_PEOPLE_API_URL)
    url.searchParams.set('personFields', 'names,emailAddresses')
    url.searchParams.set('pageSize', '1000')

    if (pageToken) {
      url.searchParams.set('pageToken', pageToken)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ao buscar contatos: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const currentConnections = Array.isArray(data.connections) ? data.connections : []

    contacts.push(...currentConnections)
    pageToken = data.nextPageToken || ''
  } while (pageToken)

  return contacts
}