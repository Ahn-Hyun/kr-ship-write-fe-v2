import { promises as fs } from 'node:fs';
import path from 'node:path';

const getArg = (key: string, fallback?: string) => {
	const index = process.argv.findIndex((arg) => arg === `--${key}`);
	return index >= 0 ? process.argv[index + 1] : fallback;
};

const slug = getArg('slug');
const date = getArg('date', new Date().toISOString().slice(0, 10));

if (!slug) {
	console.error('사용법: npm run generate:image -- --slug <slug> [--date YYYY-MM-DD]');
	process.exit(1);
}

const heroDir = path.join(process.cwd(), 'public', 'images', 'posts', `${date}-${slug}`);
const heroPath = path.join(heroDir, 'hero.jpg');
const placeholder = path.join(process.cwd(), 'src', 'assets', 'blog-placeholder-5.jpg');

await fs.mkdir(heroDir, { recursive: true });
await fs.copyFile(placeholder, heroPath);

console.log(`이미지 생성 완료: ${path.relative(process.cwd(), heroPath)}`);
