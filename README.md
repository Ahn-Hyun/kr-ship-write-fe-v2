# Shipwrite (Astro + Cloudflare Pages)

Shipwrite는 AI(LLM/RAG/GraphRAG/Agent/MCP/Infra) 중심의 기술 블로그를 정적 사이트로 운영하기 위한 프로젝트입니다.

## 주요 기능

- MDX 기반 글 작성 및 Frontmatter 스키마 검증
- 카테고리/태그별 글 목록 페이지
- SEO 기본 요소(OG/Canonical/RSS/robots.txt)
- PR 기반 자동 발행 파이프라인(워크플로우 초안 포함)

## 로컬 실행

```sh
npm install
npm run dev
```

## 콘텐츠 작성

`src/content/blog/*.mdx`에 글을 추가합니다.

Frontmatter 예시:

```yaml
---
title: "GraphRAG란 무엇이고 언제 쓰는가"
description: "Vector RAG와 GraphRAG의 차이, 장단점, 적용 패턴을 정리합니다."
pubDate: 2026-01-26
updatedDate: 2026-01-26
category: ["ai-rag"]
tags: ["GraphRAG", "RAG", "Knowledge Graph"]
draft: false
heroImage:
  src: "/images/posts/2026-01-26-what-is-graphrag/hero.jpg"
  alt: "GraphRAG 개념 다이어그램"
seo:
  canonical: "https://shipwrite.com/blog/2026-01-26-what-is-graphrag"
  ogTitle: "GraphRAG란 무엇이고 언제 쓰는가"
  ogDescription: "Vector RAG와 GraphRAG의 차이, 장단점, 적용 패턴"
---
```

## 환경 변수(자동화)

`.github/workflows/auto-post.yml`에서 사용하는 키:

- `OPENAI_API_KEY`
- `GITHUB_TOKEN` (기본 제공)

## 배포

Cloudflare Pages 설정:

- Build command: `npm run build`
- Output directory: `dist`
- Node: 18+
