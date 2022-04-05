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

export type MentionItemType = {
  type: string;
  mentionChar: string;
};

export type MentionListItem = {
  id: string;
  label: string;
  type: string;
};

export type Mention = {
  uuid: string;
  id: string;
  label: string;
  position: number;
  type: string;
};

export type CursorPosition = {
  start: number;
  end: number;
};

export type SearchCursorPosition = {
  uuid: string;
  start: number;
  end: number;
  pauseAt?: number;
  type: string;
};

export type MentionOrganizer = {
  mentionsToDelete: Mention[];
  mentionsToKeep: Mention[];
};

export type TextInputMentionRef = {
  addMention: (mention: MentionListItem) => void;
  mentionItemsVisible: boolean;
  chosenMentionType?: string;
};

export type Props = {
  testID?: string;
  setInputRef?: (ref: React.ElementRef<typeof TextInput>) => void;

  mentionsTypes: Array<MentionItemType>;
  initialText?: string;
  placeholder?: string;
  initialMentioned?: Array<Mention>;
  isMentionsDisabled?: boolean;
  isSmartSearchEnabled?: boolean;
  children?: JSX.Element | JSX.Element[];
  mentionableItems: Array<MentionListItem>; // reuslts of search
  searchMentionableItems: (mentionType: string, searchText: string) => void;
  onChangeText?: (text: string, mentioned: Array<Mention>) => void;
  onMentionClose?: () => void;
  onSend: (text: string, mentioned: Array<Mention>) => void;
  onEndTyping?: () => void;
  isSubmitDisabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
  mentionStyle?: StyleProp<TextStyle>;
  mentionContainerStyle?: StyleProp<ViewStyle>;
  textInputContainerStyle?: StyleProp<TextStyle>;
  separatorColor?: string;
  submitIcon: JSX.Element;
  mentionIcon: JSX.Element;
  closeIcon: JSX.Element;
  textInputProps?: TextInputProps;
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
  maxHeightMentionWindow: number;
  renderMentionType?: (mentionType: string) => JSX.Element;
};
