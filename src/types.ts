import {
  TextInput,
  TextInputProps,
  KeyboardAvoidingViewProps,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import React from 'react';

export enum Typing {
  addedText = 'addedText',
  deletedText = 'deletedText',
  insertMention = 'insertMention',
}

export type MentionItemType<T> = {
  type: T;
  mentionChar: string;
};

export type MentionListItem<T> = {
  id: string;
  label: string;
  type: T;
};

export type Mention<T> = {
  uuid: string;
  id: string;
  label: string;
  position: number;
  type: T;
};

export type CursorPosition = {
  start: number;
  end: number;
};

export type SearchCursorPosition<T> = {
  uuid: string;
  start: number;
  end: number;
  pauseAt?: number;
  type: T;
  toRemove?: boolean;
};

export type MentionOrganizer<T> = {
  mentionsToDelete: Mention<T>[];
  mentionsToKeep: Mention<T>[];
  isRemovedSomeMention: boolean;
};

export type TextInputMentionRef<T> = {
  addMention: (mention: MentionListItem<T>) => void;
  mentionItemsVisible: boolean;
  chosenMentionType?: string;
};

export type UseMentionProps<T> = {
  mentionsTypes: Array<MentionItemType<T>>;
  initialText?: string;
  initialMentioned?: Array<Mention<T>>;
  isMentionsDisabled?: boolean;
  isSmartSearchEnabled?: boolean;
  mentionableItems: Array<MentionListItem<T>>; // reuslts of search
  searchMentionableItems?: (mentionType: T, searchText: string) => void;
  onChangeText?: (text: string, mentioned: Array<Mention<T>>) => void;
  onMentionClose?: () => void;
  onSend?: (text: string, mentioned: Array<Mention<T>>) => void;
  textStyle?: StyleProp<TextStyle>;
  mentionStyle?: StyleProp<TextStyle>;
};

export type TextInputMentionProps<T> = UseMentionProps<T> & {
  testID?: string;
  setInputRef?: (ref: React.ElementRef<typeof TextInput>) => void;

  children?: JSX.Element | JSX.Element[];
  onEndTyping?: () => void;
  isSubmitDisabled?: boolean;
  placeholder?: string;
  mentionContainerStyle?: StyleProp<ViewStyle>;
  textInputContainerStyle?: StyleProp<TextStyle>;
  separatorColor?: string;
  submitIcon?: JSX.Element;
  mentionIcon?: JSX.Element;
  closeIcon?: JSX.Element;
  textInputProps?: TextInputProps;
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
  maxHeightMentionWindow?: number;
  renderMentionType?: (mentionType: string) => JSX.Element;
};
