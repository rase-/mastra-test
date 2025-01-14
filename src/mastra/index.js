"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mastra = void 0;
const core_1 = require("@mastra/core");
const agent_1 = require("./agents/agent");
const workflow_1 = require("./workflow");
exports.mastra = new core_1.Mastra({
    agents: { catOne: agent_1.catOne, agentTwo: agent_1.agentTwo },
    logger: false,
    workflows: { logCatWorkflow: workflow_1.logCatWorkflow },
});
