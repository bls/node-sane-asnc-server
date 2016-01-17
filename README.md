# @sane/promisify-listen

Promisify network server listen & close.

Install
-------

```bash
npm install @sane/promisify-listen --save
```

Example
-------

```javascript
import { promisifyListen } from '@sane/promisify-listen';

let s = promisifyListen(http.createServer(...));
s.listenAsync(31337).then(() => {
    // ...
});
```

Release
-------

1. Bump up the version number in package.json
1. Add a section for the new release in CHANGELOG.md
1. Run npm run-script compile to ensure it builds
1. Commit
1. Run npm publish
1. Create a git tag for the new release and push it
