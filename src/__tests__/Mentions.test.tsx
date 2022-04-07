import { addMentionIntoText, onChangeMentionableText } from '../helper';
import { Mention, Typing } from '../types';

describe('Mentions', () => {
  it('mentions: deleted some chars in the end of mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@mention',
        position: 'ciao '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @mention altro testo',
      changedText: 'ciao @m testo',
      mentioned,
      cursorPosition: {
        start: 'ciao @m'.length,
        end: 'ciao @mention altro'.length,
      },
      type: Typing.deletedText,
    });
    expect(newText).toBe('ciao  testo');
    expect(JSON.stringify(newMentioned)).toBe('[]');
  });

  it('mentions: deleted selection that starts before mention and end in the middle of mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@mention',
        position: 'ciao questa è una '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao questa è una @mention e altro testo',
      changedText: 'ciao quon e altro testo',
      mentioned,
      cursorPosition: {
        start: 'ciao qu'.length,
        end: 'ciao questa è una @menti'.length,
      },
      type: Typing.deletedText,
    });
    expect(newText).toBe('ciao qu e altro testo');
    expect(JSON.stringify(newMentioned)).toBe('[]');
  });

  it('mentions: deleted selection before mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@mention',
        position: 'ciao questa è una '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao questa è una @mention e altro testo',
      changedText: 'ciao qu @mention e altro testo',
      mentioned,
      cursorPosition: {
        start: 'ciao qu'.length,
        end: 'ciao questa è una'.length,
      },
      type: Typing.deletedText,
    });
    expect(newText).toBe('ciao qu @mention e altro testo');
    const newlabelPosition = 'ciao qu '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid1","id":"1","label":"@mention","position":${newlabelPosition},"type":"user"}]`
    );
  });

  it('mentions: deleted selection that start in the middle of first mention and end in the middle of second mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@mention',
        position: 'ciao questa è una '.length,
        type: 'user',
      },
      {
        uuid: 'uuid2',
        id: '1',
        label: '@mention',
        position: 'ciao questa è una @mention e altro testo e altra '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText:
        'ciao questa è una @mention e altro testo e altra @mention in una frase',
      changedText: 'ciao questa è una @mention in una frase',
      mentioned,
      cursorPosition: {
        start: 'ciao questa è una @m'.length,
        end: 'ciao questa è una @mention e altro testo e altra @m'.length,
      },
      type: Typing.deletedText,
    });
    expect(newText).toBe('ciao questa è una  in una frase');
    expect(JSON.stringify(newMentioned)).toBe('[]');
  });

  it('mentions: deleted selection of last chars of mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@mention',
        position: 'ciao '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @mention',
      changedText: 'ciao @mention',
      mentioned,
      cursorPosition: {
        start: 'ciao '.length,
        end: 'ciao @menti'.length,
      },
      type: Typing.deletedText,
    });
    expect(newText).toBe('ciao ');
    expect(JSON.stringify(newMentioned)).toBe('[]');
  });

  it('mentions: deleted selection that starts in the middle of mention and end after mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@mention',
        position: 'ciao '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @mention test',
      changedText: 'ciao @menst',
      mentioned,
      cursorPosition: {
        start: 'ciao @men'.length,
        end: 'ciao @mention te'.length,
      },
      type: Typing.deletedText,
    });
    expect(newText).toBe('ciao st');
    expect(JSON.stringify(newMentioned)).toBe('[]');
  });

  it('mentions: added some text into selection that starts in the middle of mention and end after mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@mention',
        position: 'ciao '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @mention test',
      changedText: 'ciao @men__st',
      mentioned,
      cursorPosition: {
        start: 'ciao @men'.length,
        end: 'ciao @mention te'.length,
      },
      type: Typing.addedText,
    });
    expect(newText).toBe('ciao @men__st');
    expect(JSON.stringify(newMentioned)).toBe('[]');
  });

  it('mentions: added some chars in the middle of mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@mention',
        position: 'ciao '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @mention',
      changedText: 'ciao @menteeeion',
      mentioned,
      cursorPosition: {
        start: 'ciao @ment'.length,
        end: 'ciao @menteee'.length,
      },
      type: Typing.addedText,
    });
    expect(newText).toBe('ciao @menteeeion');
    expect(JSON.stringify(newMentioned)).toBe('[]');
  });

  it('mentions: without mention', () => {
    const mentioned: Mention[] = [];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao ',
      changedText: 'ciao c',
      mentioned,
      cursorPosition: {
        start: 'ciao c'.length,
        end: 'ciao c'.length,
      },
      type: Typing.addedText,
    });
    expect(JSON.stringify(newMentioned)).toBe('[]');
    expect(newText).toBe('ciao c');
  });

  it('mentions: deleted mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo',
      changedText: 'ciao @Giacom',
      mentioned,
      cursorPosition: {
        start: 'ciao @Giacom'.length,
        end: 'ciao @Giacom'.length,
      },
      type: Typing.deletedText,
    });
    expect(JSON.stringify(newMentioned)).toBe('[]');
    expect(newText).toBe('ciao ');
  });

  it('mentions: deleted mention from internal char', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo',
      changedText: 'ciao @Gicomo',
      mentioned,
      cursorPosition: {
        start: 'ciao @Gi'.length,
        end: 'ciao @Gi'.length,
      },
      type: Typing.deletedText,
    });
    expect(JSON.stringify(newMentioned)).toBe('[]');
    expect(newText).toBe('ciao ');
  });

  it('mentions: deleted first mention with duplicate mentions', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
      {
        uuid: 'uuid2',
        id: '1',
        label: '@Giacomo',
        position: 'ciao @Giacomo '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo @Giacomo',
      changedText: 'ciao @Giacom @Giacomo',
      mentioned,
      cursorPosition: {
        start: 'ciao @Giacom'.length,
        end: 'ciao @Giacom'.length,
      },
      type: Typing.deletedText,
    });

    const newlabelPosition = 'ciao  '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid2","id":"1","label":"@Giacomo","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao  @Giacomo');
  });

  it('mentions: deleted second mention with duplicate mentions', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
      {
        uuid: 'uuid2',
        id: '1',
        label: '@Giacomo',
        position: 'ciao @Giacomo '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo @Giacomo',
      changedText: 'ciao @Giacomo @Giacom',
      mentioned,
      cursorPosition: {
        start: 'ciao @Giacomo @Giacom'.length,
        end: 'ciao @Giacomo @Giacom'.length,
      },
      type: Typing.deletedText,
    });

    const newlabelPosition = 'ciao '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid1","id":"1","label":"@Giacomo","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao @Giacomo ');
  });

  it('mentions: deleted second mention when courses have the same name', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Pizza margherita',
        position: 'ciao '.length,
        type: 'user',
      },
      {
        uuid: 'uuid2',
        id: '2',
        label: '@Pizza margherita',
        position: 'ciao @Pizza margherita '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Pizza margherita @Pizza margherita',
      changedText: 'ciao @Pizza margherita @Pizza margherit',
      mentioned,
      cursorPosition: {
        start: 'ciao @Pizza margherita @Pizza margherit'.length,
        end: 'ciao @Pizza margherita @Pizza margherit'.length,
      },
      type: Typing.deletedText,
    });

    const newlabelPosition = 'ciao '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid1","id":"1","label":"@Pizza margherita","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao @Pizza margherita ');
  });

  it('mentions: deleted @ of second mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
      {
        uuid: 'uuid2',
        id: '1',
        label: '@Giacomo',
        position: 'ciao @Giacomo '.length,
        type: 'user',
      },
    ];

    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo @Giacomo',
      changedText: 'ciao @Giacomo Giacomo',
      mentioned,
      cursorPosition: {
        start: 'ciao @Giacomo '.length,
        end: 'ciao @Giacomo '.length,
      },
      type: Typing.deletedText,
    });

    const newlabelPosition = 'ciao '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid1","id":"1","label":"@Giacomo","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao @Giacomo ');
  });

  it('mentions: deleted @ of first mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
      {
        uuid: 'uuid2',
        id: '1',
        label: '@Giacomo',
        position: 'ciao @Giacomo '.length,
        type: 'user',
      },
    ];

    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo @Giacomo',
      changedText: 'ciao Giacomo @Giacomo',
      mentioned,
      cursorPosition: {
        start: 'ciao '.length,
        end: 'ciao '.length,
      },
      type: Typing.deletedText,
    });

    const newlabelPosition = 'ciao  '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid2","id":"1","label":"@Giacomo","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao  @Giacomo');
  });

  it('mentions: added char to mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo',
      changedText: 'ciao @Giaacomo',
      mentioned,
      cursorPosition: {
        start: 'ciao @Giaa'.length,
        end: 'ciao @Giaa'.length,
      },
      type: Typing.addedText,
    });
    expect(JSON.stringify(newMentioned)).toBe('[]');
    expect(newText).toBe('ciao @Giaacomo');
  });

  it('mentions: added char to first equals mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
      {
        uuid: 'uuid2',
        id: '1',
        label: '@Giacomo',
        position: 'ciao @Giacomo '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo @Giacomo',
      changedText: 'ciao @Giaacomo @Giacomo',
      mentioned,
      cursorPosition: {
        start: 'ciao @Gia'.length,
        end: 'ciao @Giaa'.length,
      },
      type: Typing.addedText,
    });

    const newlabelPosition = 'ciao @Giaacomo '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid2","id":"1","label":"@Giacomo","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao @Giaacomo @Giacomo');
  });

  it('mentions: added char to second equals mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
      {
        uuid: 'uuid2',
        id: '1',
        label: '@Giacomo',
        position: 'ciao @Giacomo '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo @Giacomo',
      changedText: 'ciao @Giacomo @Giaacomo',
      mentioned,
      cursorPosition: {
        start: 'ciao @Giacomo @Giaa'.length,
        end: 'ciao @Giacomo @Giaa'.length,
      },
      type: Typing.addedText,
    });

    const newlabelPosition = 'ciao '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid1","id":"1","label":"@Giacomo","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao @Giacomo @Giaacomo');
  });

  it('mentions: added space after mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo',
      changedText: 'ciao @Giacomo ',
      mentioned,
      cursorPosition: {
        start: 'ciao @Giacomo'.length,
        end: 'ciao @Giacomo '.length,
      },
      type: Typing.addedText,
    });

    const newlabelPosition = 'ciao '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid1","id":"1","label":"@Giacomo","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao @Giacomo ');
  });

  it('mentions: added space before mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo',
      changedText: 'ciao  @Giacomo',
      mentioned,
      cursorPosition: {
        start: 'ciao '.length,
        end: 'ciao  '.length,
      },
      type: Typing.addedText,
    });

    const newlabelPosition = 'ciao  '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid1","id":"1","label":"@Giacomo","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao  @Giacomo');
  });

  it('mentions: added text before mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao @Giacomo',
      changedText: 'ciao test@Giacomo',
      mentioned,
      cursorPosition: {
        start: 'ciao '.length,
        end: 'ciao test'.length,
      },
      type: Typing.addedText,
    });

    const newlabelPosition = 'ciao test'.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid1","id":"1","label":"@Giacomo","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao test@Giacomo');
  });

  it('mentions: delete char before mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao  '.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao  @Giacomo',
      changedText: 'ciao @Giacomo',
      mentioned,
      cursorPosition: {
        start: 'ciao '.length,
        end: 'ciao  '.length,
      },
      type: Typing.deletedText,
    });

    const newlabelPosition = 'ciao '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid1","id":"1","label":"@Giacomo","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao @Giacomo');
  });

  it('mentions: delete row before mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao\n\n'.length,
        type: 'user',
      },
    ];
    const { newText, newMentioned } = onChangeMentionableText({
      oldText: 'ciao\n\n@Giacomo',
      changedText: 'ciao\n@Giacomo',
      mentioned,
      cursorPosition: {
        start: 'ciao\n'.length,
        end: 'ciao\n\n'.length,
      },
      type: Typing.deletedText,
    });

    const newlabelPosition = 'ciao\n'.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid1","id":"1","label":"@Giacomo","position":${newlabelPosition},"type":"user"}]`
    );
    expect(newText).toBe('ciao\n@Giacomo');
  });

  it('mentions: added mention before another mention example 1', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao  e '.length,
        type: 'user',
      },
    ];

    const { newText, newMentioned } = addMentionIntoText({
      text: 'ciao  e @Giacomo',
      mention: {
        uuid: 'uuid2',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
      mentioned,
      currentCursorPosition: {
        start: 'ciao '.length,
        end: 'ciao '.length,
      },
    });

    const newlabelPosition1 = 'ciao '.length;
    const newlabelPosition2 = 'ciao @Giacomo e '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid2","id":"1","label":"@Giacomo","position":${newlabelPosition1},"type":"user"},{"uuid":"uuid1","id":"1","label":"@Giacomo","position":${newlabelPosition2},"type":"user"}]`
    );
    expect(newText).toBe('ciao @Giacomo e @Giacomo');
  });

  it('mentions: added mention before another mention example 2', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@All in',
        position: '@ Ciao '.length,
        type: 'user',
      },
    ];

    const { newText, newMentioned } = addMentionIntoText({
      text: '@ Ciao @All in',
      mention: {
        uuid: 'uuid2',
        id: '1',
        label: '@All in',
        position: ''.length,
        type: 'user',
      },
      mentioned,
      currentCursorPosition: {
        start: ''.length,
        end: '@'.length,
      },
    });

    const newlabelPosition1 = ''.length;
    const newlabelPosition2 = '@All in Ciao '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid2","id":"1","label":"@All in","position":${newlabelPosition1},"type":"user"},{"uuid":"uuid1","id":"1","label":"@All in","position":${newlabelPosition2},"type":"user"}]`
    );
    expect(newText).toBe('@All in Ciao @All in');
  });

  it('mentions: added mention before another mention during search', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@All in',
        position: '@Al Ciao '.length,
        type: 'user',
      },
    ];

    const { newText, newMentioned } = addMentionIntoText({
      text: '@Al Ciao @All in',
      mention: {
        uuid: 'uuid2',
        id: '1',
        label: '@All in',
        position: ''.length,
        type: 'user',
      },
      mentioned,
      currentCursorPosition: {
        start: ''.length,
        end: '@Al'.length,
      },
    });

    const newlabelPosition1 = ''.length;
    const newlabelPosition2 = '@All in Ciao '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid2","id":"1","label":"@All in","position":${newlabelPosition1},"type":"user"},{"uuid":"uuid1","id":"1","label":"@All in","position":${newlabelPosition2},"type":"user"}]`
    );
    expect(newText).toBe('@All in Ciao @All in');
  });

  it('mentions: added mention after another mention', () => {
    const mentioned = [
      {
        uuid: 'uuid1',
        id: '1',
        label: '@Giacomo',
        position: 'ciao '.length,
        type: 'user',
      },
    ];

    const { newText, newMentioned } = addMentionIntoText({
      text: 'ciao @Giacomo e ',
      mention: {
        uuid: 'uuid2',
        id: '1',
        label: '@Giacomo',
        position: 'ciao @Giacomo e '.length,
        type: 'user',
      },
      mentioned,
      currentCursorPosition: {
        start: 'ciao @Giacomo e '.length,
        end: 'ciao @Giacomo e '.length,
      },
    });

    const newlabelPosition1 = 'ciao '.length;
    const newlabelPosition2 = 'ciao @Giacomo e '.length;
    expect(JSON.stringify(newMentioned)).toBe(
      `[{"uuid":"uuid1","id":"1","label":"@Giacomo","position":${newlabelPosition1},\"type\":\"user\"},{"uuid":"uuid2","id":"1","label":"@Giacomo","position":${newlabelPosition2},\"type\":\"user\"}]`
    );
    expect(newText).toBe('ciao @Giacomo e @Giacomo');
  });
});
