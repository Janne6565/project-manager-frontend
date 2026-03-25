export function extractRepoName(url: string): string {
  try {
    const parts = url.replace("https://github.com/", "").split("/");
    return parts.slice(0, 2).join("/");
  } catch {
    return url;
  }
}
