import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import faker from './faker';
import { type MentionListItem, TextInputMention } from '../../src/index';
import send from './resources/send';
import email from './resources/email';
import close from './resources/close';

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

// Mock data
const users = [...new Array(2500)].map((_, index) => ({
  id: `${index}`,
  label: faker(),
  type: 'users',
}));
const channels = [...new Array(2500)].map((_, index) => ({
  id: `${index}`,
  label: faker(),
  type: 'channels',
}));

const styles = StyleSheet.create({
  iconStyle: {
    width: 25,
    height: 25,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexStyle: { flex: 1 },
  mentionStyle: { fontWeight: '900', color: 'blue' },
  textStyle: { fontWeight: '500', color: 'red' },
  textInputStyle: {
    flex: 1,
    maxHeight: 150,
    textAlignVertical: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
});

const App = () => {
  // Styles
  const textInputProps: TextInputProps = {
    multiline: true,
    textContentType: 'password',
    style: styles.textInputStyle,
  };
  // States
  const [itemsFound, setItemsFound] = useState<Array<MentionListItem>>([]);

  // Handlers
  const searchItems = (mentionsType: string, searchText: string) => {
    if (mentionsType === 'users') {
      setItemsFound(
        users.filter((user) =>
          user.label.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
    if (mentionsType === 'channels') {
      setItemsFound(
        channels.filter((channel) =>
          channel.label.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  };
  const onSubmit = () => {
    Alert.alert('Message sent!');
  };

  return (
    <SafeAreaView style={styles.flexStyle} testID="mention-app">
      <ScrollView contentContainerStyle={styles.containerStyle}>
        <Text testID="label-intro">
          Tag something typing @ in the textinput
        </Text>
      </ScrollView>
      <TextInputMention
        testID="mention-component"
        mentionsTypes={[
          {
            type: 'users',
            mentionChar: '@',
          },
          {
            type: 'channels',
            mentionChar: '#',
          },
        ]}
        mentionableItems={itemsFound}
        searchMentionableItems={searchItems}
        onSend={onSubmit}
        submitIcon={<Image style={styles.iconStyle} source={{ uri: send }} />}
        mentionIcon={<Image style={styles.iconStyle} source={{ uri: email }} />}
        closeIcon={<Image style={styles.iconStyle} source={{ uri: close }} />}
        // @ts-ignore
        textInputProps={textInputProps}
        maxHeightMentionWindow={200}
        isSmartSearchEnabled={true}
      />
    </SafeAreaView>
  );
};

export default App;
