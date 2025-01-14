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
const zod_1 = require("zod");
const mastra_1 = require("./mastra");
const specieSchema = zod_1.z.object({
    species: zod_1.z.string(),
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const agentCat = mastra_1.mastra.getAgent('catOne');
    try {
        const result = yield agentCat.generate('What is the most popular cat species?', {
            output: specieSchema,
        });
        const res = specieSchema.parse(result === null || result === void 0 ? void 0 : result.object);
        console.log(res.species);
        const { start } = mastra_1.mastra.getWorkflow('logCatWorkflow').createRun();
        yield start({ triggerData: { name: res.species } });
    }
    catch (err) {
        console.error(err);
    }
});
main();
