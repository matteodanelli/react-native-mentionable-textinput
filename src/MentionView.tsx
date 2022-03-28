import { MentionListItem, MentionItemType } from './types';
import React, { Fragment, useCallback, useMemo } from 'react';
import { FlatList, View, Text, Pressable } from 'react-native';
import styles from './style';

type Props = {
  mentionsTypes: Array<MentionItemType>;
  showMentionTypes: boolean;
  showMentionItems: boolean;
  mentionItems?: Array<MentionListItem>;
  addMention: (mention: MentionListItem) => void;
  onPressMentionType: (mentionType: string) => void;
  showHeader?: boolean;
  onClose: () => void;
  chosenMentionType?: string;
  renderMentionType?: (mentionType: string) => typeof View;
  renderMentionItem?: (mention: MentionListItem) => typeof View;
  maxHeightMentionWindow?: number;
  mentionWindowStyle?: any;
};

const MentionView = (props: Props) => {
  const {
    showMentionTypes,
    showMentionItems,
    mentionItems,
    addMention,
    onPressMentionType,
    mentionsTypes,
    renderMentionType,
    renderMentionItem,
    mentionWindowStyle,
    maxHeightMentionWindow = 200,
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
      <View style={mentionWindowStyle}>
        <View style={[styles.separator]} />
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
    [mentionWindowStyle, mentionsTypes, onPressMentionType, renderMentionType]
  );

  if (showMentionTypes) {
    return renderMentionTypes;
  } else if (showMentionItems && mentionItems && mentionItems.length > 0) {
    return (
      <View
        style={{
          maxHeight: maxHeightMentionWindow,
        }}
      >
        <View style={[styles.separator]} />
        <FlatList
          removeClippedSubviews
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          data={mentionItems}
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
