import { Worker } from "node:worker_threads";
import Koa from "koa";
import Router from "@koa/router";
import BodyParser from "koa-bodyparser";

const app = new Koa();
app.use(BodyParser({ enableTypes: ["text"] }));

const router = new Router();

router.get("/ping", ctx => ctx.body = "Pong");

router.post("/process", async ctx => {
    const worker = new Worker("./worker.mjs", {
        workerData: {
            path: "./worker.ts",
            source: ctx.request.body,
        },
    });

    ctx.body = await new Promise<string>(resolve => {
        worker.on("message", result => resolve(result));
    });;
});

app.use(router.routes());
app.listen(3000);
