import { API_BASE_URL } from './constants';

export const REPO_URL = 'https://codeberg.org/phranck/previous-admin';
export const REPO_API_URL = 'https://codeberg.org/api/v1/repos/phranck/previous-admin';

const CURRENT_VERSION_KEY = 'app_current_version';
const CURRENT_VERSION_TIMESTAMP_KEY = 'app_current_version_timestamp';
const VERSION_CACHE_DURATION = 1000 * 60 * 60;

export interface VersionInfo {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  releaseUrl: string | null;
  releaseNotes: string | null;
  currentReleaseNotes: string | null;
}

export async function getCurrentVersion(): Promise<string> {
  const cached = localStorage.getItem(CURRENT_VERSION_KEY);
  const timestamp = localStorage.getItem(CURRENT_VERSION_TIMESTAMP_KEY);

  if (cached && timestamp) {
    const age = Date.now() - parseInt(timestamp, 10);
    if (age < VERSION_CACHE_DURATION) {
      return cached;
    }
  }

  try {
    const response = await fetch(`${REPO_API_URL}/tags`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return cached || '1.0.0';
    }

    const tags = await response.json();

    if (!Array.isArray(tags) || tags.length === 0) {
      return cached || '1.0.0';
    }

    const latestTag = tags[0];
    const version = latestTag.name.replace(/^v/, '');

    localStorage.setItem(CURRENT_VERSION_KEY, version);
    localStorage.setItem(CURRENT_VERSION_TIMESTAMP_KEY, Date.now().toString());

    return version;
  } catch (error) {
    console.error('Error fetching current version:', error);
    return cached || '1.0.0';
  }
}

export async function checkForUpdates(): Promise<VersionInfo> {
  try {
    const [tagsResponse, currentVersion] = await Promise.all([
      fetch(`${REPO_API_URL}/tags`, {
        headers: {
          'Accept': 'application/json',
        },
      }),
      getCurrentVersion(),
    ]);

    if (!tagsResponse.ok) {
      throw new Error('Failed to fetch version info');
    }

    const tags = await tagsResponse.json();

    if (!Array.isArray(tags) || tags.length === 0) {
      return {
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        releaseUrl: null,
        releaseNotes: null,
        currentReleaseNotes: null,
      };
    }

    const latestTag = tags[0];
    const latestVersion = latestTag.name.replace(/^v/, '');
    const updateAvailable = compareVersions(latestVersion, currentVersion) > 0;

    const currentTag = tags.find((tag: any) => tag.name === `v${currentVersion}` || tag.name === currentVersion);

    let releaseNotes: string | null = null;
    if (latestTag.commit?.sha) {
      try {
        const commitResponse = await fetch(`${REPO_API_URL}/git/commits/${latestTag.commit.sha}`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (commitResponse.ok) {
          const commitData = await commitResponse.json();
          releaseNotes = commitData.message || null;
        }
      } catch (err) {
        console.error('Error fetching latest commit message:', err);
      }
    }

    let currentReleaseNotes: string | null = null;
    if (currentTag?.commit?.sha) {
      try {
        const commitResponse = await fetch(`${REPO_API_URL}/git/commits/${currentTag.commit.sha}`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (commitResponse.ok) {
          const commitData = await commitResponse.json();
          currentReleaseNotes = commitData.message || null;
        }
      } catch (err) {
        console.error('Error fetching current commit message:', err);
      }
    }

    return {
      currentVersion,
      latestVersion,
      updateAvailable,
      releaseUrl: `${REPO_URL}/releases/tag/${latestTag.name}`,
      releaseNotes,
      currentReleaseNotes,
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    const currentVersion = await getCurrentVersion();
    return {
      currentVersion,
      latestVersion: null,
      updateAvailable: false,
      releaseUrl: null,
      releaseNotes: null,
      currentReleaseNotes: null,
    };
  }
}

function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
}

export async function updateApplication(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Update failed');
    }

    await response.json();

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
}
