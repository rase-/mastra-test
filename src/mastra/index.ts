import { Mastra, MastraStorageLibSql } from '@mastra/core'
import { catOne, agentTwo } from './agents/agent'
import { logCatWorkflow } from './workflow'

export const mastra = new Mastra({
  agents: { catOne, agentTwo },
  workflows: { logCatWorkflow },
  storage:
    process.env.MASTRA_DB_URL && process.env.MASTRA_DB_AUTH_TOKEN
      ? new MastraStorageLibSql({
          config: {
            url: process.env.MASTRA_DB_URL,
            authToken: process.env.MASTRA_DB_AUTH_TOKEN,
          },
        })
      : undefined,
})
