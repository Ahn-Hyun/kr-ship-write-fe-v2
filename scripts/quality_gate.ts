import { promises as fs } from 'node:fs';
import path from 'node:path';

const ALLOWED_CATEGORIES = new Set(['stocks', 'real-estate']);
const MIN_BODY_LENGTH = 1200;

const contentDir = path.join(process.cwd(), 'src', 'content', 'blog');

const parseFrontmatter = (raw: string) => {
	const match = raw.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return { data: {}, body: raw, frontmatter: '' };
	const lines = match[1].split('\n');
	const data: Record<string, string> = {};
	for (const line of lines) {
		const [key, ...rest] = line.split(':');
		if (!key || rest.length === 0) continue;
		data[key.trim()] = rest.join(':').trim();
	}
	return { data, body: raw.slice(match[0].length).trim(), frontmatter: match[1] };
};

const validateHeroImageFrontmatter = (file: string, frontmatter: string) => {
	if (!frontmatter) return;

	const lines = frontmatter.split('\n');
	const heroIndex = lines.findIndex((line) => {
		if (line !== line.trimStart()) return false;
		const separatorIndex = line.indexOf(':');
		return separatorIndex > 0 && line.slice(0, separatorIndex).trim() === 'heroImage';
	});
	if (heroIndex === -1) return;

	const heroLine = lines[heroIndex];
	const heroSeparatorIndex = heroLine.indexOf(':');
	const inlineValue = heroLine.slice(heroSeparatorIndex + 1).trim();
	if (inlineValue) {
		console.error(`[FAIL] ${file} - heroImage must use nested src/alt frontmatter, not a scalar string`);
		return true;
	}

	let sawSrc = false;
	for (let i = heroIndex + 1; i < lines.length; i += 1) {
		const line = lines[i];
		if (!line.trim()) continue;
		if (!line.startsWith(' ')) {
			if (line.startsWith('\t')) {
				console.error(`[FAIL] ${file} - heroImage nested fields must be indented with two spaces`);
				return true;
			}
			break;
		}
		if (!line.startsWith('  ') || line.startsWith('   ') || line[2] === '\t') {
			console.error(`[FAIL] ${file} - heroImage nested fields must be indented with two spaces`);
			return true;
		}

		const nestedLine = line.slice(2);
		const separatorIndex = nestedLine.indexOf(':');
		if (separatorIndex <= 0) {
			console.error(`[FAIL] ${file} - heroImage nested fields are malformed`);
			return true;
		}

		const nestedKey = nestedLine.slice(0, separatorIndex).trim();
		const nestedValue = nestedLine.slice(separatorIndex + 1).trim();
		if (nestedKey === 'src') {
			if (!nestedValue || nestedValue === '""' || nestedValue === "''") {
				console.error(`[FAIL] ${file} - heroImage.src must not be empty`);
				return true;
			}
			sawSrc = true;
		}
	}

	if (!sawSrc) {
		console.error(`[FAIL] ${file} - heroImage must include a nested src field`);
		return true;
	}

	return false;
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
	const { data, body, frontmatter } = parseFrontmatter(raw);

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

	if (!Object.hasOwn(data, 'references')) {
		console.error(`[FAIL] ${file} - missing frontmatter references field`);
		hasError = true;
	}

	if (validateHeroImageFrontmatter(file, frontmatter)) {
		hasError = true;
	}
}

if (hasError) {
	process.exit(1);
}

console.log('Quality gate passed');
