import { expect, element, by } from 'detox';
const jestExpect = require('expect');

const initializeMention = async (textBefore: string) => {
  let mentioned = [];
  await expect(element(by.id('label-intro'))).toExist();
  await element(by.id('mention-input-text')).typeText(`${textBefore} @`);

  await expect(element(by.label('e'))).toExist();

  const firstElementText = (
    (await element(by.id('mention-item-0-text')).getAttributes()) as any
  ).text;
  await element(by.id('mention-input-text')).typeText(
    firstElementText.slice(0, 4)
  );
  await element(by.id('mention-item-0-text')).tap();

  mentioned = JSON.parse(
    ((await element(by.id('mention-check-value')).getAttributes()) as any).label
  );

  jestExpect(mentioned.length).toBe(1);
  jestExpect(mentioned[0].position).toBe(`${textBefore} `.length);
  jestExpect(mentioned[0].label).toBe(`@${firstElementText}`);
};

export { initializeMention };
