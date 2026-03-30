import { useState, useEffect } from 'react';

const GITHUB_USERNAME = 'chinmayaranjanswain';

export function useGithubStats() {
  const [stats, setStats] = useState({ repos: 11, followers: 1, following: 4 });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!res.ok) return;
        const user = await res.json();
        setStats({
          repos: user.public_repos,
          followers: user.followers,
          following: user.following,
        });
      } catch (e) {
        console.log('GitHub stats fetch failed');
      }
    })();
  }, []);

  return stats;
}

export function useGithubRepos() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`
        );
        if (!res.ok) return;
        const data = await res.json();
        const filtered = data
          .filter((r) => r.name !== GITHUB_USERNAME)
          .slice(0, 6);
        setRepos(filtered);
      } catch (e) {
        console.log('GitHub repos fetch failed');
      }
    })();
  }, []);

  return repos;
}

export function useGithubContributions() {
  const [contributions, setContributions] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`
        );
        if (!res.ok) return;
        const events = await res.json();
        const dayContributions = {};
        events.forEach((event) => {
          if (
            ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'PullRequestReviewEvent'].includes(
              event.type
            )
          ) {
            const date = event.created_at.split('T')[0];
            dayContributions[date] = (dayContributions[date] || 0) + 1;
          }
        });
        setContributions(dayContributions);
      } catch (e) {
        console.log('GitHub events fetch failed');
      }
    })();
  }, []);

  return contributions;
}

export function useProjectDetail(repoName) {
  const [project, setProject] = useState(null);
  const [languages, setLanguages] = useState({});
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!repoName) {
      setError('No project specified');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`
        );
        if (!res.ok) {
          setError('Project Not Found');
          setLoading(false);
          return;
        }
        const repo = await res.json();
        setProject(repo);

        // Fetch languages
        try {
          const langRes = await fetch(repo.languages_url);
          if (langRes.ok) {
            setLanguages(await langRes.json());
          }
        } catch (e) { /* ignore */ }

        // Fetch README
        try {
          const readmeRes = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`,
            { headers: { Accept: 'application/vnd.github.v3.raw' } }
          );
          if (readmeRes.ok) {
            setReadme(await readmeRes.text());
          }
        } catch (e) { /* ignore */ }

        setLoading(false);
      } catch (e) {
        setError('Error Loading Project');
        setLoading(false);
      }
    })();
  }, [repoName]);

  return { project, languages, readme, loading, error };
}
