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

const renderMention = (text: string) => {
  return <Text style={styles.mentionInInputText}>{text}</Text>;
};
const renderText = (text: string) => {
  return <Text style={styles.textInInputText}>{text}</Text>;
};

const useMention = (props: Props) => {
  const {
    initialText,
    initialMentioned,
    refreshData,
    placeholder,
    onEndTyping,
    children,
    isMentionsEnabled,
    onSend,
    mentionItems,
    onChangeText: onChangeTextCallback,
    onMentionClose,
    isSendButtonEnabled,
    renderMentionForTextInput,
    renderTextForTextInput,
    mentionsTypes = [],
    iconSendForTextInput,
    iconSendDisabledForTextInput,
    iconMentionForTextInput,
    iconCloseMentionForTextInput,
    keyboardAvoidingViewProps,
    maxHeightMentionWindow,
    setInputRef,
    isMultilineEnabled,
    textInputProps,
    mentionWindowStyle,
    containerTextInputStyle,
    renderMentionType,
  } = props;

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
        textSplitted.push(
          renderTextForTextInput
            ? renderTextForTextInput(mention.label)
            : renderText(beforeCurrentMention)
        );
        textSplitted.push(
          renderMentionForTextInput
            ? renderMentionForTextInput(mention.label)
            : renderMention(mention.label)
        );
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
  }, [mentioned, inputText, renderMentionForTextInput, renderTextForTextInput]);

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

        const mentionsType = mentionsTypes.find(
          (mT) => mT.type === mentionType
        );

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

      refreshData?.(mentionType, '');
    },
    [
      cursorPosition.end,
      cursorPosition.start,
      inputText,
      mentioned,
      onChangeTextCallback,
      refreshData,
      mentionsTypes,
    ]
  );

  const onChangeText = useCallback(
    (changedText: string) => {
      if (isMentionsEnabled) {
        console.log(`[${inputText}]`);
        console.log(`{${changedText}}`);
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

          refreshData?.(chosenMentionType, textToSearch);
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
          const mentionTypeRef = mentionsTypes.find(
            (mT) => mT.mentionChar === lastTypedChar
          );
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
      isMentionsEnabled,
      mentioned,
      onChangeTextCallback,
      closeMention,
      onPressMentionType,
      refreshData,
      searchMentionPosition,
      mentionsTypes,
    ]
  );

  const onSelectionChange = useCallback(
    (event: { nativeEvent: { selection: CursorPosition } }) => {
      if (isMentionsEnabled) {
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
    [inputText.length, isMentionsEnabled, closeMention, searchMentionPosition]
  );

  const addMention = useCallback(
    (mention: MentionListItem) => {
      const currentCursorPosition = searchMentionPosition ?? cursorPosition;
      const newMention: Mention = {
        uuid: generateUUID(),
        id: mention.id,
        type: mention.type,
        label: `${mention.mentionChar}${mention.label}`,
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
    isMentionsEnabled,
    onSendCallback,
    onPressMentionIcon,
    mentionItems,
    onPressMentionType,
    isSendButtonEnabled,
    closeMention,
    mentionItemsVisible,
    isTextUpdated,
    iconSendForTextInput,
    iconSendDisabledForTextInput,
    iconMentionForTextInput,
    iconCloseMentionForTextInput,
    mentionsTypes,
    keyboardAvoidingViewProps,
    maxHeightMentionWindow,
    sendDisabled: !isTextUpdated && !isSendButtonEnabled,
    setInputTextRefCallback,
    isMultilineEnabled,
    textInputProps,
    mentionWindowStyle,
    containerTextInputStyle,
    renderMentionType,
  };
};

export default useMention;
