import { shiftSearchCursorIfNeeded } from '../helper';
import { SearchCursorPosition, Typing } from '../types';

describe('Search Mentions', () => {
  it('search mentions: add end line befor search', () => {
    const seachMention: SearchCursorPosition<string> = {
      start: 'Ciao\n'.length,
      end: 'Ciao\n@lan'.length,
      pauseAt: 'Ciao\n@lan'.length,
      type: 'users',
      uuid: 'c1bb372e-6cde-4f72-43b0-5874f0a59cca',
    };

    const cursor = { start: 'Ciao\n'.length, end: 'Ciao\n\n'.length };
    const oldText = 'Ciao\n@lan';
    const newText = 'Ciao\n\n@lan';

    const searchMentionPosition = shiftSearchCursorIfNeeded(
      cursor,
      seachMention,
      oldText,
      newText,
      Typing.addedText
    );

    expect(searchMentionPosition).not.toBe(undefined);
    expect(searchMentionPosition?.start).toBe('Ciao\n\n'.length);
    expect(searchMentionPosition?.end).toBe('Ciao\n\n@lan'.length);
  });

  it('search mentions: removed end line befor search', () => {
    const seachMention: SearchCursorPosition<string> = {
      start: 'Ciao\n\n'.length,
      end: 'Ciao\n\n@lan'.length,
      pauseAt: 'Ciao\n\n@lan'.length,
      type: 'users',
      uuid: 'c1bb372e-6cde-4f72-43b0-5874f0a59cca',
    };

    const cursor = { start: 'Ciao\n'.length, end: 'Ciao\n\n'.length };
    const oldText = 'Ciao\n\n@lan';
    const newText = 'Ciao\n@lan';

    const searchMentionPosition = shiftSearchCursorIfNeeded(
      cursor,
      seachMention,
      oldText,
      newText,
      Typing.deletedText
    );

    expect(searchMentionPosition).not.toBe(undefined);
    expect(searchMentionPosition?.start).toBe('Ciao\n'.length);
    expect(searchMentionPosition?.end).toBe('Ciao\n@lan'.length);
  });

  it('search mentions: removed search from key char', () => {
    const seachMention: SearchCursorPosition<string> = {
      start: 'Ciao '.length,
      end: 'Ciao @lan'.length,
      pauseAt: 'Ciao @lan'.length,
      type: 'users',
      uuid: 'c1bb372e-6cde-4f72-43b0-5874f0a59cca',
    };

    const cursor = { start: 'Ciao '.length, end: 'Ciao @'.length };
    const oldText = 'Ciao @lan';
    const newText = 'Ciao lan';

    const searchMentionPosition = shiftSearchCursorIfNeeded(
      cursor,
      seachMention,
      oldText,
      newText,
      Typing.deletedText
    );

    expect(searchMentionPosition).toBe(undefined);
  });

  it('search mentions: replaced some text before search', () => {
    const seachMention: SearchCursorPosition<string> = {
      start: 'hello some text '.length,
      end: 'hello some text @lan'.length,
      pauseAt: undefined,
      type: 'users',
      uuid: 'c1bb372e-6cde-4f72-43b0-5874f0a59cca',
    };

    const cursor = { start: 'hell'.length, end: 'hello some'.length };
    const oldText = 'hello some text @lan';
    const newText = 'helle text @lan';

    const searchMentionPosition = shiftSearchCursorIfNeeded(
      cursor,
      seachMention,
      oldText,
      newText,
      Typing.addedText
    );

    expect(searchMentionPosition).not.toBe(undefined);
    expect(searchMentionPosition?.start).toBe('helle text '.length);
    expect(searchMentionPosition?.end).toBe('helle text @lan'.length);
  });

  it('search mentions: removed end line far search', () => {
    const seachMention: SearchCursorPosition<string> = {
      start: 'Ciao\nciao\nciao\n'.length,
      end: 'Ciao\nciao\nciao\n@lan'.length,
      pauseAt: 'Ciao\nciao\nciao\n@lan'.length,
      type: 'users',
      uuid: 'c1bb372e-6cde-4f72-43b0-5874f0a59cca',
    };

    const cursor = { start: 4, end: 6 };
    const oldText = 'Ciao\nciao\nciao\n@lan';
    const newText = 'Ciaociao\nciao\n@lan';

    const searchMentionPosition = shiftSearchCursorIfNeeded(
      cursor,
      seachMention,
      oldText,
      newText,
      Typing.deletedText
    );

    expect(searchMentionPosition).not.toBe(undefined);
    expect(searchMentionPosition?.start).toBe('Ciaociao\nciao\n'.length);
    expect(searchMentionPosition?.end).toBe('Ciaociao\nciao\n@lan'.length);
  });
});
