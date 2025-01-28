import { Mastra, createLogger } from '@mastra/core'
import { UpstashTransport } from '@mastra/loggers'

import { catOne, agentTwo } from './agents/agent'
import { logCatWorkflow } from './workflow'

const logger = createLogger({
  name: 'MastraCloud',
  transports: {
    default: new UpstashTransport({
      listName: 'production-logs',
      upstashUrl: 'https://saved-lab-38332.upstash.io',
      upstashToken:
        'AZW8AAIjcDEyMjBmMjRiYzczMTI0ZWM4ODU5NThiODRjMGY0MTIzMnAxMA',
    }),
  },
  overrideDefaultTransports: true,
  level: 'debug',
})

export const mastra = new Mastra({
  agents: { catOne, agentTwo },
  workflows: { logCatWorkflow },
})

setTimeout(() => {
  mastra.setLogger({ logger })
}, 1000)
