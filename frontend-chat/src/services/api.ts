
import config from '../config';


export async function sendMessage(message: string) {
  const res = await fetch(`${config.API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  return res.json();
}

export async function getHistory() {
  const res = await fetch(`${config.API_BASE_URL}/chat`);
  return res.json();
}
