import { device, element, by } from 'detox';
import {
  initializeMention,
  typeMention,
  typeAndSelectMention,
  getTextInputText,
} from './utility';

const jestExpect = require('expect');

// const waitToNavigate = (duration: number) => new Promise<void>(resolve => setTimeout(() => resolve(), duration));

describe('Mentions Test', () => {
  // TODO - only on every test
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('mention: add and remove mention deleting last char', async () => {
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

  it('mention: add some text before mention', async () => {
    let mentioned = [];
    const inputTextInital = await initializeMention('some textreallylong');

    await element(by.id('mention-input-text')).replaceText(
      inputTextInital.slice(0, 5) + 'other text ' + inputTextInital.slice(5)
    );

    await element(by.id('mention-input-text')).typeText(' end line');

    mentioned = JSON.parse(
      ((await element(by.id('mention-check-value')).getAttributes()) as any)
        .label
    );

    jestExpect(mentioned.length).toBe(1);
    jestExpect(mentioned[0].position).toBe(
      'some other text textreallylong '.length
    );
  });

  it('mention: delete some text before mention', async () => {
    let mentioned = [];
    const inputTextInital = await initializeMention('hello');

    await element(by.id('mention-input-text')).replaceText(
      inputTextInital.slice(0, 1) + inputTextInital.slice(4)
    );

    await element(by.id('mention-input-text')).typeText(' end line');

    mentioned = JSON.parse(
      ((await element(by.id('mention-check-value')).getAttributes()) as any)
        .label
    );

    jestExpect(mentioned.length).toBe(1);
    jestExpect(mentioned[0].position).toBe('ho '.length);
  });

  it('mention: delete end line near search mention', async () => {
    // let mentioned = [];
    const inputTextInital = await initializeMention('hello \n new line \n \n');

    const lines = inputTextInital.split('\n');

    await element(by.id('mention-input-text')).replaceText(
      'hello \n new line \n' + lines[lines.length - 1]
    );

    await element(by.id('mention-input-text')).typeText(' end line');

    const mentioned = JSON.parse(
      ((await element(by.id('mention-check-value')).getAttributes()) as any)
        .label
    );

    jestExpect(mentioned.length).toBe(1);
  });

  it('mention: add end line near search mention', async () => {
    // let mentioned = [];
    const inputTextInital = await initializeMention('hello \n new line \n');

    const lines = inputTextInital.split('\n');

    await element(by.id('mention-input-text')).replaceText(
      'hello \n new line \n \n' + lines[lines.length - 1]
    );

    await element(by.id('mention-input-text')).typeText(' end line');

    const mentioned = JSON.parse(
      ((await element(by.id('mention-check-value')).getAttributes()) as any)
        .label
    );

    jestExpect(mentioned.length).toBe(1);
  });

  it('mention: add mention from button', async () => {
    await element(by.id('mention-input-text')).typeText('hello ');

    await element(by.id('mention-button')).tap();
    await element(by.label('users')).tap();

    await typeAndSelectMention();

    await element(by.id('mention-input-text')).typeText(' end line');
  });

  it('mention: replace a part of text before mention', async () => {
    let mentioned = [];
    await initializeMention('some text');
    await element(by.id('mention-input-text')).typeText(' other');

    const currentText = await getTextInputText();

    mentioned = JSON.parse(
      ((await element(by.id('mention-check-value')).getAttributes()) as any)
        .label
    );

    jestExpect(mentioned.length).toBe(1);

    await element(by.id('mention-input-text')).replaceText(
      'some new casual text ' + currentText.slice(10)
    );

    await element(by.id('mention-input-text')).typeText(' end line');

    mentioned = JSON.parse(
      ((await element(by.id('mention-check-value')).getAttributes()) as any)
        .label
    );

    jestExpect(mentioned.length).toBe(1);
    jestExpect(mentioned[0].position).toBe('some new casual text '.length);
  });

  it('search mention: check if exists', async () => {
    await element(by.id('mention-input-text')).typeText('hello ');

    await element(by.id('mention-button')).tap();
    await element(by.label('users')).tap();

    await typeMention();

    let searchMention = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(searchMention.length).toBe(1);
    jestExpect(searchMention[0].start).toBe(6);
    jestExpect(searchMention[0].pauseAt).toEqual(undefined);

    await element(by.id('mention-input-text')).typeText(
      ' other text to close selection '
    );

    searchMention = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(searchMention.length).toBe(1);
    jestExpect(searchMention[0].pauseAt).not.toBeNull();

    await element(by.id('mention-button')).tap();
    await element(by.label('users')).tap();

    await typeMention();

    searchMention = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(searchMention.length).toBe(2);
  });

  it('search mention: delete 1 char before searching', async () => {
    await element(by.id('mention-input-text')).typeText('hello ');

    await element(by.id('mention-button')).tap();
    await element(by.label('users')).tap();

    const inputTextValue = await typeMention();

    let searchMention = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(searchMention.length).toBe(1);
    jestExpect(searchMention[0].start).toBe(6);
    jestExpect(searchMention[0].pauseAt).toEqual(undefined);

    await element(by.id('mention-input-text')).replaceText(
      inputTextValue.slice(0, 1) + inputTextValue.slice(2)
    );

    searchMention = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(searchMention.length).toBe(1);
    jestExpect(searchMention[0].start).toBe(5);
    jestExpect(searchMention[0].pauseAt).not.toBeNull();
  });

  it('search mention: delete some chars before searching', async () => {
    await element(by.id('mention-input-text')).typeText('hello ');

    await element(by.id('mention-button')).tap();
    await element(by.label('users')).tap();

    const inputTextValue = await typeMention();

    let searchMention = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(searchMention.length).toBe(1);
    jestExpect(searchMention[0].start).toBe(6);
    jestExpect(searchMention[0].pauseAt).toEqual(undefined);

    await element(by.id('mention-input-text')).replaceText(
      inputTextValue.slice(0, 1) + inputTextValue.slice(3)
    );

    searchMention = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(searchMention.length).toBe(1);
    jestExpect(searchMention[0].start).toBe(4);
    jestExpect(searchMention[0].pauseAt).not.toBeNull();
  });

  it('search mention: delete end line far to search mention', async () => {
    await element(by.id('mention-input-text')).typeText(
      'hello \n new line \n \n'
    );

    await element(by.id('mention-button')).tap();
    await element(by.label('users')).tap();

    const inputTextValue = await typeMention();

    const lines = inputTextValue.split('\n');

    await element(by.id('mention-input-text')).replaceText(
      'hello new line \n \n' + lines[lines.length - 1]
    );

    const searchMention = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(searchMention.length).toBe(1);
    jestExpect(searchMention[0].start).toBe('hello new line \n \n'.length);
  });

  it('search mention: add end line far to search mention', async () => {
    await element(by.id('mention-input-text')).typeText('hello \n new line \n');

    await element(by.id('mention-button')).tap();
    await element(by.label('users')).tap();

    const inputTextValue = await typeMention();

    const lines = inputTextValue.split('\n');

    await element(by.id('mention-input-text')).replaceText(
      'hello \n \n new line \n' + lines[lines.length - 1]
    );

    const searchMention = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(searchMention.length).toBe(1);
    jestExpect(searchMention[0].start).toBe('hello \n \n new line \n'.length);
  });

  it('mention: cut and paste a part of text before mention', async () => {
    let mentioned = [];
    await initializeMention('some textreallylong');

    await element(by.id('mention-input-text')).tap({ x: 35, y: 5 });
    await element(by.id('mention-input-text')).multiTap(2);
    await element(by.label('Cut')).atIndex(0).tap();
    await element(by.id('mention-input-text')).multiTap(2);
    await element(by.label('Paste')).atIndex(0).tap();

    mentioned = JSON.parse(
      ((await element(by.id('mention-check-value')).getAttributes()) as any)
        .label
    );

    jestExpect(mentioned.length).toBe(1);
  });

  /**
   * TO FIX
   */

  it('search mention: delete end line near search mention', async () => {
    await element(by.id('mention-input-text')).typeText(
      'hello \n new line \n \n'
    );

    await element(by.id('mention-button')).tap();
    await element(by.label('users')).tap();

    const inputTextValue = await typeMention();

    const lines = inputTextValue.split('\n');

    await element(by.id('mention-input-text')).replaceText(
      'hello \n new line \n' + lines[lines.length - 1]
    );

    const searchMention = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(searchMention.length).toBe(1);
  });

  it('search mention: add end line near search mention', async () => {
    await element(by.id('mention-input-text')).typeText('hello \n new line \n');

    await element(by.id('mention-button')).tap();
    await element(by.label('users')).tap();

    const inputTextValue = await typeMention();

    const lines = inputTextValue.split('\n');

    await element(by.id('mention-input-text')).replaceText(
      'hello \n new line \n \n' + lines[lines.length - 1]
    );

    const searchMention = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(searchMention.length).toBe(1);
  });

  it('search mention: cut and paste a part of text before search mention', async () => {
    let mentioned = [];
    await element(by.id('mention-input-text')).typeText(
      'hi alex, do you know '
    );

    await element(by.id('mention-button')).tap();
    await element(by.label('users')).tap();

    await typeMention();

    await element(by.id('mention-input-text')).tap({ x: 50, y: 5 });
    await element(by.id('mention-input-text')).multiTap(2);
    await element(by.label('Cut')).atIndex(0).tap();
    await element(by.id('mention-input-text')).multiTap(2);
    await element(by.label('Paste')).atIndex(0).tap();

    mentioned = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(mentioned.length).toBe(1);
    jestExpect(mentioned[0].start).toBe('hi do you know '.length);
  });

  it('search mention: cut and paste direct part before search mention', async () => {
    let mentioned = [];
    await element(by.id('mention-input-text')).typeText(
      'hi alex, do you know '
    );

    await element(by.id('mention-button')).tap();
    await element(by.label('users')).tap();

    await typeMention();

    await element(by.id('mention-input-text')).tap({ x: 120, y: 5 });
    await element(by.id('mention-input-text')).multiTap(2);
    await element(by.label('Cut')).atIndex(0).tap();
    await element(by.id('mention-input-text')).multiTap(2);
    await element(by.label('Paste')).atIndex(0).tap();

    mentioned = JSON.parse(
      (
        (await element(
          by.id('search-mention-check-value')
        ).getAttributes()) as any
      ).label
    );

    jestExpect(mentioned.length).toBe(1);
  });
});
