import {
  addMentionIntoText,
  onChangeMentionableText,
  generateUUID,
  getCursorPointer,
} from '../helper';
import { CursorPosition, Mention, MentionListItem, Typing } from '../types';
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Props } from '../types';
import { Text, TextInput } from 'react-native';
import styles from '../style';

const useMention = (props: Props) => {
  const {
    initialText,
    initialMentioned,
    searchMentionableItems,
    placeholder,
    onEndTyping,
    children,
    isMentionsDisabled,
    onSend,
    mentionableItems,
    onChangeText: onChangeTextCallback,
    onMentionClose,
    mentionStyle,
    textStyle,
    mentionsTypes = [],
    isSubmitDisabled,
    submitIcon,
    mentionIcon,
    closeIcon,
    keyboardAvoidingViewProps,
    maxHeightMentionWindow,
    setInputRef,
    textInputProps,
    mentionContainerStyle,
    textInputContainerStyle,
    renderMentionType,
    separatorColor = 'grey',
  } = props;

  const renderMention = useCallback(
    (text: string) => {
      return (
        <Text style={mentionStyle ? mentionStyle : styles.mentionInInputText}>
          {text}
        </Text>
      );
    },
    [mentionStyle]
  );
  const renderText = useCallback(
    (text: string) => {
      return (
        <Text style={textStyle ? textStyle : styles.textInInputText}>
          {text}
        </Text>
      );
    },
    [textStyle]
  );

  const setInputTextRefCallback = useCallback(
    (ref: TextInput) => {
      setInputRef?.(ref);
    },
    [setInputRef]
  );

  const closeMention = useCallback(() => {
    setSearchMentionPosition(undefined);
    setShowMentionItems(false);
    setShowMentionTypes(false);
    chooseMentionType(undefined);
  }, []);

  const [inputText, setInputText] = useState(initialText || '');
  const [mentioned, setMentioned] = useState(initialMentioned || []);
  const [chosenMentionType, chooseMentionType] = useState<string | undefined>(
    undefined
  );
  const [showMentionTypes, setShowMentionTypes] = useState(false);
  const [showMentionItems, setShowMentionItems] = useState(false);
  const [searchMentionPosition, setSearchMentionPosition] = useState<
    CursorPosition | undefined
  >();
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    start: 0,
    end: 0,
  });

  useEffect(() => {
    setMentioned(initialMentioned || []);
  }, [initialMentioned]);

  useEffect(() => {
    if (chosenMentionType === undefined && onMentionClose) {
      onMentionClose();
    }
  }, [chosenMentionType, onMentionClose]);

  const getObjectMentionFromType = useCallback(
    (type: string) => mentionsTypes.find((mT) => mT.type === type),
    [mentionsTypes]
  );
  const getObjectMentionFromChar = useCallback(
    (char: string) => mentionsTypes.find((mT) => mT.mentionChar === char),
    [mentionsTypes]
  );

  const formattedText = useMemo(() => {
    const textSplitted = [];

    // If there are mentions
    if (mentioned?.length > 0) {
      let cursor = 0;
      mentioned.forEach((mention) => {
        const beforeCurrentMention = inputText.substring(
          cursor,
          mention.position
        );
        textSplitted.push(renderText(beforeCurrentMention));
        textSplitted.push(renderMention(mention.label));
        cursor = mention.position + mention.label.length;
      });
      // Concat the end of the string
      const finalText = inputText.substring(cursor, inputText.length);
      textSplitted.push(renderText(finalText));
    } else {
      // No mentions found
      textSplitted.push(renderText(inputText));
    }

    return textSplitted;
  }, [mentioned, inputText, renderText, renderMention]);

  const onPressMentionType = useCallback(
    (mentionType: string, localCursorPosition?: CursorPosition) => {
      setShowMentionTypes(false);
      setShowMentionItems(true);
      chooseMentionType(mentionType);

      if (localCursorPosition) {
        // come from typing text
        setSearchMentionPosition({
          start: localCursorPosition.start,
          end: localCursorPosition.end,
        });
      } else {
        // come from mention icon

        const loaclSearchMentionPosition = {
          start: cursorPosition.start,
          end:
            cursorPosition.end === cursorPosition.start
              ? cursorPosition.end + 1
              : cursorPosition.end,
        };

        setSearchMentionPosition(loaclSearchMentionPosition);

        const mentionsType = getObjectMentionFromType(mentionType);

        const newTextInput =
          inputText.slice(0, cursorPosition.start) +
          mentionsType?.mentionChar +
          inputText.slice(cursorPosition.end);

        const { newText, newMentioned } = onChangeMentionableText({
          oldText: inputText,
          changedText: newTextInput,
          mentioned,
          cursorPosition: loaclSearchMentionPosition,
          type: Typing.addedText,
        });

        setInputText(newText);
        setMentioned(newMentioned);
        onChangeTextCallback?.(newText, newMentioned);
      }

      searchMentionableItems?.(mentionType, '');
    },
    [
      searchMentionableItems,
      cursorPosition.start,
      cursorPosition.end,
      getObjectMentionFromType,
      inputText,
      mentioned,
      onChangeTextCallback,
    ]
  );

  const onChangeText = useCallback(
    (changedText: string) => {
      if (!isMentionsDisabled) {
        const localCursorPosition = getCursorPointer(inputText, changedText);

        if (
          searchMentionPosition &&
          localCursorPosition.start <= searchMentionPosition.start
        ) {
          // when delete the mention char key, or when write outsite of mention
          closeMention();
        } else if (searchMentionPosition && chosenMentionType) {
          // during search
          setSearchMentionPosition({
            ...searchMentionPosition,
            end: localCursorPosition.end,
          });
          const textToSearch = changedText.slice(
            searchMentionPosition.start + 1,
            localCursorPosition.end
          );

          searchMentionableItems?.(chosenMentionType, textToSearch);
        }

        const penultimateChar = changedText.charAt(
          localCursorPosition.start - 1
        );
        const afterLastTypedChar = changedText.charAt(
          localCursorPosition.start + 1
        );
        const penultimateCharIsEmpty =
          penultimateChar === ' ' ||
          penultimateChar === '' ||
          penultimateChar === '\n';
        const afterLastTypedCharIsEmpty =
          afterLastTypedChar === ' ' ||
          afterLastTypedChar === '' ||
          afterLastTypedChar === '\n';

        if (penultimateCharIsEmpty && afterLastTypedCharIsEmpty) {
          const lastTypedChar = changedText.charAt(localCursorPosition.start);
          const mentionTypeRef = getObjectMentionFromChar(lastTypedChar);
          if (mentionTypeRef) {
            onPressMentionType(mentionTypeRef.type, localCursorPosition);
          }
        }

        const { newText, newMentioned } = onChangeMentionableText({
          oldText: inputText,
          changedText,
          mentioned,
          cursorPosition: localCursorPosition,
          type: localCursorPosition.type,
        });

        setInputText(newText);
        setMentioned(newMentioned);
        onChangeTextCallback?.(newText, newMentioned);
      } else {
        setInputText(changedText);
        onChangeTextCallback?.(changedText, []);
      }
    },
    [
      chosenMentionType,
      inputText,
      isMentionsDisabled,
      mentioned,
      onChangeTextCallback,
      closeMention,
      onPressMentionType,
      searchMentionableItems,
      searchMentionPosition,
      getObjectMentionFromChar,
    ]
  );

  const onSelectionChange = useCallback(
    (event: { nativeEvent: { selection: CursorPosition } }) => {
      if (!isMentionsDisabled) {
        // Save the current position of the cursor
        const { selection } = event.nativeEvent;
        setCursorPosition(selection);

        if (
          // this is necessary because when the user clicks on the mention icon and wants to mention the user, the selection moves for a moment to the end of the string
          selection.end - 1 < inputText.length &&
          inputText.length !== selection.start &&
          searchMentionPosition &&
          (selection.start < searchMentionPosition.start ||
            selection.start - 1 > searchMentionPosition.end)
        ) {
          // move cursor out of search mention, or paste text into mention
          closeMention();
        }
      }
    },
    [inputText.length, isMentionsDisabled, closeMention, searchMentionPosition]
  );

  const addMention = useCallback(
    (mention: MentionListItem) => {
      const currentCursorPosition = searchMentionPosition ?? cursorPosition;
      const mentionType = getObjectMentionFromType(mention.type);
      const newMention: Mention = {
        uuid: generateUUID(),
        id: mention.id,
        type: mention.type,
        label: `${mentionType?.mentionChar}${mention.label}`,
        position: currentCursorPosition.start,
      };

      const { newText, newMentioned } = addMentionIntoText({
        text: inputText,
        mention: newMention,
        mentioned: mentioned,
        currentCursorPosition,
      });

      // Mention added therefore reset cursor position of the search input
      setMentioned(newMentioned);
      setInputText(newText);
      onChangeTextCallback?.(newText, newMentioned);
      closeMention();
    },
    [
      searchMentionPosition,
      cursorPosition,
      inputText,
      mentioned,
      onChangeTextCallback,
      closeMention,
      getObjectMentionFromType,
    ]
  );

  const onSendCallback = useCallback(() => {
    onSend?.(inputText, mentioned);
  }, [inputText, mentioned, onSend]);

  const onPressMentionIcon = useCallback(() => {
    if (showMentionItems || showMentionTypes) {
      closeMention();
    } else {
      setShowMentionTypes(true);
    }
  }, [closeMention, showMentionItems, showMentionTypes]);

  const mentionItemsVisible = useMemo(() => {
    return showMentionItems;
  }, [showMentionItems]);

  const isTextUpdated = useMemo(
    () => !(inputText === initialText || inputText === ''),
    [initialText, inputText]
  );

  return {
    mentioned,
    formattedText,
    onChangeText,
    placeholder,
    onSelectionChange,
    cursorPosition,
    onEndTyping,
    addMention,
    chosenMentionType,
    showMentionItems,
    showMentionTypes,
    children,
    isMentionsDisabled,
    onSendCallback,
    onPressMentionIcon,
    mentionableItems,
    onPressMentionType,
    closeMention,
    mentionItemsVisible,
    isTextUpdated,
    submitIcon,
    mentionIcon,
    closeIcon,
    mentionsTypes,
    keyboardAvoidingViewProps,
    maxHeightMentionWindow,
    sendDisabled: !isTextUpdated || isSubmitDisabled,
    setInputTextRefCallback,
    textInputProps,
    mentionContainerStyle,
    textInputContainerStyle,
    renderMentionType,
    separatorColor,
  };
};

export default useMention;
