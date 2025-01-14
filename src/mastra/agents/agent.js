"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentTwo = exports.catOne = void 0;
const core_1 = require("@mastra/core");
exports.catOne = new core_1.Agent({
    name: 'cat-one',
    instructions: 'You are a feline expert with comprehensive knowledge of all cat species, from domestic breeds to wild big cats. As a lifelong cat specialist, you understand their behavior, biology, social structures, and evolutionary history in great depth. If you are asked for a specie name, do not return a paragraph, a succint two or three letter name of the species will suffice.',
    model: {
        provider: 'OPEN_AI',
        name: 'gpt-4o',
        toolChoice: 'auto',
    },
});
exports.agentTwo = new core_1.Agent({
    name: 'Agent Two',
    instructions: 'Do this',
    model: {
        provider: 'GROQ',
        name: 'llama3-groq-70b-8192-tool-use-preview',
        toolChoice: 'auto',
    },
});
