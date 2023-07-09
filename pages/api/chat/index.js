import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

export default async function requestHandler(req, res) {
  const { prompt } = req.body;

  const model = new ChatOpenAI({
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          res.write(token);
        },
      },
    ],
  });
  const humanMessage = new HumanMessage(prompt);
  await model.call([humanMessage]);
  res.end();
}
