import { device, element, by } from 'detox';
import { initializeMention } from './utility';

const jestExpect = require('expect');

// const waitToNavigate = (duration: number) => new Promise<void>(resolve => setTimeout(() => resolve(), duration));

describe('Login', () => {
  // TODO - only on every test
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('mention: add and remove mention deliting last char', async () => {
    let mentioned = [];
    await initializeMention('some textreallylong');
    await element(by.id('mention-input-text')).typeText(' other text');

    for (let i = 0; i < ' other text '.length; i++) {
      await element(by.id('mention-input-text')).tapBackspaceKey();
    }

    mentioned = JSON.parse(
      ((await element(by.id('mention-check-value')).getAttributes()) as any)
        .label
    );
    jestExpect(mentioned.length).toBe(0);
  });

  it('mention: delete some text before mention', async () => {
    let mentioned = [];
    await initializeMention('some textreallylong');

    await element(by.id('mention-input-text')).tap({ x: 35, y: 5 });
    await element(by.id('mention-input-text')).multiTap(2);
    await element(by.label('Cut')).atIndex(0).tap();

    mentioned = JSON.parse(
      ((await element(by.id('mention-check-value')).getAttributes()) as any)
        .label
    );

    jestExpect(mentioned.length).toBe(1);
    jestExpect(mentioned[0].position).toBe('some '.length);
  });

  it('mention: add some text before mention', async () => {
    let mentioned = [];
    await initializeMention('some textreallylong');

    await element(by.id('mention-input-text')).tap({ x: 35, y: 5 });
    await element(by.label('e')).atIndex(0).multiTap(5);
    await element(by.label('m')).atIndex(0).tap({ x: 50, y: 0 });

    mentioned = JSON.parse(
      ((await element(by.id('mention-check-value')).getAttributes()) as any)
        .label
    );

    jestExpect(mentioned.length).toBe(1);
    jestExpect(mentioned[0].position).toBe('some textreallylong '.length + 5);
  });
});
