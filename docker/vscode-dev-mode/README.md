# A Crude Debug Mode For a Dockerized NestJS App

> [!CAUTION]
>
> Why I say crude? Because you need to write debugger and cannot use breakpoints :/.

1. Create a `Dockerfile` as we did [here](./Dockerfile).

   https://github.com/kasir-barati/nestjs-materials/blob/5155bff1fca4fccb4e66bc19e8472c44b19b20e9/docker/vscode-dev-mode/Dockerfile#L1-L19

2. Create and expose `9229` port in your `compose` file, see [here](./compose.yml).

   https://github.com/kasir-barati/nestjs-materials/blob/5155bff1fca4fccb4e66bc19e8472c44b19b20e9/docker/vscode-dev-mode/compose.yml#L1-L12

3. Create [`launch.json`](../../.vscode/launch.json).

   https://github.com/kasir-barati/nestjs-materials/blob/5155bff1fca4fccb4e66bc19e8472c44b19b20e9/.vscode/launch.json#L1-L18
