import { mastra } from './mastra'
import * as readline from 'readline'

const main = async () => {
  const promptAgentWorkflow = mastra.getWorkflow('promptAgentWorkflow')
  const wf = promptAgentWorkflow.createRun()

  promptAgentWorkflow.watch((data) => {
    console.log('active paths', data.value)
    const suspended = data.activePaths.find((p) => p.status === 'suspended')

    if (suspended?.stepId === 'promptAgent') {
      const newCtx = {
        ...data.context,
      }

      // @ts-ignore
      newCtx.steps.getUserInput.output = {
        userInput:
          'yoyo catto, tell me what is a good cat breed for me. I like lazy cats who like being indoors and are cuddly but not too needy.',
      }

      setTimeout(() => {
        promptAgentWorkflow.resume({
          runId: wf.runId,
          stepId: suspended.stepId,
          context: newCtx,
        })
      }, 1e3 * 5)
    } else if (suspended?.stepId === 'improveResponse') {
      setTimeout(() => {
        promptAgentWorkflow.resume({
          runId: wf.runId,
          stepId: suspended.stepId, // 'evaluateToneConsistency',
          context: { humanConfirmation: true },
        })
      }, 1e3 * 5)
    } else if (suspended?.stepId === 'humanIntervention') {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      rl.question('Please enter your prompt: ', (userInput) => {
        rl.close()
        promptAgentWorkflow.resume({
          runId: wf.runId,
          stepId: suspended.stepId,
          context: { humanPrompt: userInput },
        })
      })
    }
  })

  await wf.start({
    // triggerData: { input: '' },
    triggerData: {
      input:
        'yoyo catto, tell me what is a good cat breed for me. I like lazy cats who like being indoors and are cuddly but not too needy.',
    },
  })
}

main().then(() => {
  const telemetry = mastra.getTelemetry()
  return telemetry?.shutdown()
})
