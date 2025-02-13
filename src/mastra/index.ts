import { Mastra, MastraStorageLibSql } from '@mastra/core'
import { catOne, agentTwo } from './agents/agent'
import { logCatWorkflow } from './workflow'

const storage = new MastraStorageLibSql({
  config: {
    url: 'file:mastra.db',
  },
})

await storage.init()

export const mastra = new Mastra({
  agents: { catOne, agentTwo },
  workflows: { logCatWorkflow },
  storage,
})
