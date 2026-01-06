import fetch from "node-fetch";

export default async function handler(req,res){
  try{
    const { prompt } = req.body;

    // API key hybrid di Vercel Environment Variable
    const apiKey = process.env.HYBRID_API_KEY;

    const response = await fetch("https://api.hybrid.com/v1/chat/completions", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model:"hybrid-model-v1",
        messages:[{role:"user",content:prompt}]
      })
    });

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || "AI tidak menjawab";

    // Filter keamanan
    const forbidden = /(nurut|ikut|anjing|bodoh|porno|sex|sange|tolong)/gi;
    if(forbidden.test(prompt)){
      reply="❌ Tolak perintah demi keamanan.";
    }

    res.status(200).json({reply});

  }catch(e){
    console.error(e);
    res.status(500).json({reply:"❌ Gagal koneksi Hybrid API"});
  }
}
