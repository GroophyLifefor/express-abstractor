import expressAbstractor, { log } from './lib/express';
const app = expressAbstractor();
const port = 3000;

app.use((_req, _res, next) => {
  log(`1th Middleware`);
  next();
});

app.use('test', (_req, _res, next) => {
  log(`2nd Middleware which named`);
  next();
});

app.get('/', (_req, res) => {
  log(`handler console log`, {
    meta: 'test',
  });
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
