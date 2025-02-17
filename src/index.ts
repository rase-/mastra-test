import { z } from 'zod'

import { mastra } from './mastra'

const main = async () => {
  const promptAgentWorkflow = mastra.getWorkflow('promptAgentWorkflow')
  const wf = promptAgentWorkflow.createRun()

  promptAgentWorkflow.watch((data) => {
    console.log('DATA', JSON.stringify(data, null, 2))
    const suspended = data.activePaths.find((p) => p.status === 'suspended')

    if (suspended) {
      const newCtx = {
        ...data.context,
      }

      // @ts-ignore
      newCtx.steps[suspended.stepId].status = 'executing'
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
    }
  })

  await wf.start({
    triggerData: { input: '' },
    // 'yoyo catto, tell me what is a good cat breed for me. I like lazy cats who like being indoors and are cuddly but not too needy.',
  })
}

main()
