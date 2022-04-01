import React, { useState } from 'react';
import { Alert, ScrollView, SafeAreaView, Text, Image } from 'react-native';
import faker from './faker';
import { type MentionListItem, TextInputMention } from '../../src/index';
import send from './resources/send';
import email from './resources/email';
import close from './resources/close';

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

const App = () => {
  // Styles
  const iconStyle = {
    width: 25,
    height: 25,
    marginLeft: 10,
    resizeMode: 'contain',
  };
  const containerStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  };
  const flexStyle = { flex: 1 };
  const mentionStyle = { fontWeight: '900', color: 'blue' };
  const textStyle = { fontWeight: '500', color: 'red' };
  const textInputProps = {
    multiline: true,
    style: {
      flex: 1,
      maxHeight: 150,
      textAlignVertical: 'center',
      paddingTop: 0,
      paddingBottom: 0,
    },
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
    <SafeAreaView style={flexStyle}>
      <ScrollView contentContainerStyle={containerStyle}>
        <Text>Tag something typing @ in the textinput</Text>
      </ScrollView>
      <TextInputMention
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
        submitIcon={<Image style={iconStyle} source={{ uri: send }} />}
        mentionIcon={<Image style={iconStyle} source={{ uri: email }} />}
        closeIcon={<Image style={iconStyle} source={{ uri: close }} />}
        textInputProps={textInputProps}
        maxHeightMentionWindow={200}
        isSmartSearchEnabled={true}
      />
    </SafeAreaView>
  );
};

export default App;
