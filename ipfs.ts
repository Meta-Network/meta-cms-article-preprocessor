import { v4 as generateUUID } from "uuid";
import fleekPackage from "@fleekhq/fleek-storage-js";

const { streamUpload } = fleekPackage;

export async function uploadToIpfs(data: any) {
    return await streamUpload({
        apiKey: process.env.FLEEK_APIKEY!,
        apiSecret: process.env.FLEEK_APISECRET!,
        key: generateUUID(),
        // @ts-ignore
        stream: data,
    });
}