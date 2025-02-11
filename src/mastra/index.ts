import { Mastra, MastraStorageLibSql } from '@mastra/core'
import { catOne, agentTwo } from './agents/agent'
import { logCatWorkflow } from './workflow'

const storage = new MastraStorageLibSql({
  config: {
    url: 'file:mastra.db',
    syncUrl: 'libsql://testdb-mastra.turso.io',
    authToken:
      'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzkyODEzODQsImlkIjoiZTIxZTk0ZGUtODA3OC00YmRlLThlNTItNjEwODMxYmExYTgzIn0.Mf4sTSnkxteTii9di4F65KGECbvaN1EUIkq8CtKab4dUzrQe3gNgLfPg2O7-R_FhpLfdsoeXR5xzEbJSoS_ODg',
  },
})

await storage.init()
await storage.sync()

export const mastra = new Mastra({
  agents: { catOne, agentTwo },
  workflows: { logCatWorkflow },
  storage,
})
