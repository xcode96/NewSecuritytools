import type { GitHubSettings, Tool } from '../types';

export const publishToGitHub = async (
    settings: GitHubSettings,
    tools: Tool[],
    commitMessage: string
): Promise<{ success: boolean; error: string | null }> => {
    const { owner, repo, pat, path } = settings;
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`;

    // 1. Prepare content
    const content = JSON.stringify(tools, null, 2);
    // Correctly handle UTF-8 characters before Base64 encoding
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    // 2. Get current file SHA to perform an update
    let currentSha: string | undefined;
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${pat}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });
        if (response.ok) {
            const fileData = await response.json();
            currentSha = fileData.sha;
        } else if (response.status !== 404) {
            return { success: false, error: `GitHub check failed: ${response.status} ${response.statusText}` };
        }
    } catch (error) {
        return { success: false, error: `Network error checking file: ${error instanceof Error ? error.message : "Unknown error"}` };
    }

    // 3. Create or update the file via PUT request
    try {
        const body = JSON.stringify({
            message: commitMessage,
            content: encodedContent,
            sha: currentSha,
        });

        const putResponse = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${pat}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body,
        });

        if (!putResponse.ok) {
            const errorData = await putResponse.json();
            throw new Error(`GitHub API Error: ${errorData.message || putResponse.statusText}`);
        }

        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred during publish." };
    }
};

export const fetchFromGitHub = async (settings: GitHubSettings): Promise<{ tools: Tool[] | null; error?: string }> => {
    const { owner, repo, pat, path } = settings;
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${pat}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const msg = `GitHub API fetch failed: ${response.status} ${response.statusText}`;
            console.warn(msg);
            return { tools: null, error: msg };
        }

        const data = await response.json();
        if (data.content && data.encoding === 'base64') {
            try {
                // Decode Base64 content (handling UTF-8)
                const jsonString = decodeURIComponent(escape(window.atob(data.content.replace(/\n/g, ""))));
                const tools = JSON.parse(jsonString);
                return { tools: Array.isArray(tools) ? tools : null, error: undefined };
            } catch (parseError) {
                return { tools: null, error: "Failed to decode/parse GitHub content." };
            }
        }
        return { tools: null, error: "Invalid content format from GitHub." };
    } catch (error) {
        console.error("Error fetching from GitHub API:", error);
        return { tools: null, error: error instanceof Error ? error.message : "Network error" };
    }
};