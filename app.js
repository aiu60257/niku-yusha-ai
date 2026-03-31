async function generateTweet(){

  const extra = document.getElementById("extra").value;

  const world = await fetch("data/world.json").then(r=>r.json());
  const characters = await fetch("data/characters.json").then(r=>r.json());
  const story = await fetch("data/story.json").then(r=>r.json());
  const foreshadow = await fetch("data/foreshadow.json").then(r=>r.json());

  const prompt = `
【世界観】
${JSON.stringify(world)}

【キャラ】
${JSON.stringify(characters)}

【ストーリー】
${JSON.stringify(story)}

【伏線】
${JSON.stringify(foreshadow)}

【追加指示】
${extra}

条件：
・100文字以内
・改行あり
・一人称「私」
・シュール＋哲学＋少し笑える
・最後にオチ
`;

  const res = await fetch("https://niku-yusha-ai-git-main-aiu602572-2922s-projects.vercel.app/api/generate",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({prompt})
  });

  const data = await res.json();

  document.getElementById("result").innerText = data.text;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
