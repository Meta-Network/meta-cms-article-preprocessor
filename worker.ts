
import { workerData, parentPort } from "node:worker_threads";
import { process } from "./worker_core.js";

const result = await process(workerData.source);

parentPort?.postMessage(String(result));
