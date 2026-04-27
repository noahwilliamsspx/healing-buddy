export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (url.pathname === '/chat' && request.method === 'POST') {
      const { messages } = await request.json();

      const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages,
        max_tokens: 600,
        temperature: 0.75,
      });

      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
