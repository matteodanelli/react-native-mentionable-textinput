import { Typing } from '../types';
import { getCursorPointer } from '../helper';

describe('Strings', () => {
  it('getCursorPointer: added some text in the middle', () => {
    const oldText = 'ciao come stai?';
    const newText = 'ciao stai?';

    const start = 'ciao '.length;
    const end = 'ciao come '.length;
    expect(JSON.stringify(getCursorPointer(oldText, newText))).toBe(
      JSON.stringify({ start, end, type: Typing.deletedText })
    );
  });

  it('getCursorPointer: added a char before word', () => {
    const oldText = 'ciao come stai?';
    const newText = 'ciao come estai?';

    const start = 'ciao come '.length;
    const end = 'ciao come e'.length;
    expect(JSON.stringify(getCursorPointer(oldText, newText))).toBe(
      JSON.stringify({ start, end, type: Typing.addedText })
    );
  });

  it('getCursorPointer: added some text in the middle with the spaces', () => {
    const oldText = 'ciao come stai?';
    const newText = 'ciao come e wehdwehjdvwhje wehdvwev stai?';

    const start = 'ciao come '.length;
    const end = 'ciao come e wehdwehjdvwhje wehdvwev '.length;
    expect(JSON.stringify(getCursorPointer(oldText, newText))).toBe(
      JSON.stringify({ start, end, type: Typing.addedText })
    );
  });

  it('getCursorPointer: deleted all', () => {
    const oldText = 'ciao come stai?';
    const newText = '';

    const start = ''.length;
    const end = 'ciao come stai?'.length;
    expect(JSON.stringify(getCursorPointer(oldText, newText))).toBe(
      JSON.stringify({ start, end, type: Typing.deletedText })
    );
  });

  it('getCursorPointer: added some text from empty string', () => {
    const oldText = '';
    const newText = 'ciao come stai?';

    const start = ''.length;
    const end = 'ciao come stai?'.length;
    expect(JSON.stringify(getCursorPointer(oldText, newText))).toBe(
      JSON.stringify({ start, end, type: Typing.addedText })
    );
  });

  it('getCursorPointer: edited chars in the word', () => {
    const oldText = 'questo è una terreno molto lungo';
    const newText = 'questo è una testo molto lungo';

    const start = 'questo è una te'.length;
    const end = 'questo è una terren'.length;
    expect(JSON.stringify(getCursorPointer(oldText, newText))).toBe(
      JSON.stringify({ start, end, type: Typing.addedText })
    );
  });

  it('getCursorPointer: edited confusing chars in the word', () => {
    const oldText = 'test eeeeeeeeeee';
    const newText = 'test eerrereeee';

    const start = 'test ee'.length;
    const end = 'test eeeeeee'.length;
    expect(JSON.stringify(getCursorPointer(oldText, newText))).toBe(
      JSON.stringify({ start, end, type: Typing.addedText })
    );
  });

  it('getCursorPointer: deleted last char', () => {
    const oldText = 'test';
    const newText = 'tes';

    const start = 'tes'.length;
    const end = 'test'.length;
    expect(JSON.stringify(getCursorPointer(oldText, newText))).toBe(
      JSON.stringify({ start, end, type: Typing.deletedText })
    );
  });
});
