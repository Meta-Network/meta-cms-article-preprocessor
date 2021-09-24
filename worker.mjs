import { register } from "ts-node";
import { workerData } from "node:worker_threads";

register();

await import(workerData.path);
