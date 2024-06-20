import {dirname, join} from "path";
import {writeFile, unlink, readdir} from "fs/promises";
import {fileURLToPath} from "url";

function sanitizeHtml(html) {
    html = html.replace(/&nbsp;/g, ' ');
    html = html.replace(/&amp;/g, '&');
    html = html.replace(/&lt;/g, '<');
    html = html.replace(/&gt;/g, '>');
    html = html.replace(/&quot;/g, '"');
    html = html.replace(/&#039;/g, "'");
    html = html.replace(/&rsquo;/g, "'");
    html = html.replace(/&lsquo;/g, "'");
    // replace &#8221;
    html = html.replace(/&#8221;/g, '"');

    return html;
}
export function parseShortcodes(html = '') {
    // parse the html and replace html entities
    html = sanitizeHtml(html);

    // Define the regex patterns
    const shortcodeRegex = /\[(\w+)(?:\s+href="([^"]*)")?\](.*?)\[\/\1\]/gs;
    const attributeRegex = /(\w+)="([^"]*|[\d]+|\[.*?\]|{.*?})"/g;
    const tagRegex = /{%(\w+)%}(.*?){%\/\1%}/gs;
    const tagItemRegex = /{([^}]+)}/g;
    let parsedShortcodes = [];
    let match;
    while ((match = shortcodeRegex.exec(html)) !== null) {
        let attributes = {};
        let attributeMatch;
        // Extract attributes from the opening tag
        while ((attributeMatch = attributeRegex.exec(match[2])) !== null) {
            let value = attributeMatch[2];
            if (value.startsWith('[') || value.startsWith('{')) {
                try {
                    value = JSON.parse(value);
                }
                catch (e) {
                    console.error('Failed to parse attribute value:', e);
                }
            }
            else if (!isNaN(Number(value))) {
                value = Number(value);
            }
            attributes[attributeMatch[1]] = value;
        }
        attributeRegex.lastIndex = 0; // Reset lastIndex
        let tagMatch;
        while ((tagMatch = tagRegex.exec(match[3])) !== null) {
            let tagItems = [];
            let tagItemMatch;
            while ((tagItemMatch = tagItemRegex.exec(tagMatch[2])) !== null) {
                let tagItemAttributes = {};
                let tagItemAttributeMatch;
                // Extract attributes from the tag items
                while ((tagItemAttributeMatch = attributeRegex.exec(tagItemMatch[1])) !== null) {
                    tagItemAttributes[tagItemAttributeMatch[1]] = isNaN(Number(tagItemAttributeMatch[2])) ? tagItemAttributeMatch[2] : Number(tagItemAttributeMatch[2]);
                }
                attributeRegex.lastIndex = 0; // Reset lastIndex
                tagItems.push(tagItemAttributes);
            }
            attributes[tagMatch[1]] = tagItems;
        }
        // Add href and content to attributes if they exist
        if (match[2]) {
            attributes['href'] = match[2];
        }
        if (match[3]) {
            attributes['content'] = match[3];
        }
        parsedShortcodes.push({ shortcode: match[1], attributes: attributes, originalHtml: match[0]});
    }
    return parsedShortcodes;
}

export function shortCodeToComponent(input) {
    // Destructure the input object
    const { shortcode, attributes } = input;

    // Capitalize the first letter of the shortcode to form the HTML tag
    const tag = shortcode.charAt(0).toUpperCase() + shortcode.slice(1);

    // Initialize an array to hold the attribute strings
    let attrs = [];

    // Check if the content attribute exists
    const hasContent = 'content' in attributes;

    // Iterate over the attributes object
    for (const [key, value] of Object.entries(attributes)) {
        // Skip the content attribute for now
        if (key !== 'content') {
            // Add the attribute to the attrs array
            attrs.push(`${key}="${value}"`);
        }
    }

    // Join the attributes with a space
    const attrsString = attrs.join(' ');

    // Construct the HTML string based on whether content exists
    if (hasContent) {
        return `<${tag} ${attrsString}>${attributes.content}</${tag}>`;
    } else {
        return `<${tag} ${attrsString} />`;
    }
}

export function replaceShortCodesWithComponents(html) {
    let newHtml = sanitizeHtml(html);
    const shortcodes = parseShortcodes(html);
    for (const shortcode of shortcodes) {

        const component = shortCodeToComponent(shortcode);
        newHtml = newHtml.replace(shortcode.originalHtml, component);
    }
    return newHtml;

}

export async function writeMdxFileFromShortcodesArray(html, fileName = 'shortcodes.mdx', cleanup = true) {
    const shortCodes = parseShortcodes(html);

    if (!Array.isArray(shortCodes) || shortCodes.length === 0) {
        return;
    }

    const frontmatter = `---\nslug: ${fileName.replace('.mdx', '')}\n---\n\n`;
    const markDownHtml = replaceShortCodesWithComponents(html);
    let content = '';
    const importString = shortCodes.map(({ shortcode }) => {
        const name = shortcode.charAt(0).toUpperCase() + shortcode.slice(1);
        return `import ${name} from '@components/shortcodes/${name.toLowerCase()}.astro';`;
    }).join('\n');

    content += importString + '\n\n';
    content += markDownHtml;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = join(__dirname, "../", "src", "markdown-content", `${fileName}.mdx`);

    await writeFile(filePath, frontmatter + content);
    console.log(`MDX file written to ${filePath}`);
}
