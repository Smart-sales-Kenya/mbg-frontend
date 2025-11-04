export const API_BASE_URL = "https://smartsales.co.ke/api";

export async function fetchHello() {
  const response = await fetch(`${API_BASE_URL}/hello/`);
  if (!response.ok) {
    throw new Error("Failed to fetch data from Django API");
  }
  return response.json();
}
