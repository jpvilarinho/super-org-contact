export function normalizeContacts(contacts = []) {
  return contacts.flatMap((contact) => {
    const displayName = contact.names?.[0]?.displayName || 'Sem nome'
    const emails = Array.isArray(contact.emailAddresses) ? contact.emailAddresses : []

    return emails
      .map((emailEntry) => {
        const email = emailEntry?.value?.trim().toLowerCase()

        if (!email?.includes('@')) {
          return null
        }

        const domain = email.split('@')[1]?.trim().toLowerCase()

        if (!domain) {
          return null
        }

        return {
          name: displayName,
          email,
          domain,
        }
      })
      .filter(Boolean)
  })
}

export function groupContactsByDomain(normalizedContacts = []) {
  const domainMap = new Map()

  normalizedContacts.forEach((contact) => {
    if (!domainMap.has(contact.domain)) {
      domainMap.set(contact.domain, [])
    }

    domainMap.get(contact.domain).push(contact)
  })

  return Array.from(domainMap.entries())
    .map(([domain, contacts]) => {
      const uniqueEmailsMap = new Map()

      contacts.forEach((contact) => {
        if (!uniqueEmailsMap.has(contact.email)) {
          uniqueEmailsMap.set(contact.email, contact)
        }
      })

      const uniqueContacts = Array.from(uniqueEmailsMap.values()).sort((a, b) =>
        a.email.localeCompare(b.email)
      )

      return {
        domain,
        count: uniqueContacts.length,
        contacts: uniqueContacts,
      }
    })
    .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain))
}

export function filterGroupedDomains(groupedDomains = [], searchTerm = '') {
  const term = searchTerm.trim().toLowerCase()

  if (!term) {
    return groupedDomains
  }

  return groupedDomains
    .map((group) => {
      const domainMatches = group.domain.includes(term)

      const filteredContacts = domainMatches
        ? group.contacts
        : group.contacts.filter(
            (contact) =>
              contact.name.toLowerCase().includes(term) ||
              contact.email.toLowerCase().includes(term)
          )

      return {
        ...group,
        count: filteredContacts.length,
        contacts: filteredContacts,
      }
    })
    .filter((group) => group.contacts.length > 0)
}