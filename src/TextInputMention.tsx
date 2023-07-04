import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import useMention from './hooks/useMention';
import { TextInputMentionProps, TextInputMentionRef } from './types';
import styles from './style';
import useXiaomiWorkaraound from './hooks/useXiaomiWorkaround';
import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import MentionView from './MentionView';

const TextInputMention = forwardRef<
  TextInputMentionRef<string>,
  TextInputMentionProps<string>
>((props, ref) => {
  const {
    setInputRef,
    placeholder,
    onEndTyping,
    children,
    keyboardAvoidingViewProps,
    maxHeightMentionWindow,
    textInputProps,
    mentionContainerStyle,
    textInputContainerStyle,
    renderMentionType,
    separatorColor = 'grey',
    testID,
    submitIcon,
    mentionIcon,
    closeIcon,
    isSubmitDisabled,
  } = props;

  const {
    formattedText,
    onChangeText,
    onSelectionChange,
    showMentionItems,
    showMentionTypes,
    isMentionsDisabled,
    onSendCallback,
    addMention,
    mentionableItems,
    onPressMentionType,
    mentionItemsVisible,
    chosenMentionType,
    onPressMentionIcon,
    mentionsTypes,
    isSmartSearchEnabled,
    mentioned,
    searchMentionPositions,
  } = useMention(props);

  useImperativeHandle(
    ref,
    () => ({
      addMention,
      mentionItemsVisible,
      chosenMentionType,
    }),
    [addMention, mentionItemsVisible, chosenMentionType]
  );

  const { hackCaretHidden, onFocus } = useXiaomiWorkaraound();

  const renderMentionIcon = useMemo(() => {
    if (!isMentionsDisabled) {
      if ((showMentionItems || showMentionTypes) && !isSmartSearchEnabled) {
        return (
          <Pressable onPress={onPressMentionIcon} testID="mention-button">
            {closeIcon}
          </Pressable>
        );
      } else {
        return (
          <Pressable onPress={onPressMentionIcon} testID="mention-button">
            {mentionIcon}
          </Pressable>
        );
      }
    } else {
      return <View />;
    }
  }, [
    closeIcon,
    isMentionsDisabled,
    mentionIcon,
    onPressMentionIcon,
    showMentionItems,
    showMentionTypes,
    isSmartSearchEnabled,
  ]);

  const renderSendIcon = useMemo(() => {
    return submitIcon;
  }, [submitIcon]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      {...keyboardAvoidingViewProps}
    >
      <View
        testID="mention-check-value"
        accessibilityLabel={JSON.stringify(mentioned)}
      />
      <View
        testID="search-mention-check-value"
        accessibilityLabel={JSON.stringify(searchMentionPositions)}
      />
      <View testID={testID}>
        {!isMentionsDisabled ? (
          <MentionView
            showMentionItems={showMentionItems}
            showMentionTypes={showMentionTypes}
            addMention={addMention}
            mentionableItems={mentionableItems}
            onPressMentionType={onPressMentionType}
            chosenMentionType={chosenMentionType}
            mentionsTypes={mentionsTypes}
            maxHeightMentionWindow={maxHeightMentionWindow}
            mentionContainerStyle={mentionContainerStyle}
            renderMentionType={renderMentionType}
            separatorColor={separatorColor}
          />
        ) : (
          <View />
        )}
        {children}
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />
        <View style={[styles.textInputContainer, textInputContainerStyle]}>
          <TextInput
            style={styles.textInput}
            ref={setInputRef}
            onChangeText={onChangeText}
            enablesReturnKeyAutomatically
            placeholder={placeholder}
            autoCorrect
            caretHidden={hackCaretHidden}
            onFocus={onFocus}
            onSelectionChange={onSelectionChange}
            onEndEditing={onEndTyping}
            {...textInputProps}
            testID="mention-input-text"
          >
            {formattedText}
          </TextInput>
          <View style={styles.actionsInputText}>
            {renderMentionIcon}
            <Pressable onPress={onSendCallback} disabled={isSubmitDisabled}>
              {renderSendIcon}
            </Pressable>
          </View>
        </View>
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />
      </View>
    </KeyboardAvoidingView>
  );
});

export default TextInputMention;
