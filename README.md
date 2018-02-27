# scratch-gui
#### Scratch GUI is a set of React components that comprise the interface for creating and running Scratch 3.0 projects

## Installation
This requires you to have Git and Node.js installed.

In your own node environment/application:
```bash
npm install https://github.com/LLK/scratch-gui.git
```
If you want to edit/play yourself:
```bash
git clone git@github.com:LLK/scratch-gui.git
cd scratch-gui
npm install
```

## Getting started
Running the project requires Node.js to be installed.

## Running
Open a Command Prompt or Terminal in the repository and run:
```bash
npm start
```
Then go to [http://localhost:8601/](http://localhost:8601/) - the playground outputs the default GUI component

## Testing
NOTE: If you're a windows user, please run these scripts in Windows `cmd.exe`  instead of Git Bash/MINGW64.

Run linter, unit tests, build, and integration tests.
```bash
npm test
```

Run unit tests in isolation.
```bash
npm run unit-test
```

Run unit tests in watch mode (watches for code changes and continuously runs tests). See [jest cli docs](https://facebook.github.io/jest/docs/en/cli.html#content) for more options.
```bash
npm run unit-test -- --watch
```

Run integration tests in isolation.
```bash
npm run integration-test
```

You may want to review the documentation for [Jest](https://facebook.github.io/jest/docs/en/api.html) and [Enzyme](http://airbnb.io/enzyme/docs/api/) as you write your tests.

## Ultrabear Part

To compress js file. set node env to production:

```
$ export NODE_ENV=production

```


