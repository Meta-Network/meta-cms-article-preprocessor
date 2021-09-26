import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { visit } from "unist-util-visit";
import type { Image } from "mdast";
import axios from "axios";
import { uploadToIpfs } from "./ipfs.js";

export async function process(source: string) {
    const mdAst = unified()
        .use(remarkParse)
        .parse(source);

    const promises = new Array<Promise<void>>();

    visit(mdAst, "image", imageNode => promises.push(replaceImageUrl(imageNode)));

    await Promise.all(promises);

    const md = unified()
        .use(remarkStringify)
        .stringify(mdAst);

    return String(md);
}

export async function replaceImageUrl(node: Image) {
    const oldUrl = node.url;
    const imageResponse = await axios.get(oldUrl, { responseType: "stream" });

    const result = await uploadToIpfs(imageResponse.data);

    node.url = `ipfs://${result.hashV0}`;

    console.log(`${new Date}: ${oldUrl} -> ${node.url}`);
}
