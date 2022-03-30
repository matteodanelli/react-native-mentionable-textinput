import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  Pressable,
  Image,
} from 'react-native';
import useMention from './hooks/useMention';
import { Props, TextInputMentionRef } from './types';
import styles from './style';
import useXiaomiWorkaraound from './hooks/useXiaomiWorkaround';
import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import MentionView from './MentionView';
import cancel from './resources/cancel';
import email from './resources/email';
import send from './resources/send';
import send_disabled from './resources/send_disabled';

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
      isMentionsEnabled,
      onSendCallback,
      onPressMentionIcon,
      addMention,
      mentionItems,
      onPressMentionType,
      closeMention,
      mentionItemsVisible,
      chosenMentionType,
      iconSendForTextInput,
      iconSendDisabledForTextInput,
      iconMentionForTextInput,
      iconCloseMentionForTextInput,
      mentionsTypes,
      sendDisabled,
      keyboardAvoidingViewProps,
      maxHeightMentionWindow,
      setInputTextRefCallback,
      isMultilineEnabled,
      textInputProps,
      mentionWindowStyle,
      containerTextInputStyle,
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
      if (isMentionsEnabled) {
        if (showMentionItems || showMentionTypes) {
          return (
            <Pressable onPress={onPressMentionIcon}>
              {iconCloseMentionForTextInput ? (
                iconCloseMentionForTextInput
              ) : (
                <Image style={styles.keyboardIcon} source={{ uri: cancel }} />
              )}
            </Pressable>
          );
        } else {
          return (
            <Pressable onPress={onPressMentionIcon}>
              {iconMentionForTextInput ? (
                iconMentionForTextInput
              ) : (
                <Image style={styles.keyboardIcon} source={{ uri: email }} />
              )}
            </Pressable>
          );
        }
      } else {
        return <View />;
      }
    }, [
      isMentionsEnabled,
      showMentionItems,
      showMentionTypes,
      onPressMentionIcon,
      iconCloseMentionForTextInput,
      iconMentionForTextInput,
    ]);

    const renderSendIcon = useMemo(() => {
      if (sendDisabled) {
        if (iconSendDisabledForTextInput) {
          return iconSendDisabledForTextInput;
        } else {
          return (
            <Image
              style={styles.keyboardIcon}
              source={{ uri: send_disabled }}
            />
          );
        }
      } else {
        if (iconSendForTextInput) {
          return iconSendForTextInput;
        } else {
          return <Image style={styles.keyboardIcon} source={{ uri: send }} />;
        }
      }
    }, [iconSendDisabledForTextInput, iconSendForTextInput, sendDisabled]);

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        {...keyboardAvoidingViewProps}
      >
        <View>
          {isMentionsEnabled ? (
            <MentionView
              showMentionItems={showMentionItems}
              showMentionTypes={showMentionTypes}
              addMention={addMention}
              mentionItems={mentionItems}
              onPressMentionType={onPressMentionType}
              onClose={closeMention}
              chosenMentionType={chosenMentionType}
              mentionsTypes={mentionsTypes}
              maxHeightMentionWindow={maxHeightMentionWindow}
              mentionWindowStyle={mentionWindowStyle}
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
          <View style={[styles.textInputContainer, containerTextInputStyle]}>
            <TextInput
              style={[
                isMultilineEnabled
                  ? styles.textInputMultiline
                  : styles.textInput,
                Platform.OS === 'ios' ? styles.footerPaddingIos : {},
              ]}
              ref={setInputTextRefCallback}
              multiline={true}
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
