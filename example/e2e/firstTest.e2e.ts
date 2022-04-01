import { device, expect, element, by } from 'detox';

// const waitToNavigate = (duration: number) => new Promise<void>(resolve => setTimeout(() => resolve(), duration));

describe('Login', () => {
  // TODO - only on every test
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('mention exist', async () => {
    await expect(element(by.id('label-intro'))).toExist();
    await expect(element(by.id('mention-component'))).toExist();
  });
});
