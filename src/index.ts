import { mastra } from './mastra'
import * as readline from 'readline'

const main = async () => {
  const promptAgentWorkflow = mastra.getWorkflow('promptAgentWorkflow')
  const wf = promptAgentWorkflow.createRun()

  let did = false
  let promises: Promise<any>[] = []
  promptAgentWorkflow.watch(async (data) => {
    const suspended = data.activePaths.find((p) => p.status === 'suspended')
    if (suspended) {
      console.log('suspended', suspended)
    }

    if (suspended?.stepId === 'promptAgent') {
      const newCtx = {
        ...data.context,
      }

      // @ts-ignore
      newCtx.steps.getUserInput.output = {
        userInput:
          'yoyo catto, tell me what is a good cat breed for me. I like lazy cats who like being indoors and are cuddly but not too needy.',
      }

      await new Promise((resolve) => setTimeout(resolve, 1e3 * 5))
      promises.push(
        promptAgentWorkflow.resume({
          runId: wf.runId,
          stepId: suspended.stepId,
          context: newCtx,
        })
      )
    } else if (suspended?.stepId === 'improveResponse') {
      await new Promise((resolve) => setTimeout(resolve, 1e3 * 5))
      promises.push(
        promptAgentWorkflow.resume({
          runId: wf.runId,
          stepId: suspended.stepId, // 'evaluateToneConsistency',
          context: { humanConfirmation: true },
        })
      )
    } else if (suspended?.stepId === 'humanIntervention') {
      if (did) {
        return
      }
      did = true
      promises.push(
        promptAgentWorkflow.resume({
          runId: wf.runId,
          stepId: suspended.stepId,
          context: { humanPrompt: 'hello, what is a bengal cat?' },
        })
      )

      // const rl = readline.createInterface({
      //   input: process.stdin,
      //   output: process.stdout,
      // })
      //
      // rl.question('Please enter your prompt: ', (userInput) => {
      //   rl.close()
      //   promptAgentWorkflow.resume({
      //     runId: wf.runId,
      //     stepId: suspended.stepId,
      //     context: { humanPrompt: userInput },
      //   })
      // })
    }
  })

  const result = await wf.start({
    // triggerData: { input: '' },
    triggerData: {
      input:
        'yoyo catto, tell me what is a good cat breed for me. I like lazy cats who like being indoors and are cuddly but not too needy.',
    },
  })

  console.log('RESULT', result)

  await new Promise((resolve) => setTimeout(resolve, 1e3 * 20))
  const results = await Promise.all(promises)
  console.log('RESULTS', results)
}

main().then(() => {
  const telemetry = mastra.getTelemetry()
  return telemetry?.shutdown()
})
