import { Workflow, Step } from '@mastra/core'
import { z } from 'zod'

const logCatName = new Step({
  id: 'logCatName',
  outputSchema: z.object({
    rawText: z.string(),
  }),
  execute: async ({ context }) => {
    const name = context?.getStepPayload<{ name: string }>('trigger')?.name
    console.log(`Hello, ${name} 🐈`)
    return { rawText: `Hello ${name}` }
  },
})

const logCatPrompt = new Step({
  id: 'logCatPrompt',
  outputSchema: z.object({
    output: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    // @ts-ignore
    const name = context.steps.logCatName?.output?.rawText
    let output = 'fail'
    if (name) {
      const resp = await mastra?.agents?.catOne?.generate([
        { role: 'User', message: name.rawText },
      ])
      if (resp?.text) {
        output = resp.text
      }
    }
    return { output }
  },
})

export const logCatWorkflow = new Workflow({
  name: 'log-cat-workflow',
  triggerSchema: z.object({
    name: z.string(),
  }),
})

logCatWorkflow.step(logCatName).then(logCatPrompt).commit()
