export type ZaiMessage = {
  role: "user" | "system" | "assistant";
  content: string;
};

export type ZaiRequest = {
  model: string;
  messages: ZaiMessage[];
};

export type ZaiChatCompletion = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ZaiMessage;
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

export async function callZaiChat(messages: ZaiMessage[]) {
  const body: ZaiRequest = {
    model: "glm-5",
    messages,
  };

  const response = await fetch("/api/zai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ZAI request failed (${response.status}): ${errorText}`);
  }

  return (await response.json()) as ZaiChatCompletion;
}
