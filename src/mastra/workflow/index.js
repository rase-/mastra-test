"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logCatWorkflow = void 0;
const core_1 = require("@mastra/core");
const zod_1 = require("zod");
const logCatName = new core_1.Step({
    id: 'logCatName',
    outputSchema: zod_1.z.object({
        rawText: zod_1.z.string(),
    }),
    execute: (_a) => __awaiter(void 0, [_a], void 0, function* ({ context }) {
        var _b, _c;
        const name = (_c = (_b = context === null || context === void 0 ? void 0 : context.machineContext) === null || _b === void 0 ? void 0 : _b.getStepPayload('trigger')) === null || _c === void 0 ? void 0 : _c.name;
        console.log(`Hello, ${name} 🐈`);
        return { rawText: `Hello ${name}` };
    }),
});
exports.logCatWorkflow = new core_1.Workflow({
    name: 'log-cat-workflow',
    triggerSchema: zod_1.z.object({
        name: zod_1.z.string(),
    }),
});
exports.logCatWorkflow.step(logCatName).commit();
