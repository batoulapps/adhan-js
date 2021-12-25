module.exports = { 
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => message.startsWith('chore(release)')],
  rules: {
    'footer-max-line-length': [0],
  }
}