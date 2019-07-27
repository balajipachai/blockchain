    Running a Geth instance from a docker container

`docker run -it --rm -p 8501:8501 -p 8546:8546 0xorg/devnet`

_Reference:_

`https://github.com/0xProject/0x-monorepo/blob/development/packages/devnet/README.md`

Since we are runnig a geth instance inside a docker container, thus, our truffle.config.js file will have following changes

`1. host: 0.0.0.0`

`2. port: 8501`

`3. network_id: '*'`

~~~~
