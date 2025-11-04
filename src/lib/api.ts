export const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchHello() {
  const response = await fetch(`${API_BASE_URL}/hello/`);
  if (!response.ok) {
    throw new Error("Failed to fetch data from Django API");
  }
  return response.json();
}
