// src/app/api/freepik-search/route.ts

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term");

  try {
    const res = await fetch(`https://api.freepik.com/v1/resources?term=${encodeURIComponent(term || "")}&filters[psd][type]=psd&limit=10`, {
      headers: { "x-freepik-api-key": "FPSXea6fafabc1d24eb8b57de00f83ce46f7" },
    });

    if (!res.ok) {
      const error = await res.text();
      return new Response(JSON.stringify({ error }), { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Falha ao buscar imagens" }), { status: 500 });
  }
}
