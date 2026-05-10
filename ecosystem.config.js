module.exports = {
  "apps": [
    {
      "name": "hermes-web",
      "script": "server.js",
      "cwd": "/root/projects/onyx-web/.next/standalone",
      "env_file": "/root/projects/onyx-web/.env.local",
      "env": {
        "NODE_ENV": "production",
        "PORT": "3001",
        "DISCORD_CLIENT_ID": "1321426941059792956",
        "DISCORD_REDIRECT_URI": "https://ko4lax.dev/api/auth/discord/callback",
        "NEXT_PUBLIC_BASE_URL": "https://ko4lax.dev",
        "NEXT_PUBLIC_DASHBOARD_URL": "https://dashboard.ko4lax.dev",
        "DISCORD_CLIENT_SECRET": "G61uOF3TewM88dEs5jxAh-8j8WC9ZzPK"
      }
    }
  ]
};
