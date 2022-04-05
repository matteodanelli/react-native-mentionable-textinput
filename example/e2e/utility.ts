import { expect, element, by } from 'detox';
const jestExpect = require('expect');

const initializeMention = async (textBefore: string) => {
  await expect(element(by.id('label-intro'))).toExist();
  await element(by.id('mention-input-text')).typeText(`${textBefore} @`);

  await expect(element(by.id('mention-item-0-text'))).toExist();

  const firstElementText = (
    (await element(by.id('mention-item-0-text')).getAttributes()) as any
  ).text;
  await element(by.id('mention-input-text')).typeText(
    firstElementText.slice(0, 4)
  );
  await element(by.id('mention-item-0-text')).tap();

  const mentioned = JSON.parse(
    ((await element(by.id('mention-check-value')).getAttributes()) as any).label
  );

  jestExpect(mentioned.length).toBe(1);
  jestExpect(mentioned[0].position).toBe(`${textBefore} `.length);
  jestExpect(mentioned[0].label).toBe(`@${firstElementText}`);

  return `${textBefore} @${firstElementText}`;
};

const typeAndSelectMention = async () => {
  await expect(element(by.id('mention-item-0-text'))).toExist();

  const oldMentioned = JSON.parse(
    ((await element(by.id('mention-check-value')).getAttributes()) as any).label
  );

  await expect(element(by.id('label-intro'))).toExist();

  const firstElementText = (
    (await element(by.id('mention-item-0-text')).getAttributes()) as any
  ).text;
  await element(by.id('mention-input-text')).typeText(
    firstElementText.slice(0, 4)
  );
  await element(by.id('mention-item-0-text')).tap();

  const newMentioned = JSON.parse(
    ((await element(by.id('mention-check-value')).getAttributes()) as any).label
  );

  jestExpect(newMentioned.length).toBe(oldMentioned.length + 1);

  return getTextInputText();
};

const typeMention = async () => {
  await expect(element(by.id('mention-item-0-text'))).toExist();

  const firstElementText = (
    (await element(by.id('mention-item-0-text')).getAttributes()) as any
  ).text;
  await element(by.id('mention-input-text')).typeText(
    firstElementText.slice(0, 4)
  );

  return getTextInputText();
};

const getTextInputText = async () => {
  const text = (
    (await element(by.id('mention-input-text')).getAttributes()) as any
  ).text;

  return text;
};

export {
  initializeMention,
  typeAndSelectMention,
  getTextInputText,
  typeMention,
};
