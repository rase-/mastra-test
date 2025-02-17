import { Workflow, Step } from '@mastra/core'
import { ToneConsistencyMetric, CompletenessMetric } from '@mastra/evals/nlp'
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
        { role: 'user', content: name.rawText },
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
    humanConfirmation: z.boolean().optional(),
  }),
})

logCatWorkflow.step(logCatName).then(logCatPrompt).commit()

const getUserInput = new Step({
  id: 'getUserInput',
  outputSchema: z.object({
    userInput: z.string(),
  }),
  execute: async (opts) => {
    const { context } = opts
    const userInput = context?.getStepPayload<{ input: string }>('trigger')
    console.log('USER INPUT', userInput)
    return { userInput: userInput ? userInput?.input?.trim() : '' }
  },
})

const promptAgent = new Step({
  id: 'promptAgent',
  outputSchema: z.object({
    modelOutput: z.string(),
  }),
  execute: async ({ context, mastra, suspend }) => {
    // @ts-ignore
    const userInput = context.steps.getUserInput?.output?.userInput
    console.log({ context })
    if (!userInput) {
      await suspend()
    }

    const resp = await mastra?.agents?.catOne?.generate([userInput])

    if (!resp?.text) {
      console.log('AGENT GENERATION ERROR', resp)
      await suspend()
    }

    const txt: string = resp?.text as string
    return { modelOutput: txt }
  },
})

const evaluateToneConsistency = new Step({
  id: 'evaluateToneConsistency',
  outputSchema: z.object({
    toneScore: z.any(),
    completenessScore: z.any(),
  }),
  execute: async ({ context }) => {
    // @ts-ignore
    const modelOutput = context.steps.promptAgent?.output?.modelOutput

    // @ts-ignore
    const userInput = context.steps.getUserInput?.output?.userInput
    if (!modelOutput) {
      return { toneScore: 0, completenessScore: 0 }
    }

    const toneMetric = new ToneConsistencyMetric()
    const completenessMetric = new CompletenessMetric()

    const [toneScore, completenessScore] = await Promise.all([
      toneMetric.measure(userInput, modelOutput),
      completenessMetric.measure(userInput, modelOutput),
    ])

    return { toneScore, completenessScore }
  },
})

const improveResponse = new Step({
  id: 'improveResponse',
  outputSchema: z.object({
    improvedOutput: z.string(),
  }),
  execute: async ({ context, mastra, suspend }) => {
    // @ts-ignore
    const userInput = context.steps.getUserInput?.output?.userInput
    // @ts-ignore
    const modelOutput = context.steps.promptAgent?.output?.modelOutput
    // @ts-ignore
    const { toneScore, completenessScore } =
      // @ts-ignore
      context.steps.evaluateToneConsistency?.output

    const prompt = `Previous response: "${modelOutput}"
Evaluation metrics:
- Tone consistency score: ${JSON.stringify(toneScore)}
- Completeness score: ${JSON.stringify(completenessScore)}

Please provide an improved response to the user's input: "${userInput}"
Focus on maintaining consistent tone and ensuring complete coverage of the user's request. Be inventive in trying to improve the completeness score.`

    // wait for human to review
    const { humanConfirmation } =
      context.getStepPayload<{ humanConfirmation: boolean }>(
        'improveResponse'
      ) ?? {}
    console.dir(
      { humanConfirmation, finalPrompt: prompt, context },
      { depth: 5 }
    )

    if (!humanConfirmation) {
      await suspend()
    }
    const resp = await mastra?.agents?.catOne?.generate([prompt])
    return { improvedOutput: resp?.text || modelOutput }
  },
})

const evaluateImprovedResponse = new Step({
  id: 'evaluateImprovedResponse',
  outputSchema: z.object({
    toneScore: z.any(),
    completenessScore: z.any(),
  }),
  execute: async ({ context }) => {
    // @ts-ignore
    const modelOutput = context.steps.improveResponse?.output?.improvedOutput
    // @ts-ignore
    const userInput = context.steps.getUserInput?.output?.userInput
    if (!modelOutput) {
      return { toneScore: 0, completenessScore: 0 }
    }

    const toneMetric = new ToneConsistencyMetric()
    const completenessMetric = new CompletenessMetric()

    const [toneScore, completenessScore] = await Promise.all([
      toneMetric.measure(userInput, modelOutput),
      completenessMetric.measure(userInput, modelOutput),
    ])

    console.dir(
      {
        finalMetrics: { toneScore, completenessScore },
        improvedOutput: modelOutput,
      },
      { depth: 5 }
    )

    return { toneScore, completenessScore }
  },
})

export const promptAgentWorkflow = new Workflow({
  name: 'prompt-agent-workflow',
  triggerSchema: z.object({
    input: z.string(),
  }),
})

promptAgentWorkflow
  .step(getUserInput)
  .then(promptAgent)
  .then(evaluateToneConsistency)
  .then(improveResponse)
  .then(evaluateImprovedResponse)
  .commit()
