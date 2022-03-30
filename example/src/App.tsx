import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, SafeAreaView, Text } from 'react-native';
import faker from './faker';
import { type MentionListItem, TextInputMention } from '../../src/index';

const users = [...new Array(30)].map((_, index) => ({
  id: `${index}`,
  label: index === 0 ? 'test@gmail.com' : faker(),
  type: 'users',
  mentionChar: '@',
}));

const assets = [...new Array(30)].map((_, index) => ({
  id: `${index}`,
  label: faker(),
  type: 'assets',
  mentionChar: '#',
}));

const channels = [...new Array(30)].map((_, index) => ({
  id: `${index}`,
  label: faker(),
  type: 'channels',
  mentionChar: '/',
}));

const App = () => {
  const [userFound, selectUsers] = useState<Array<MentionListItem>>([]);

  const [initialMentioned] = useState([]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Pressable>
          <Text>First</Text>
          {[...new Array(50)].map(() => (
            <Text>test</Text>
          ))}
          <Text>End</Text>
        </Pressable>
      </ScrollView>
      <TextInputMention
        mentionsTypes={[
          {
            type: 'users',
            mentionChar: '@',
          },
          {
            type: 'channels',
            mentionChar: '/',
          },
          {
            type: 'assets',
            mentionChar: '#',
          },
        ]}
        initialMentioned={initialMentioned}
        initialText={''}
        refreshData={(mentionsType, searchText) => {
          console.log('mentionsType', mentionsType);
          if (mentionsType === 'users') {
            selectUsers(
              users.filter((user) =>
                user.label.toLowerCase().includes(searchText.toLowerCase())
              )
            );
          } else if (mentionsType === 'assets') {
            selectUsers(
              assets.filter((asset) =>
                asset.label.toLowerCase().includes(searchText.toLowerCase())
              )
            );
          } else if (mentionsType === 'channels') {
            selectUsers(
              channels.filter((channel) =>
                channel.label.toLowerCase().includes(searchText.toLowerCase())
              )
            );
          }
        }}
        onSend={() => {
          Alert.alert('send');
        }}
        isMultilineEnabled
        mentionItems={userFound}
        isMentionsEnabled
      />
    </SafeAreaView>
  );
};

export default App;
