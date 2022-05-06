import { JsonToDataPipe } from './json-to-data.pipe';

describe('JsonToDataPipe', () => {
  it('create an instance', () => {
    const pipe = new JsonToDataPipe();
    expect(pipe).toBeTruthy();
  });
});
