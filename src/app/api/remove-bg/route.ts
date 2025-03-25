// src/app/api/remove-bg/route.ts

export async function POST(req: Request) {
    const { imageUrl } = await req.json();
  
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Imagem inválida" }), { status: 400 });
    }
  
    try {
      const formData = new FormData();
      formData.append("image_url", imageUrl);
      formData.append("size", "auto");
  
      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": "pzBR4678vASxpLWeQMC4zes2",
        },
        body: formData,
      });
  
      if (!res.ok) {
        const err = await res.text();
        console.error("Erro remove.bg", err);
        return new Response(JSON.stringify({ error: "Erro ao remover fundo" }), { status: res.status });
      }
  
      const arrayBuffer = await res.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString("base64");
  
      return new Response(
        JSON.stringify({ image: `data:image/png;base64,${base64Image}` }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Erro geral:", error);
      return new Response(JSON.stringify({ error: "Erro interno" }), { status: 500 });
    }
  }
  