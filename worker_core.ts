import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { visit } from "unist-util-visit";
import type { Image } from "mdast";

export async function process(source: string) {
    const mdAst = unified()
        .use(remarkParse)
        .parse(source);

    const imageNodes = new Array<Image>();

    visit(mdAst, "image", imageNode => imageNodes.push(imageNode));

    for (const imageNode of imageNodes) {
        imageNode.url = "test";
    }

    const md = unified()
        .use(remarkStringify)
        .stringify(mdAst);

    return String(md);
}
