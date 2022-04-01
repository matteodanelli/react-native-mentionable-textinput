import {
  addMentionIntoText,
  onChangeMentionableText,
  generateUUID,
  getCursorPointer,
} from '../helper';
import {
  CursorPosition,
  Mention,
  MentionListItem,
  SearchCursorPosition,
  Typing,
} from '../types';
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Props } from '../types';
import { Text, TextInput } from 'react-native';
import styles from '../style';
import useMultiSearchMention from './useMultiSearchMention';

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
    isSmartSearchEnabled,
    testID,
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

  const [inputText, setInputText] = useState(initialText || '');
  const [mentioned, setMentioned] = useState(initialMentioned || []);
  const [showMentionTypes, setShowMentionTypes] = useState(false);
  const [showMentionItems, setShowMentionItems] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    start: 0,
    end: 0,
  });

  const closeMention = useCallback(() => {
    setShowMentionItems(false);
    setShowMentionTypes(false);
  }, []);

  const {
    addSearchMentionPosition,
    setSearchMentionHoverUUID,
    searchMentionHovering,
    pauseSearchMentionPosition,
    manageSearchMentionPosition,
    getSearchMentionFromCursor,
    removeSearchMentionPosition,
    removeAllSearchMentionPosition,
  } = useMultiSearchMention({
    closeMention,
  });

  const onSearchMention = useCallback(
    (currentMention: SearchCursorPosition, fullText: string) => {
      setShowMentionItems(true);
      setShowMentionTypes(false);

      let textToSearch = fullText.slice(
        currentMention.start + 1,
        currentMention.end
      );

      searchMentionableItems?.(currentMention.type, textToSearch);
    },
    [searchMentionableItems]
  );

  useEffect(() => {
    // when user changes props voluntarily
    setMentioned(initialMentioned || []);
  }, [initialMentioned]);

  useEffect(() => {
    // this effect need to pause searching after close mention
    if (showMentionTypes === false && showMentionItems === false) {
      if (onMentionClose) {
        onMentionClose();
      }
      if (searchMentionHovering && isSmartSearchEnabled) {
        pauseSearchMentionPosition(searchMentionHovering.uuid);
      }
    }
  }, [
    onMentionClose,
    searchMentionHovering,
    pauseSearchMentionPosition,
    isSmartSearchEnabled,
    showMentionTypes,
    showMentionItems,
  ]);

  useEffect(() => {
    // when searchMentionHovering changes it's need restart searching mention or close mentions
    if (searchMentionHovering) {
      // it's need restart searching mention
      setShowMentionItems(true);
    } else {
      // it's need close mentions because user went out out of the mention
      closeMention();
    }
  }, [searchMentionHovering, closeMention]);

  const getObjectMentionFromType = useCallback(
    (type: string) => mentionsTypes.find((mT) => mT.type === type),
    [mentionsTypes]
  );
  const getObjectMentionFromChar = useCallback(
    (char: string) => mentionsTypes.find((mT) => mT.mentionChar === char),
    [mentionsTypes]
  );

  const onPressMentionType = useCallback(
    (mentionType: string, localCursorPosition?: CursorPosition) => {
      setShowMentionTypes(false);
      setShowMentionItems(true);

      if (localCursorPosition) {
        // come from typing text
        addSearchMentionPosition(localCursorPosition, mentionType);
      } else {
        // come from mention icon
        const loaclSearchMentionPosition = {
          start: cursorPosition.start,
          end:
            cursorPosition.end === cursorPosition.start
              ? cursorPosition.end + 1
              : cursorPosition.end,
        };

        addSearchMentionPosition(loaclSearchMentionPosition, mentionType);

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
      addSearchMentionPosition,
    ]
  );

  const onChangeText = useCallback(
    (changedText: string) => {
      if (!isMentionsDisabled) {
        const localCursorPosition = getCursorPointer(inputText, changedText);

        const searchMentionEdited = manageSearchMentionPosition(
          localCursorPosition,
          inputText,
          changedText,
          localCursorPosition.type
        );

        if (searchMentionEdited) {
          // during search
          if (searchMentionEdited) {
            onSearchMention(searchMentionEdited, changedText);
          }
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
      inputText,
      isMentionsDisabled,
      mentioned,
      onChangeTextCallback,
      onPressMentionType,
      getObjectMentionFromChar,
      manageSearchMentionPosition,
      onSearchMention,
    ]
  );

  const onSelectionChange = useCallback(
    (event: { nativeEvent: { selection: CursorPosition } }) => {
      if (!isMentionsDisabled) {
        // Save the current position of the cursor
        const { selection } = event.nativeEvent;

        setCursorPosition(selection);
      }
    },
    [isMentionsDisabled]
  );

  useEffect(() => {
    const searchMentionActived = getSearchMentionFromCursor(cursorPosition);

    if (searchMentionActived && !searchMentionHovering) {
      setSearchMentionHoverUUID(searchMentionActived.uuid);
    } else if (!searchMentionActived && searchMentionHovering) {
      setSearchMentionHoverUUID(undefined);
      closeMention();
      if (!isSmartSearchEnabled) {
        removeAllSearchMentionPosition();
      }
    }
  }, [
    closeMention,
    cursorPosition,
    getSearchMentionFromCursor,
    searchMentionHovering,
    setSearchMentionHoverUUID,
    isSmartSearchEnabled,
    removeAllSearchMentionPosition,
  ]);

  const addMention = useCallback(
    (mention: MentionListItem) => {
      if (searchMentionHovering) {
        const mentionType = getObjectMentionFromType(mention.type);
        const newMention: Mention = {
          uuid: generateUUID(),
          id: mention.id,
          type: mention.type,
          label: `${mentionType?.mentionChar}${mention.label}`,
          position: searchMentionHovering.start,
        };

        const { newText, newMentioned } = addMentionIntoText({
          text: inputText,
          mention: newMention,
          mentioned: mentioned,
          currentCursorPosition: searchMentionHovering,
        });

        // Mention added therefore reset cursor position of the search input
        setMentioned(newMentioned);
        setInputText(newText);
        onChangeTextCallback?.(newText, newMentioned);
        removeSearchMentionPosition(searchMentionHovering.uuid);
      }
    },
    [
      inputText,
      mentioned,
      onChangeTextCallback,
      getObjectMentionFromType,
      searchMentionHovering,
      removeSearchMentionPosition,
    ]
  );

  useEffect(() => {
    if (mentionableItems?.length === 0 && isSmartSearchEnabled) {
      // if the api call results has 0 items, the mention must be paused
      setShowMentionItems(false);
      setShowMentionTypes(false);
    }
  }, [mentionableItems, isSmartSearchEnabled]);

  const onSendCallback = useCallback(() => {
    onSend?.(inputText, mentioned);
  }, [inputText, mentioned, onSend]);

  const onPressMentionIcon = useCallback(() => {
    if (showMentionTypes || showMentionItems) {
      setShowMentionItems(false);
      setShowMentionTypes(false);
    } else {
      setShowMentionTypes(true);
    }
  }, [showMentionItems, showMentionTypes]);

  const mentionItemsVisible = useMemo(() => {
    return showMentionItems;
  }, [showMentionItems]);

  const isTextUpdated = useMemo(
    () => !(inputText === initialText || inputText === ''),
    [initialText, inputText]
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

  return {
    mentioned,
    formattedText,
    onChangeText,
    placeholder,
    onSelectionChange,
    cursorPosition,
    onEndTyping,
    addMention,
    chosenMentionType: searchMentionHovering?.type,
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
    isSmartSearchEnabled,
    testID,
  };
};

export default useMention;
