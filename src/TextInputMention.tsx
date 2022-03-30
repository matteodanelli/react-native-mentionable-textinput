import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import useMention from './hooks/useMention';
import { Props, TextInputMentionRef } from './types';
import styles from './style';
import useXiaomiWorkaraound from './hooks/useXiaomiWorkaround';
import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import MentionView from './MentionView';

const TextInputMention = forwardRef<TextInputMentionRef, Props>(
  (props: Props, ref) => {
    const {
      formattedText,
      onChangeText,
      placeholder,
      onSelectionChange,
      onEndTyping,
      showMentionItems,
      children,
      showMentionTypes,
      isMentionsDisabled,
      onSendCallback,
      addMention,
      mentionableItems,
      onPressMentionType,
      closeMention,
      mentionItemsVisible,
      chosenMentionType,
      submitIcon,
      mentionIcon,
      closeIcon,
      onPressMentionIcon,
      mentionsTypes,
      sendDisabled,
      keyboardAvoidingViewProps,
      maxHeightMentionWindow,
      setInputTextRefCallback,
      textInputProps,
      mentionContainerStyle,
      textInputContainerStyle,
      renderMentionType,
      separatorColor,
    } = useMention(props);

    useImperativeHandle(
      ref,
      () => ({
        addMention,
        closeMention,
        mentionItemsVisible,
        chosenMentionType,
      }),
      [addMention, closeMention, mentionItemsVisible, chosenMentionType]
    );

    const { hackCaretHidden, onFocus } = useXiaomiWorkaraound();

    const renderMentionIcon = useMemo(() => {
      if (!isMentionsDisabled) {
        if (showMentionItems || showMentionTypes) {
          return (
            <Pressable onPress={onPressMentionIcon}>{closeIcon}</Pressable>
          );
        } else {
          return (
            <Pressable onPress={onPressMentionIcon}>{mentionIcon}</Pressable>
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
    ]);

    const renderSendIcon = useMemo(() => {
      return submitIcon;
    }, [submitIcon]);

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        {...keyboardAvoidingViewProps}
      >
        <View>
          {!isMentionsDisabled ? (
            <MentionView
              showMentionItems={showMentionItems}
              showMentionTypes={showMentionTypes}
              addMention={addMention}
              mentionableItems={mentionableItems}
              onPressMentionType={onPressMentionType}
              onClose={closeMention}
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
          <View
            style={[styles.separator, { backgroundColor: separatorColor }]}
          />
          <View style={[styles.textInputContainer, textInputContainerStyle]}>
            <TextInput
              style={{ flex: 1 }}
              ref={setInputTextRefCallback}
              onChangeText={onChangeText}
              enablesReturnKeyAutomatically
              placeholder={placeholder}
              autoCorrect
              caretHidden={hackCaretHidden}
              onFocus={onFocus}
              onSelectionChange={onSelectionChange}
              onEndEditing={onEndTyping}
              {...textInputProps}
            >
              {formattedText}
            </TextInput>
            <View style={styles.actionsInputText}>
              {renderMentionIcon}
              <Pressable onPress={onSendCallback} disabled={sendDisabled}>
                {renderSendIcon}
              </Pressable>
            </View>
          </View>
          <View
            style={[styles.separator, { backgroundColor: separatorColor }]}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
);

export default TextInputMention;
