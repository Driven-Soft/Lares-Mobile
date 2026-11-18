const { execSync } = require('child_process');

function obterHashDoCommit() {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) {
    return process.env.EAS_BUILD_GIT_COMMIT_HASH.slice(0, 7);
  }

  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'indisponivel';
  }
}

module.exports = ({ config }) => ({
  ...config,
  extra: { ...config.extra, commitHash: obterHashDoCommit() },
});
