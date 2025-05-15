/*md
Logging utility functions for structured logging with tags and metadata.

Example usage:
```javascript
logWithTags('MyTag', { userId: '123', action: 'login' });

console.log('Some other log message');
log('hi')

endLogWithTags('MyTag', { took: '100ms' });
```

Output:
```
<MyTag %1>                     userId="123" action="login"
    Some other log message
    <log>
        hi
    </log>
</MyTag %1>                    took="100ms"
```
*/
const logWithTags = (
  tag: string,
  meta?: Record<string, string>,
  group: boolean = true
) => {
  const metaAttributes = meta
    ? Object.entries(meta)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')
    : '';

  const openingTag =
    `<${tag}${metaAttributes ? ' %1' : ''}>`.padEnd(40) +
    (metaAttributes ? metaAttributes : '');
  if (group) {
    console.group(openingTag);
  } else {
    console.log(openingTag);
  }
};

const endLogWithTags = (tag: string, meta?: Record<string, string>) => {
  const metaAttributes = meta
    ? Object.entries(meta)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')
    : '';
  console.groupEnd();
  console.log(
    `</${tag}${metaAttributes ? ' %1' : ''}>`.padEnd(40) +
      (metaAttributes ? metaAttributes : '')
  );
};

export { logWithTags, endLogWithTags };
