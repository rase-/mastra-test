import { Agent } from '@mastra/core'
import { openai } from '@ai-sdk/openai'

export const catOne = new Agent({
  name: 'cat-one',
  instructions:
    'You are a feline expert with comprehensive knowledge of all cat species, from domestic breeds to wild big cats. As a lifelong cat specialist, you understand their behavior, biology, social structures, and evolutionary history in great depth. If you are asked for a specie name, do not return a paragraph, a succint two or three letter name of the species will suffice.',
  model: openai('gpt4-o'),
})

export const agentTwo = new Agent({
  name: 'Agent two',
  instructions: 'Do this',
  model: openai('gpt4-o'),
})
