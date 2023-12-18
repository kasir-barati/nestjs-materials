# Current situation

run `pnpm test:integration`

```cmd
Error: Jest: Failed to parse the TypeScript config file /home/kasir/projects/nestjs-materials/typeorm/jest-integration.config.ts
  Error: Jest: 'ts-node' is required for the TypeScript configuration files. Make sure it is installed
Error: Cannot find package 'ts-node' imported from /home/kasir/.local/share/pnpm/store/v3/tmp/dlx-32378/node_modules/.pnpm/jest-config@29.7.0_@types+node@20.10.4/node_modules/jest-config/build/readConfigFileAndSetRootDir.js
    at readConfigFileAndSetRootDir (/home/kasir/.local/share/pnpm/store/v3/tmp/dlx-32378/node_modules/.pnpm/jest-config@29.7.0_@types+node@20.10.4/node_modules/jest-config/build/readConfigFileAndSetRootDir.js:116:13)
    at async readInitialOptions (/home/kasir/.local/share/pnpm/store/v3/tmp/dlx-32378/node_modules/.pnpm/jest-config@29.7.0_@types+node@20.10.4/node_modules/jest-config/build/index.js:392:15)
    at async readConfig (/home/kasir/.local/share/pnpm/store/v3/tmp/dlx-32378/node_modules/.pnpm/jest-config@29.7.0_@types+node@20.10.4/node_modules/jest-config/build/index.js:147:48)
    at async readConfigs (/home/kasir/.local/share/pnpm/store/v3/tmp/dlx-32378/node_modules/.pnpm/jest-config@29.7.0_@types+node@20.10.4/node_modules/jest-config/build/index.js:424:26)
    at async runCLI (/home/kasir/.local/share/pnpm/store/v3/tmp/dlx-32378/node_modules/.pnpm/@jest+core@29.7.0/node_modules/@jest/core/build/cli/index.js:151:59)
    at async Object.run (/home/kasir/.local/share/pnpm/store/v3/tmp/dlx-32378/node_modules/.pnpm/jest-cli@29.7.0/node_modules/jest-cli/build/run.js:130:37)
 ELIFECYCLE  Command failed with exit code 1.
```

# [Use pnpm fetch after this issue was resolved](https://github.com/pnpm/pnpm/issues/7434)
