# Astro + Cloudflare Pages 기반 “AI 중심 애드센스 블로그” 개발 계획서
> 목적: **운영비 거의 0원(도메인 제외) + 자동 글/이미지 생성 + 애드센스 수익화**를 염두에 둔 기술 블로그를 구축한다.  
> 핵심 방향: **정적(Static) 블로그 + GitHub 기반 자동화(PR 검수) + SEO/AdSense 친화 구조**

- 작성일: 2026-01-26  
- 타겟 주제: **AI(LLM/RAG/GraphRAG/Agent/MCP/Voice/Infra)** 중심 + 추후 카테고리 확장 가능  
- 배포: **Cloudflare Pages** (GitHub 연동 자동 빌드/배포)

---

## 1. 프로젝트 목표

### 1.1 1차 목표 (MVP)
1) **애드센스 승인 가능한 블로그 형태**를 갖춘다.  
2) **글 작성 자동화(초안 생성)** + **이미지 자동 생성(대표 이미지)**를 넣는다.  
3) PR 기반 **검수 후 발행** 플로우로 “저품질/대량 생산 리스크”를 줄인다.  
4) SEO 기본기(사이트맵/robots/canonical/OG 이미지)를 갖춘다.

### 1.2 2차 목표 (확장)
- 카테고리 확장: AI 이외에도 **개발 삽질 로그 / DevOps / 템플릿 / 생산성 / 여행 등**으로 확장 가능
- 간단한 도구 페이지(계산기/변환기) 추가 (수익 및 체류시간 개선)
- 뉴스레터/구독(옵션) 추가

---

## 2. 운영/수익화 전략 (AdSense 염두)

### 2.1 승인/운영을 위한 필수 페이지
애드센스 승인을 위해 “정상 퍼블리셔 형태”를 갖추기 위해 아래를 고정 제공한다.

- `/about` : 블로그 소개 + 작성자/주제/목표
- `/contact` : 문의 폼 또는 이메일
- `/privacy` : 개인정보처리방침 (쿠키/광고/로그 정책 포함)
- `/terms` (선택) : 이용약관

> 주의: “자동 생성 글”만 있는 사이트는 승인/검색 노출이 불리할 수 있으므로, 초기에는 **핵심 수작업 글 10~20개**를 함께 구성한다.

### 2.2 광고 배치 기본 원칙
- 초기 광고는 **과하지 않게**: 본문 상단/중단/하단 중심
- 모바일 UX를 우선: 사이드바 광고는 PC에서만 고려
- 페이지 속도 유지: 이미지 최적화(WebP/AVIF) + lazy loading

---

## 3. 기술 스택

### 3.1 프론트/정적 사이트
- **Astro** (정적 블로그 최적)
- Markdown/MDX 기반 포스트 작성
- Tailwind CSS (선택)

### 3.2 배포/호스팅
- **Cloudflare Pages**
  - GitHub push → 자동 빌드/배포
  - PR Preview 배포 활용

### 3.3 콘텐츠 관리 (글/이미지 저장 방식)
- 포스트: GitHub 저장소 `src/content/blog/*.mdx`
- 이미지(대표 이미지/본문 이미지) 저장 방식은 2가지 옵션

#### 옵션 A) Git 저장소에 이미지 포함 (초기 추천, 비용 0원)
- `public/images/posts/<slug>/hero.webp`
- 장점: 간단, 비용 0원
- 단점: 레포 용량이 커질 수 있음 (이미지 많아지면 부담)

#### 옵션 B) Cloudflare R2에 이미지 업로드 (성장 후 추천)
- 이미지 URL을 R2로 관리
- 장점: 레포 가벼움, 이미지 자산 관리 쉬움
- 단점: 아주 소액이라도 비용 가능성, 초기 세팅 필요

> **결론**: MVP는 옵션 A로 시작 → 트래픽/글이 쌓이면 옵션 B로 전환.

---

## 4. 정보 구조(IA) 및 카테고리 설계

### 4.1 초기 카테고리 (AI 중심)
- `ai-llm` : LLM/프롬프트/툴링
- `ai-rag` : RAG/GraphRAG/VectorDB/Chunking
- `ai-agents` : Multi-agent, LangGraph, 워크플로우
- `ai-infra` : 배포, 서버, 비용, observability
- `ai-voice` : 음성 에이전트, LiveKit, ESP32, STT/TTS
- `ai-mcp` : MCP 서버, Tooling, 리소스/프롬프트

### 4.2 추후 확장 카테고리
- `devops` : Railway/Vercel/Cloudflare/Azure/GCP 등
- `productivity` : Notion/문서화/템플릿
- `templates` : 개발 정의서/요구사항/운영 문서 템플릿
- `travel` : (원하면) 여행 로그/체크리스트

> 카테고리는 “하드코딩” 대신 **frontmatter 기반**으로 확장 가능하게 설계한다.

---

## 5. 콘텐츠 모델 (MDX Frontmatter 표준)

