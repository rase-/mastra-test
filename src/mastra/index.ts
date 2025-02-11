import {
  MastraStorageLibSql,
  createLogger,
  Mastra,
  OTLPStorageExporter,
  MastraStorage,
} from '@mastra/core'
import { PostgresStore } from '@mastra/pg'
import { catOne, agentTwo } from './agents/agent'
import { logCatWorkflow } from './workflow'

const logger = createLogger({
  level: 'debug',
})

const storage: MastraStorage = new MastraStorageLibSql({
  config: {
    url: 'file:mastra.db',
  },
})

// const storage: MastraStorage = new PostgresStore({
//   database: 'mastra',
//   user: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   password: 'postgres',
// })

await storage.init()

export const mastra = new Mastra({
  agents: { catOne, agentTwo },
  workflows: { logCatWorkflow },
  logger,
  storage,
  telemetry: {
    export: {
      type: 'custom',
      exporter: new OTLPStorageExporter({
        logger,
        storage,
      }),
    },
  },
})
