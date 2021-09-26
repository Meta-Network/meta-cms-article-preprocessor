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

    const imageNodes = new Array<Image>();

    visit(mdAst, "image", imageNode => imageNodes.push(imageNode));

    await Promise.all(imageNodes.map(replaceImageUrl));

    const md = unified()
        .use(remarkStringify)
        .stringify(mdAst);

    return String(md);
}

export async function replaceImageUrl(node: Image) {
    const imageResponse = await axios.get(node.url, { responseType: "stream" });

    const result = await uploadToIpfs(imageResponse.data);

    node.url = `ipfs://${result.hashV0}`;
}
