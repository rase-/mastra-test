import { Mastra, MastraStorageLibSql } from '@mastra/core'
import { catOne, agentTwo } from './agents/agent'
import { logCatWorkflow, promptAgentWorkflow } from './workflow'

const storage = new MastraStorageLibSql({
  config: {
    url: ':memory:',
    // url: 'file:mastra.db',
  },
})

await storage.init()

export const mastra = new Mastra({
  agents: { catOne, agentTwo },
  workflows: { logCatWorkflow, promptAgentWorkflow },
  storage,
  logger: false,
})
