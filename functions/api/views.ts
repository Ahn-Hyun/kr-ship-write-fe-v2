type KVLike = {
	get: (key: string) => Promise<string | null>;
	put: (key: string, value: string) => Promise<void>;
};

type Env = {
	VIEW_COUNTERS?: KVLike;
};

const json = (data: unknown, init: ResponseInit = {}) => {
	return new Response(JSON.stringify(data), {
		...init,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'no-store',
			...(init.headers ?? {}),
		},
	});
};

const normalizeSlug = (value: string) => {
	return value.trim().replace(/^\/+/, '').replace(/\/+$/, '');
};

export async function onRequest({ request, env }: { request: Request; env: Env }) {
	if (request.method !== 'GET' && request.method !== 'POST') {
		return json({ error: 'Method not allowed' }, { status: 405 });
	}

	const url = new URL(request.url);
	const slugParam = url.searchParams.get('slug');
	if (!slugParam) {
		return json({ error: 'Missing slug' }, { status: 400 });
	}

	const slug = normalizeSlug(slugParam);
	if (!slug) {
		return json({ error: 'Invalid slug' }, { status: 400 });
	}

	const counters = env?.VIEW_COUNTERS;
	if (!counters) {
		return json({ error: 'Missing VIEW_COUNTERS binding' }, { status: 500 });
	}

	const key = `blog:${slug}`;
	const shouldIncrement = request.method === 'POST' || url.searchParams.get('increment') === '1';
	let count = 0;

	const current = await counters.get(key);
	const parsed = Number.parseInt(current ?? '0', 10);
	count = Number.isNaN(parsed) ? 0 : parsed;

	if (shouldIncrement) {
		count += 1;
		await counters.put(key, String(count));
	}

	return json({ slug, views: count });
}
