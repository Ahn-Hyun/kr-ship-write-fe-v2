import { promises as fs } from 'node:fs';
import path from 'node:path';

const ALLOWED_CATEGORIES = new Set(['stocks', 'real-estate']);
const MIN_BODY_LENGTH = 1200;

const contentDir = path.join(process.cwd(), 'src', 'content', 'blog');

const parseFrontmatter = (raw: string) => {
	const match = raw.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return { data: {}, body: raw };
	const lines = match[1].split('\n');
	const data: Record<string, string> = {};
	for (const line of lines) {
		const [key, ...rest] = line.split(':');
		if (!key || rest.length === 0) continue;
		data[key.trim()] = rest.join(':').trim();
	}
	return { data, body: raw.slice(match[0].length).trim() };
};

const parseListField = (value: string | undefined) => {
	if (!value) return [];
	const trimmed = value.trim();
	if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return [];
	return [...trimmed.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
};

const files = await fs.readdir(contentDir);
const posts = files.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));

let hasError = false;

for (const file of posts) {
	const fullPath = path.join(contentDir, file);
	const raw = await fs.readFile(fullPath, 'utf-8');
	const { data, body } = parseFrontmatter(raw);

	if (data.draft === 'true') {
		continue;
	}

	if (!data.title) {
		console.error(`[FAIL] ${file} - missing title`);
		hasError = true;
	}

	if (!data.description) {
		console.error(`[FAIL] ${file} - missing description`);
		hasError = true;
	}

	const categories = parseListField(data.category);
	if (categories.length !== 1 || !ALLOWED_CATEGORIES.has(categories[0])) {
		console.error(`[FAIL] ${file} - category must be exactly one of: stocks, real-estate`);
		hasError = true;
	}

	if (body.length < MIN_BODY_LENGTH) {
		console.error(`[FAIL] ${file} - body too short (${body.length}/${MIN_BODY_LENGTH})`);
		hasError = true;
	}

	if (!Object.prototype.hasOwnProperty.call(data, 'references')) {
		console.error(`[FAIL] ${file} - missing frontmatter references field`);
		hasError = true;
	}
}

if (hasError) {
	process.exit(1);
}

console.log('Quality gate passed');
