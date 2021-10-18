import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import Koa from "koa";
import Router from "@koa/router";
import BodyParser from "koa-bodyparser";
import axios from "axios";
import { uploadToIpfs } from "./ipfs.js";

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

router.post("/image/uploadByUrl", async ctx => {
    const imageResponse = await axios.get(ctx.request.body, { responseType: "stream" });

    try {
        ctx.body = await uploadToIpfs(imageResponse.data);
    } catch (e) {
        console.error(`${new Date}: unhandled exception when processing ${ctx.request.body}`, e);
        ctx.status = 500;
    }
});

app.use(router.routes());
app.listen(3000);
