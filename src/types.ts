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

export type MentionOrganizer = {
  mentionsToDelete: Mention[];
  mentionsToKeep: Mention[];
};

export type TextInputMentionRef = {
  addMention: (mention: MentionListItem) => void;
  closeMention: () => void;
  mentionItemsVisible: boolean;
  chosenMentionType?: string;
};

export type Props = {
  setInputRef?: (ref: React.ElementRef<typeof TextInput>) => void;

  placeholder?: string;
  children?: JSX.Element | JSX.Element[];
  initialText?: string;
  initialMentioned?: Array<Mention>;
  isMentionsEnabled?: boolean;
  isSendButtonEnabled?: boolean;
  isMultilineEnabled?: boolean;

  //-----------------------------------------//
  // other props
  textInputProps?: TextInputProps;
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
  //-----------------------------------------//

  //-----------------------------------------//
  // Mention props
  // make sure it is memoized!
  mentionsTypes?: Array<MentionItemType>;
  refreshData?: (mentionType: string, searchText: string) => void;
  mentionItems?: Array<MentionListItem>; // reuslts of search
  //-----------------------------------------//

  //-----------------------------------------//
  // Callback
  // make sure it is memoized!
  onChangeText?: (text: string, mentioned: Array<Mention>) => void;
  onMentionClose?: () => void;
  onEndTyping?: () => void;
  onSend?: (text: string, mentioned: Array<Mention>) => void;
  //-----------------------------------------//

  //-----------------------------------------//
  // Customizations
  maxHeightMentionWindow?: number;
  mentionWindowStyle?: StyleProp<ViewStyle>;
  containerTextInputStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  mentionStyle?: StyleProp<TextStyle>;
  iconSendForTextInput?: JSX.Element;
  iconSendDisabledForTextInput?: JSX.Element;
  iconMentionForTextInput?: JSX.Element;
  iconCloseMentionForTextInput?: JSX.Element;
  renderMentionType?: (mentionType: string) => JSX.Element;
  separatorColor?: string;
  //-----------------------------------------//
};
