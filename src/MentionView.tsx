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

type Props<T> = {
  mentionsTypes: Array<MentionItemType<T>>;
  showMentionTypes: boolean;
  showMentionItems: boolean;
  separatorColor: string;
  addMention: (mention: MentionListItem<T>) => void;
  onPressMentionType: (mentionType: T) => void;
  mentionableItems?: Array<MentionListItem<T>>;
  showHeader?: boolean;
  chosenMentionType?: T;
  renderMentionType?: (mentionType: T) => JSX.Element;
  renderMentionItem?: (mention: MentionListItem<T>) => JSX.Element;
  maxHeightMentionWindow?: number;
  mentionContainerStyle?: StyleProp<ViewStyle>;
};

const MentionView = <T,>(props: Props<T>) => {
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
    ({ item, index }: { item: MentionListItem<T>; index: number }) => {
      return (
        <Pressable
          testID={`mention-item-${index}`}
          onPress={() => {
            addMention(item);
          }}
        >
          {renderMentionItem ? (
            renderMentionItem(item)
          ) : (
            <Text
              testID={`mention-item-${index}-text`}
              style={styles.mentionResultListItemText}
            >
              {item.label}
            </Text>
          )}
        </Pressable>
      );
    },
    [addMention, renderMentionItem]
  );

  const getMentionKey = useCallback(
    (item: MentionListItem<T>): string => `${item.id}-${item.label}`,
    []
  );

  const renderMentionTypes = useMemo(
    () => (
      <View style={mentionContainerStyle}>
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />
        {mentionsTypes.map((mentionType) => {
          return (
            <Pressable
              testID={`mention-type-${mentionType.type}`}
              onPress={() => {
                onPressMentionType(mentionType.type);
              }}
            >
              {renderMentionType ? (
                renderMentionType(mentionType.type)
              ) : (
                <Text style={styles.mentionTypeListItemText}>
                  {`${mentionType.type}`}
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
