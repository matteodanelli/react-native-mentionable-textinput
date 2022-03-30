import React, { useState } from 'react';
import { Alert, ScrollView, SafeAreaView, Text } from 'react-native';
import faker from './faker';
import { type MentionListItem, TextInputMention } from '../../src/index';

const users = [...new Array(2500)].map((_, index) => ({
  id: `${index}`,
  label: faker(),
  type: 'users',
  mentionChar: '@',
}));

const App = () => {
  const [userFound, selectUsers] = useState<Array<MentionListItem>>([]);

  const [initialMentioned] = useState([]);

  const refreshData = (mentionsType: string, searchText: string) => {
    if (mentionsType === 'users') {
      selectUsers(
        users.filter((user) =>
          user.label.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  };

  const onSubmit = () => {
    Alert.alert('Message sent!');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Tag something typing @ in the textinput</Text>
      </ScrollView>
      <TextInputMention
        mentionsTypes={[
          {
            type: 'users',
            mentionChar: '@',
          },
        ]}
        initialMentioned={initialMentioned}
        initialText={''}
        refreshData={refreshData}
        onSend={onSubmit}
        isMultilineEnabled
        mentionItems={userFound}
        isMentionsEnabled
        mentionStyle={{ fontWeight: '900', color: 'blue' }}
        textStyle={{ fontWeight: '500', color: 'red' }}
      />
    </SafeAreaView>
  );
};

export default App;
