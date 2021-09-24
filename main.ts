import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import Koa from "koa";
import Router from "@koa/router";
import BodyParser from "koa-bodyparser";

const workerFilename = fileURLToPath(new URL("./worker.mjs", import.meta.url));

const app = new Koa();
app.use(BodyParser({ enableTypes: ["text"] }));

const router = new Router();

router.get("/ping", ctx => ctx.body = "Pong");

router.post("/process", async ctx => {
    const worker = new Worker(workerFilename, {
        workerData: {
            source: ctx.request.body,
        },
    });

    ctx.body = await new Promise<string>(resolve => {
        worker.on("message", result => resolve(result));
    });;
});

app.use(router.routes());
app.listen(3000);
