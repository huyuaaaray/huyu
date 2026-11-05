import { NotionAPI } from 'notion-client'

/**
 * Notion's internal API now wraps each record one level deeper:
 *   { value: { value: <record>, role } }
 * instead of the shape notion-client / react-notion-x 6.x expect:
 *   { value: <record>, role }
 * Unwrap every record map the API returns so the rest of the app keeps working.
 */
function normalizeRecordMap(recordMap: any) {
  if (!recordMap || typeof recordMap !== 'object') return

  for (const table of Object.keys(recordMap)) {
    const records = recordMap[table]
    if (!records || typeof records !== 'object') continue

    for (const id of Object.keys(records)) {
      const record = records[id]
      const inner = record?.value

      if (
        inner &&
        typeof inner === 'object' &&
        inner.id === undefined &&
        inner.value &&
        typeof inner.value === 'object'
      ) {
        records[id] = {
          ...record,
          role: record.role ?? inner.role,
          value: inner.value
        }
      }
    }
  }
}

class PatchedNotionAPI extends NotionAPI {
  async fetch<T>(args: Parameters<NotionAPI['fetch']>[0]): Promise<T> {
    const res: any = await super.fetch<T>(args)
    normalizeRecordMap(res?.recordMap)
    return res
  }
}

export const notion = new PatchedNotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL
})