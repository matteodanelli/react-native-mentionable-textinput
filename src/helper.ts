import {
  CursorPosition,
  Mention,
  MentionOrganizer,
  SearchCursorPosition,
  Typing,
} from './types';

const updateMentionedPositions = (
  mentioned: Mention[],
  cursorPosition: CursorPosition,
  type: Typing,
  length: number
) => {
  return mentioned.map((m) => {
    if (m.position > cursorPosition.start && type === Typing.insertMention) {
      return { ...m, position: m.position + length };
    } else if (
      m.position >= cursorPosition.start &&
      type === Typing.addedText
    ) {
      return { ...m, position: m.position + length };
    } else if (
      m.position > cursorPosition.start &&
      type === Typing.deletedText
    ) {
      return { ...m, position: m.position - length };
    } else {
      return m;
    }
  });
};

const mentionToDelete = (
  mention: Mention,
  cursorPosition: CursorPosition,
  mentionUpdatedWithNewCursor: Mention
) => {
  const cursorStart = cursorPosition.start;
  const cursorEnd = cursorPosition.end;
  const mentionStart = mention.position;
  const mentionEnd = mention.position + mention.label.length;

  if (cursorStart >= mentionStart && cursorStart < mentionEnd) {
    // CASE 1a: mention and text after included
    //   |        |
    // @mention hello
    // CASE 1b: mention included
    //   |  |
    // @mention hello
    // CASE 1c: text inserted at the start of the mention
    // ||
    // @mention hello
    // ciao @mention hello
    const updatedMentionStart = mentionUpdatedWithNewCursor.position;
    // make sure the above check is reliable
    if (cursorStart > cursorEnd && cursorEnd < mentionStart) {
      return false;
    } else if (cursorStart >= updatedMentionStart) {
      return true;
    } else {
      return false;
    }
  } else if (cursorEnd > mentionStart && cursorEnd <= mentionEnd) {
    // CASE 2a: mention and text before included
    //   |      |
    // hello @mention
    // CASE 2b: mention and text before included
    //        |  |
    // hello @mention
    return true;
  } else if (cursorStart <= mentionStart && cursorEnd >= mentionEnd) {
    // CASE 3: mention and text before and after included
    //   |              |
    // hello @mention hello
    return true;
  } else {
    return false;
  }
};

const stretchCursorPointer = (
  firstMentionEdited: Mention,
  lastMentionEdited: Mention,
  cursorPosition: CursorPosition
) => {
  //    |      |
  // hello @mention
  // should become:
  //    |           |
  // example @mention
  const cursorPositionStretched: CursorPosition = { ...cursorPosition };
  if (firstMentionEdited) {
    if (firstMentionEdited.position < cursorPositionStretched.start) {
      cursorPositionStretched.start = firstMentionEdited.position;
    }
    if (
      firstMentionEdited.position + firstMentionEdited.label.length >
      cursorPositionStretched.end
    ) {
      cursorPositionStretched.end =
        firstMentionEdited.position + firstMentionEdited.label.length;
    }
  }
  if (lastMentionEdited) {
    if (
      lastMentionEdited.position + lastMentionEdited.label.length >
      cursorPositionStretched.end
    ) {
      cursorPositionStretched.end =
        lastMentionEdited.position + lastMentionEdited.label.length;
    }
  }
  return cursorPositionStretched;
};

const onChangeMentionableText = ({
  oldText,
  changedText,
  cursorPosition,
  mentioned,
  type,
}: {
  oldText: string;
  changedText: string;
  cursorPosition: CursorPosition;
  mentioned: Mention[];
  type: Typing;
}) => {
  // For every mention, check if it has been edited. If yes then update the text (removing or disabling it)
  const charsWritedPreEdited = cursorPosition.end - cursorPosition.start;
  const updatedMentionsCursors = updateMentionedPositions(
    mentioned,
    cursorPosition,
    type,
    charsWritedPreEdited
  );

  // get all mentions to delete and to keep, to save one cycle after
  const mentionOrganizer = mentioned.reduce(
    (acc: MentionOrganizer, mention, index): MentionOrganizer => {
      const snapshotNewMention = updatedMentionsCursors[index];
      if (mentionToDelete(mention, cursorPosition, snapshotNewMention)) {
        return {
          ...acc,
          mentionsToDelete: [...acc.mentionsToDelete, mention],
        };
      } else {
        return {
          ...acc,
          mentionsToKeep: [...acc.mentionsToKeep, mention],
        };
      }
    },
    { mentionsToDelete: [], mentionsToKeep: [] }
  );

  const firstMentionEdited = mentionOrganizer.mentionsToDelete[0];
  const lastMentionEdited =
    mentionOrganizer.mentionsToDelete[
      mentionOrganizer.mentionsToDelete.length - 1
    ];

  const cursorPositionStretched = stretchCursorPointer(
    firstMentionEdited,
    lastMentionEdited,
    cursorPosition
  );

  if (type === Typing.deletedText) {
    const charsWrited =
      cursorPositionStretched.end - cursorPositionStretched.start;
    return {
      newText:
        oldText.slice(0, cursorPositionStretched.start) +
        oldText.slice(cursorPositionStretched.end),
      newMentioned: updateMentionedPositions(
        mentionOrganizer.mentionsToKeep,
        cursorPositionStretched,
        type,
        charsWrited
      ),
    };
  } else {
    const charsWrited = cursorPosition.end - cursorPosition.start;
    return {
      newText: changedText,
      newMentioned: updateMentionedPositions(
        mentionOrganizer.mentionsToKeep,
        cursorPosition,
        type,
        charsWrited
      ),
    };
  }
};

