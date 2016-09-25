import { execSync } from 'child_process';
import { expect } from 'chai';
import path from 'path';
import exactFormat from './exactFormat';


describe('Format', () => {
  const collected = execSync(`node ${path.normalize('./dist/collect.js')}`);
  const parsedJSONArray = JSON.parse(collected);

  it('should have expected properties', done => {
    expect(parsedJSONArray).to.be.an('array');

    // Filter out the 'path' property because this changes between environments
    expect(parsedJSONArray.map(e => ({
      end: e.end,
      type: e.type,
      loc: { start: e.loc.start, end: e.loc.end },
      message: e.message,
      start: e.start
    }))).to.eql(exactFormat);

    for (const e of parsedJSONArray) {
      if (e !== false) {
        expect(e.type).to.be.a('string');
        expect(e.path).to.be.a('string').that.includes(path.join(process.cwd(), 'test'));
        expect(e.path).to.be.a('string').that.includes('.example.js');
      }
    }

    done();
  });
});
