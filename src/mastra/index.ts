import { Mastra, MastraStorageLibSql } from '@mastra/core'
import { catOne, agentTwo } from './agents/agent'
import { logCatWorkflow } from './workflow'

console.log(process.env)
let storage = undefined
if (process.env.MASTRA_STORAGE_URL && process.env.MASTRA_STORAGE_AUTH_TOKEN) {
  console.log('Using Mastra Cloud Storage: ' + process.env.MASTRA_STORAGE_URL)
  storage = new MastraStorageLibSql({
    config: {
      url: process.env.MASTRA_STORAGE_URL,
      authToken: process.env.MASTRA_STORAGE_AUTH_TOKEN,
    },
  })
}

export const mastra = new Mastra({
  agents: { catOne, agentTwo },
  workflows: { logCatWorkflow },
  storage,
})
