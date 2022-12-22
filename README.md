HSD Heapdump
============

Dump heap via HTTP.

Exposes endpoint `/heapdump` for both `wallet` and `hsd`. Plugin can be used
with either or both. By default dumps in `prefix` of the process. You can use
option `--heapdump-dir` to change the default behaviour.

## Running
### Using NPM

  - install: `npm i -g hsd-heapdump`
  - Make sure global node_modules resolves hsd-heapdump
    - e.g. You could use `export NODE_PATH=/usr/lib/node_modules` (arch)
    - asdf example: ``export NODE_PATH="$NODE_PATH:`asdf where nodejs`/.npm/lib/node_modules"``
    - Basically, make sure `node -e 'require("hsd-heapdump")'` does not
      throw an error.
  - run: `hsd --plugins hsd-heapdump`

### Using git or path
  - Clone: `git clone https://github.com/nodech/hsd-heapdump`
  - `cd hsd-heapdump`
  - ``hsd --plugins `pwd` ``

