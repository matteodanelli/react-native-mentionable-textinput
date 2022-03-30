import { MentionListItem, MentionItemType } from './types';
import React, { Fragment, useCallback, useMemo } from 'react';
import {
  FlatList,
  View,
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import styles from './style';

type Props = {
  mentionsTypes: Array<MentionItemType>;
  showMentionTypes: boolean;
  showMentionItems: boolean;
  separatorColor: string;
  onClose: () => void;
  addMention: (mention: MentionListItem) => void;
  onPressMentionType: (mentionType: string) => void;
  mentionableItems?: Array<MentionListItem>;
  showHeader?: boolean;
  chosenMentionType?: string;
  renderMentionType?: (mentionType: string) => JSX.Element;
  renderMentionItem?: (mention: MentionListItem) => JSX.Element;
  maxHeightMentionWindow: number;
  mentionContainerStyle?: StyleProp<ViewStyle>;
};

const MentionView = (props: Props) => {
  const {
    showMentionTypes,
    showMentionItems,
    mentionableItems,
    addMention,
    onPressMentionType,
    mentionsTypes,
    renderMentionType,
    renderMentionItem,
    mentionContainerStyle,
    maxHeightMentionWindow,
    separatorColor,
  } = props;

  const renderMentionItemInternal = useCallback(
    ({ item }: { item: MentionListItem }) => {
      return (
        <Pressable
          onPress={() => {
            addMention(item);
          }}
        >
          {renderMentionItem ? (
            renderMentionItem
          ) : (
            <Text style={styles.mentionResultListItemText}>{item.label}</Text>
          )}
        </Pressable>
      );
    },
    [addMention, renderMentionItem]
  );

  const getMentionKey = useCallback(
    (item: MentionListItem): string => `${item.id}-${item.label}`,
    []
  );

  const renderMentionTypes = useMemo(
    () => (
      <View style={mentionContainerStyle}>
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />
        {mentionsTypes.map((mentionType) => {
          return (
            <Pressable
              onPress={() => {
                onPressMentionType(mentionType.type);
              }}
            >
              {renderMentionType ? (
                renderMentionType(mentionType.type)
              ) : (
                <Text style={styles.mentionTypeListItemText}>
                  {mentionType.type}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    ),
    [
      mentionContainerStyle,
      mentionsTypes,
      onPressMentionType,
      renderMentionType,
      separatorColor,
    ]
  );

  if (showMentionTypes) {
    return renderMentionTypes;
  } else if (
    showMentionItems &&
    mentionableItems &&
    mentionableItems.length > 0
  ) {
    return (
      <View
        style={{
          maxHeight: maxHeightMentionWindow,
        }}
      >
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />
        <FlatList
          removeClippedSubviews
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          data={mentionableItems}
          keyExtractor={getMentionKey}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
          renderItem={renderMentionItemInternal}
        />
      </View>
    );
  } else {
    return <Fragment />;
  }
};

export default MentionView;
