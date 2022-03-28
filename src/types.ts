import { TextInput, View, Text } from 'react-native';
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
} & MentionItemType;

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

export type MentionableUsers = {
  id: string;
  uuid: string;
  firstname: string;
  lastname: string;
  userid: string;
};

export type MentionableAsset = {
  id: string;
  title: string;
  type: string;
  uri: string;
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
  children?: any;
  initialText?: string;
  initialMentioned?: Array<Mention>;
  isMentionsEnabled?: boolean;
  isSendButtonEnabled?: boolean;
  isMultilineEnabled?: boolean;

  //-----------------------------------------//
  // other props
  textInputProps?: any;
  keyboardAvoidingViewProps?: any;
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
  mentionWindowStyle?: any;
  containerTextInputStyle?: any;
  renderMentionForTextInput?: (text: string) => typeof Text;
  renderTextForTextInput?: (text: string) => typeof Text;
  iconSendForTextInput?: typeof View;
  iconSendDisabledForTextInput?: typeof View;
  iconMentionForTextInput?: typeof View;
  iconCloseMentionForTextInput?: typeof View;
  renderMentionType?: (mentionType: string) => typeof View;
  //-----------------------------------------//
};
