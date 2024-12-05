import { AbortError } from "p-retry";

export async function jsonFetcher(url) {
    const response = await fetch(url);
    // Abort retrying if the resource doesn't exist
    if (response.status === 404) throw new AbortError(response.statusText);
    if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
    return await response.json();
}