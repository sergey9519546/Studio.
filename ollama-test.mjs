import ollama from "ollama";

const response = await ollama.chat({
  model: "gpt-oss:120b-cloud",
  messages: [{ role: "user", content: "Why is the sky blue?" }],
});
console.log(response.message.content);
