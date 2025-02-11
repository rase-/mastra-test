import { Mastra, MastraStorageLibSql } from '@mastra/core'
import { catOne, agentTwo } from './agents/agent'
import { logCatWorkflow } from './workflow'

const storage = new MastraStorageLibSql({
  config: {
    // url: 'file:mastra.db',
    url: 'libsql://testdb-rase-.turso.io',
    authToken:
      'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzkyODA2NzIsImlkIjoiYjNlZjFkYjEtMGQ0My00NzdkLWFmNTEtZjdiYmFhMGY1YjU4In0.P_7fstavSxQv8IqoqOnGyCw-8xTP2caKri-itlmqWIaUsVKWqNOPnB55Z7mqaUUsysrDgr0Or8bjSf5AG6ewAQ',
  },
})

// await storage.sync()

export const mastra = new Mastra({
  agents: { catOne, agentTwo },
  workflows: { logCatWorkflow },
  storage,
})