### 5.1 포스트 파일 예시
경로:
- `src/content/blog/2026-01-26-what-is-graphrag.mdx`

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
  src: "/images/posts/2026-01-26-what-is-graphrag/hero.webp"
  alt: "GraphRAG concept illustration"
seo:
  canonical: "https://shipwrite.com/blog/what-is-graphrag"
  ogTitle: "GraphRAG란 무엇이고 언제 쓰는가"
  ogDescription: "Vector RAG와 GraphRAG의 차이, 장단점, 적용 패턴"
---
```

### 5.2 자동 생성 이미지(대표 이미지) 규칙
- 파일명: `hero.webp`
- 크기 권장: 1200x630 (OG/카드 이미지 표준)
- 스타일: “기술 블로그” 느낌의 **간결한 아이콘/다이어그램 스타일**
- 텍스트 삽입 최소화(또는 없음): 다양한 썸네일에서 깨지지 않게

---

## 6. 페이지 구성(필수 + 블로그 UX)

### 6.1 필수 페이지
- `/` : 홈 (최신 글/카테고리/추천 글)
- `/blog` : 글 목록 + 카테고리 필터
- `/blog/[slug]` : 글 상세
- `/about`, `/contact`, `/privacy`
- `/tags/[tag]`, `/category/[cat]`

### 6.2 SEO 필수 기능
- sitemap.xml 자동 생성
- robots.txt 제공
- canonical URL 설정
- Open Graph / Twitter Card 메타
- RSS (선택이지만 추천)

---

## 7. 자동화 설계 (AI 글 + 이미지 생성)

> 핵심: “완전 자동 발행”이 아니라 **PR 기반 검수**로 품질과 정책 리스크를 줄인다.

### 7.1 자동화 플로우(권장: PR 방식)
1) GitHub Actions 스케줄 실행 (예: 주 3회 또는 매일)
2) 주제 후보 생성 (키워드/아이디어)
3) 글 초안 생성(MDX + frontmatter)
4) 대표 이미지 생성(hero.webp)
5) 파일 저장:
   - `src/content/blog/<date>-<slug>.mdx`
   - `public/images/posts/<slug>/hero.webp`
6) Pull Request 생성 (새 글/이미지 포함)
7) 사람이 PR에서:
   - 사실 오류 / 과장 / 정책 위험 표현 수정
   - 내부링크/외부링크 추가
8) Merge → Cloudflare Pages 자동 배포

### 7.2 자동화 구현 방식
- GitHub Actions + Node/Python 스크립트
- Secrets:
  - `OPENAI_API_KEY` (글/이미지 생성)
  - (선택) `SERP_API_KEY` 또는 웹 리서치 키

### 7.3 글 생성 프롬프트 기본 설계 (권장 템플릿)
- “실전 경험/코드/트러블슈팅” 형태를 우선
- **너의 기존 관심사**를 반영한 주제 풀:
  - MCP 서버 개발, Tool 호출 구조
  - GraphRAG/HiRAG 구조, 평가 방법
  - Temporal 기반 orchestration(Shipwright)
  - LiveKit + ESP32 voice agent 구성/오류 해결
  - 문서 → 위키 변환/Notion-like 에디터 구조

### 7.4 이미지 생성 프롬프트 기본 설계
- 요청 예시(개념 이미지):
  - “Minimal tech diagram style, abstract nodes and edges, vector illustration, clean, no text, white background, 1200x630”
- 금지/주의:
  - 타인 얼굴/상표/저작권 캐릭터 사용 금지
  - 과도한 텍스트 삽입 지양

### 7.5 품질 게이트(자동 체크)
- 최소 글 길이(예: 1200~2000자 이상)
- 제목/슬러그 중복 방지
- “단정적 사실” 문장에 출처 링크/근거 포함 유도
- 너무 일반적인 글(양산형) 폐기

---

## 8. 프로젝트 폴더 구조(권장)

```
my-adsense-blog/
  ├─ src/
  │  ├─ content/
  │  │  ├─ blog/
  │  │  │  ├─ 2026-01-26-what-is-graphrag.mdx
  │  │  │  └─ ...
  │  ├─ pages/
  │  │  ├─ index.astro
  │  │  ├─ blog/
  │  │  ├─ about.astro
  │  │  ├─ contact.astro
  │  │  └─ privacy.astro
  │  ├─ components/
  │  ├─ layouts/
  │  └─ lib/
  ├─ public/
  │  ├─ images/
  │  │  ├─ posts/
  │  │  │  └─ 2026-01-26-what-is-graphrag/
  │  │  │     └─ hero.webp
  │  └─ robots.txt
  ├─ scripts/
  │  ├─ generate_post.ts
  │  ├─ generate_image.ts
  │  └─ quality_gate.ts
  ├─ .github/
  │  └─ workflows/
  │     └─ auto-post.yml
  ├─ astro.config.mjs
  ├─ package.json
  └─ README.md
