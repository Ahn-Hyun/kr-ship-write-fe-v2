import { promises as fs } from 'node:fs';
import path from 'node:path';

const getArg = (key: string, fallback?: string) => {
	const index = process.argv.findIndex((arg) => arg === `--${key}`);
	return index >= 0 ? process.argv[index + 1] : fallback;
};

const slug = getArg('slug', `post-${Date.now()}`);
const title = getArg('title', '새 글 제목');
const description = getArg('description', '설명을 입력하세요.');
const category = getArg('category', 'ai-llm');
const tags = (getArg('tags', 'AI,LLM') ?? '').split(',').map((tag) => tag.trim());

const today = new Date().toISOString().slice(0, 10);
const postDir = path.join(process.cwd(), 'src', 'content', 'blog');
const postPath = path.join(postDir, `${today}-${slug}.mdx`);

const heroDir = path.join(process.cwd(), 'public', 'images', 'posts', `${today}-${slug}`);
const heroPath = path.join(heroDir, 'hero.jpg');
const placeholder = path.join(process.cwd(), 'src', 'assets', 'blog-placeholder-2.jpg');

const content = `---
title: "${title}"
description: "${description}"
pubDate: ${today}
updatedDate: ${today}
category: ["${category}"]
tags: [${tags.map((tag) => `"${tag}"`).join(', ')}]
draft: true
heroImage:
  src: "/images/posts/${today}-${slug}/hero.jpg"
  alt: "${title} 대표 이미지"
seo:
  canonical: "https://ship-write.com/blog/${today}-${slug}"
  ogTitle: "${title}"
  ogDescription: "${description}"
---

## 개요

이 글은 자동 생성된 초안입니다. 사실 확인 및 보강 후 발행하세요.

## 핵심 포인트

- 포인트 1
- 포인트 2
- 포인트 3

## 참고 링크

- 출처 링크를 추가하세요.
`;

await fs.mkdir(postDir, { recursive: true });
await fs.writeFile(postPath, content, 'utf-8');

await fs.mkdir(heroDir, { recursive: true });
try {
	await fs.copyFile(placeholder, heroPath);
} catch (error) {
	console.warn('대표 이미지 복사 실패:', error);
}

console.log(`생성 완료: ${path.relative(process.cwd(), postPath)}`);