const addMentionIntoText = ({
  text,
  mention,
  mentioned,
  currentCursorPosition,
}: {
  text: string;
  mention: Mention;
  mentioned: Mention[];
  currentCursorPosition: CursorPosition;
}) => {
  let mentionedClone = [...mentioned];
  mentionedClone.push(mention);

  // Insert the mention in the right position, therefore sort accort to mention.position
  mentionedClone.sort((prev, next) => {
    if (prev.position > next.position) {
      return 1;
    } else if (prev.position < next.position) {
      return -1;
    } else {
      return 0;
    }
  });

  // Build this way because mention can be inserted in the middle of existing text
  // Use mention.position instead currentCursorPosition because during search I need to remove the wrote text
  const newText =
    text.slice(0, mention.position) +
    mention.label +
    text.slice(currentCursorPosition.end);

  const charsSearched = currentCursorPosition.end - currentCursorPosition.start;
  const charsToAdd = mention.label.length - charsSearched;

  mentionedClone = updateMentionedPositions(
    mentionedClone,
    {
      start: currentCursorPosition.start,
      end: currentCursorPosition.start + mention.label.length,
    },
    Typing.insertMention,
    charsToAdd
  );

  return {
    newText,
    newMentioned: mentionedClone,
  };
};

const generateUUID = (): string => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

// Find index of the first different char
const findFirstDiff = (str1: string, str2: string) => {
  if (str2.length > str1.length) {
    // we need the cursor to point after the typed character
    return [...str2].findIndex((el, index) => el !== str1[index]);
  } else {
    return [...str1].findIndex((el, index) => el !== str2[index]);
  }
};

// Find index of the first different char
const findLastDiff = (str1: string, str2: string) => {
  const reverseStr1 = [...str1].reverse().join('');
  const reverseStr2 = [...str2].reverse().join('');
  if (reverseStr2 > reverseStr1) {
    // we need the cursor to point after the typed character
    return (
      reverseStr2.length -
      [...reverseStr2].findIndex((el, index) => el !== reverseStr1[index])
    );
  } else {
    return (
      reverseStr1.length -
      [...reverseStr1].findIndex((el, index) => el !== reverseStr2[index])
    );
  }
};

const getCursorPointer = (oldText: string, newText: string) => {
  const startChanges = findFirstDiff(oldText, newText);
  const endChanges = findLastDiff(oldText, newText);

  const difference = newText.length - oldText.length;

  if (difference < 0) {
    if (
      oldText.slice(startChanges - difference) === newText.slice(startChanges)
    ) {
      // Typing.deleted because there aren't any chars between changes
      return {
        start: startChanges,
        end: startChanges - difference,
        type: Typing.deletedText,
      };
    } else {
      // Typing.added because there are some chars between changes
      const textAddedLength = endChanges - startChanges;
      return {
        start: startChanges,
        end: startChanges - difference + textAddedLength,
        type: Typing.addedText,
      };
    }
  } else {
    // Typing.added because the newText is longer than oldText
    return {
      start: startChanges,
      end: startChanges + difference,
      type: Typing.addedText,
    };
  }
};

const isCursorIsBetweenSearchMention = (
  cursor: CursorPosition,
  searchMention: SearchCursorPosition
) => {
  if (
    (cursor.start > searchMention.start && cursor.start <= searchMention.end) ||
    (cursor.end > searchMention.start && cursor.end <= searchMention.end) ||
    Math.abs(searchMention.end - cursor.end) === 1
  ) {
    if (
      searchMention.pauseAt &&
      (cursor.start > searchMention.pauseAt ||
        cursor.end > searchMention.pauseAt)
    ) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

const shiftSearchCursorIfNeeded = (
  cursor: CursorPosition,
  searchMention: SearchCursorPosition,
  oldText: string,
  newText: string,
  typing: Typing
): SearchCursorPosition => {
  if (typing === Typing.addedText) {
    const cursorDifference = cursor.end - cursor.start;
    const stringDifference = newText.length - oldText.length;
    if (cursorDifference !== stringDifference) {
    } else if (cursor.start < searchMention.start) {
      return {
        ...searchMention,
        start: searchMention.start + cursorDifference,
        end: searchMention.end + cursorDifference,
        pauseAt: searchMention.pauseAt
          ? searchMention.pauseAt + cursorDifference
          : undefined,
      };
    }

    return searchMention;
  } else {
    const cursorDifference = cursor.end - cursor.start;
    const stringDifference = oldText.length - newText.length;
    if (cursorDifference !== stringDifference) {
    } else if (cursor.start < searchMention.start) {
      return {
        ...searchMention,
        start: searchMention.start - cursorDifference,
        end: searchMention.end - cursorDifference,
        pauseAt: searchMention.pauseAt
          ? searchMention.pauseAt - cursorDifference
          : undefined,
      };
    }

    return searchMention;
  }
};

const isCursorIsBetweenMentionCharSearchMention = (
  cursor: CursorPosition,
  searchMention: CursorPosition
) => {
  // @ # /
  return (
    cursor.start <= searchMention.start && cursor.end >= searchMention.start
  );
};

export {
  onChangeMentionableText,
  addMentionIntoText,
  generateUUID,
  getCursorPointer,
  isCursorIsBetweenSearchMention,
  isCursorIsBetweenMentionCharSearchMention,
  shiftSearchCursorIfNeeded,
};