```

---

## 9. Cloudflare Pages 세팅 항목

### 9.1 Pages 역할
- GitHub 저장소와 연결
- push/merge 시 자동 빌드/배포
- PR Preview URL 제공

### 9.2 Build 설정
- Build command: `npm run build`
- Output directory: `dist`
- Node 버전: 18+ 권장

---

## 10. 애드센스 통합 포인트

### 10.1 전역 스크립트 삽입
- 공통 레이아웃 `<head>`에 AdSense 스크립트 삽입
- 승인 전에는 광고 코드 삽입을 최소화(승인 이후 적용 권장)

### 10.2 광고 컴포넌트화
- `<AdSlot />` 컴포넌트를 만들어 포스트 레이아웃에 삽입
- 예: 상단/중단/하단

> 광고는 “UX를 해치지 않게”가 가장 중요. 초기엔 과배치 금지.

---

## 11. 초기 콘텐츠 로드맵(추천 20개)
> 너의 이전 대화/프로젝트 기반으로 “검색 유입 가능 + 실전형” 주제 위주

### MCP / Tooling
1) MCP 서버란 무엇이고 LLM이 Tool을 호출하는 방식
2) MCP 서버에서 Resource/Prompt/Tool 설계 패턴
3) MCP + Weather Tool 오류 디버깅 체크리스트

### RAG / GraphRAG
4) RAG vs GraphRAG: 언제 무엇을 쓰나
5) GraphRAG Chunking/Hierarchy 설계 가이드
6) HiRAG와 계층형 문서 구조를 함께 쓰는 방법
7) GraphRAG 평가(Eval) 설계: 정확도/회수율/근거

### 위키화/문서 자동화
8) PDF/DOCX → Markdown 변환 파이프라인 설계
9) Notion-like 에디터(Tiptap) 저장 구조 추천(JSON blocks)
10) 문서 위키화 플랫폼 설계(조직/보안등급)

### Agent / Orchestration
11) 멀티에이전트로 커리큘럼/문서 생성 흐름 만들기
12) Temporal로 AI 워크플로우 안정화하기(Shipwright)
13) n8n vs Temporal: 자동화에 뭐가 더 맞나

### Voice Agent / LiveKit
14) ESP32-S3 + LiveKit 브릿지 구조 이해
15) LiveKit 401 / ICE / TLS 문제 해결 가이드
16) 임베디드 음성 에이전트에서 STT/TTS 선택 기준

### DevOps / 배포 삽질
17) Railway Redis 연결 오류 원인 & 해결
18) Vercel 환경변수/프리뷰 배포 주의점
19) Cloudflare Pages로 정적 블로그 운영하는 법
20) 애드센스 승인 실패 케이스와 개선 체크리스트

---

## 12. 개발 단계별 마일스톤

### M1) MVP 블로그 런칭 (1~2일)
- Astro 프로젝트 생성
- 기본 레이아웃/글 목록/상세 페이지
- 카테고리/태그 페이지
- About/Contact/Privacy 페이지

### M2) SEO/속도 최적화 (1일)
- sitemap/robots/canonical/OG 적용
- 이미지 최적화 기본 적용(WebP)
- Lighthouse 점수 확인

### M3) 자동 글/이미지 생성 PR 파이프라인 (1~2일)
- GitHub Actions 스케줄
- 글 생성 스크립트
- 이미지 생성 스크립트
- PR 자동 생성 및 프리뷰 확인

### M4) 애드센스 신청 (콘텐츠 15~20개 확보 후)
- 최소 콘텐츠 확보
- 정책 페이지 점검
- 광고 최소 삽입

---

## 13. 리스크 및 대응

### 13.1 AI 글 대량 생성 리스크
- 리스크: 저품질/중복/얕은 글이 쌓이면 SEO/승인에 불리
- 대응: PR 검수 + 품질 게이트 + “실전 경험 기반 글” 우선

### 13.2 이미지 저작권/브랜딩 리스크
- 리스크: 상표/캐릭터/타인의 얼굴 포함 가능성
- 대응: “추상 다이어그램/아이콘 스타일”로 제한, 텍스트 최소화

### 13.3 레포 용량 증가
- 리스크: 이미지 많아지면 Git repo 비대
- 대응: 성장 시 Cloudflare R2 전환

---

## 14. 체크리스트 (런칭 전)

- [ ] 사이트 내비게이션(홈/블로그/카테고리/태그) 정상
- [ ] About/Contact/Privacy 페이지 존재
- [ ] sitemap.xml 생성
- [ ] robots.txt 설정
- [ ] OG/Twitter 카드 정상 표시
- [ ] 글 10~20개 준비
- [ ] 이미지 최적화(WebP) 적용
- [ ] 모바일 UI 점검
- [ ] PR 기반 자동화 파이프라인 동작 확인

---

## 15. 다음 작업(추천)
원하면 다음 산출물을 바로 이어서 제작할 수 있다.

1) **Astro 블로그 템플릿 코드 스캐폴딩(폴더 포함)**
2) **GitHub Actions(auto-post.yml) 실제 워크플로우**
3) 글 생성 스크립트(`generate_post.ts`) + 이미지 생성 스크립트(`generate_image.ts`)
4) 애드센스 삽입용 `<AdSlot />` 컴포넌트 템플릿
