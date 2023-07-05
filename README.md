# react-native-mentionable-textinput

ReactNative TextInput with enhanced capabilities for mentions

[![CircleCI](https://circleci.com/gh/matteodanelli/react-native-mentionable-textinput/tree/main.svg?style=svg)](https://circleci.com/gh/matteodanelli/react-native-mentionable-textinput/tree/main)
[![npm version](https://badge.fury.io/js/react-native-mentionable-textinput.svg)](https://badge.fury.io/js/react-native-mentionable-textinput)

## Features

- Tag multiple items using different characters
- Live search across mentionable items
- Customizable textinput icons and style
- Search among words with spaces
- Detox-tested and works as a charm out of the box!
- Hook useMention available


## Installation

```sh
yarn add react-native-mentionable-textinput
yarn add react-native-device-info
cd ios; pod install; cd ..
```

## Showcase
[Sample](https://github.com/matteodanelli/react-native-mentionable-textinput/assets/1923835/9cc07f54-98aa-4fd8-ba23-2e86c432d23e)

## Usage

```js
import { TextInputMention } from "react-native-mentionable-textinput";

// ...

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
    onSend={onSubmit}
    searchMentionableItems={searchItems}
    mentionableItems={itemsFound}
    submitIcon={<Image style={iconStyle} source={{ uri: send }} />}
    mentionIcon={<Image style={iconStyle} source={{ uri: email }} />}
    closeIcon={<Image style={iconStyle} source={{ uri: close }} />}
    maxHeightMentionWindow={200}
  />
```
### Component props
| Name | Type | Mandatory | Additional info |
| - | - | - | - |
| mentionsTypes | Array<MentionItemType> | ✔️ | Type of objects that can be mentioned |
| initialText | string | ❌ | Initial text of the text input |
| placeholder | string | ❌ | Text input placeholder |
| initialMentioned | Array<Mention> | ❌ | Every mention is contained in this array. Fill it with inital mention elements |
| isMentionsDisabled | boolean | ❌ | False if text input should not have mentions |
| isSendButtonDisabled | boolean | ❌ | True if text input submit button is disable. |
| isSmartSearchEnabled | boolean | ❌ | True if [smart search](./smartSearch.md) should be enabled |
| children | Array<JSX.Element> | ❌ | Optional view that will be attached above text input |
| mentionableItems | Array<MentionListItem> | ✔️ | List of visible items that can be mentioned |
| searchMentionableItems | (mentionType: string, searchText: string) => void | ✔️ | Search callback to filter mentionable items |
| onChangeText | (text: string, mentioned: Array<Mention>) => void | ❌ | Callback passed to text input |
| onMentionClose | () => void | ❌ | Callback when the list of mentionable items is closed |
| onSend | (text: string, mentioned: Array<Mention>) | ✔️ | Called on submit |
| onEndTyping | () => void | ❌ | Callback passed to text input |
|  |  |  |  |
| textStyle | StyleProp<TextStyle> | ❌ | Style of text, excluded mentions |
| mentionStyle | StyleProp<TextStyle> | ❌ | Style of mentions, included mention character |
| mentionContainerStyle | StyleProp<ViewStyle> | ❌ | Style of mentions container view |
| textInputContainerStyle| StyleProp<TextStyle> | ❌ | Style of text input container |
| separatorColor | string | ❌ | Color of the separator between text input and mention window |
| submitIcon | JSX.Element | ✔️ | Icon for on submit action |
| mentionIcon | JSX.Element | ✔️ | Icon for mention |
| closeIcon | JSX.Element | ✔️ | Icon for close |
|  |  |  |  |
| textInputProps | TextInputProps | ❌ | Props for native TextInput |
| keyboardAvoidingViewProps | KeyboardAvoidingViewProps | ❌ | Props for native KeyboardAvoidingView |
|  |  |  |  |
| maxHeightMentionWindow | number | ✔️ | Max height of mentions container view |
| renderMentionType | (mentionType: string) => JSX.Element | ❌ | Custom render of mentionable items |

### Hooks properties

`useMentions` hooks is exposed.
You can create with
```
  const hook = useMention({
    mentionsTypes: [
      {
        type: 'TYPE_1',
        mentionChar: '+',
      }
    ],
    mentionableItems: [
      {id: '1', label: 'First item label', type: 'TYPE_1'},
      ...
    ],
  });
```
and the following properties are available:

| Name | Type | Additional info |
| - | - | - |
| mentioned | Array<Mention> | List of mentioned items |
| formattedText | string | Complete label to place into input text |
| onChangeText | (text: string, mentioned: Array<Mention<T>>) => void | Callback on change text |
| onSelectionChange | (event: { nativeEvent: { selection: CursorPosition } }) => void | Callback when text is selected |
| cursorPosition | { start: number; end: number } | Position of the cursor |
| addMention | (mention: {id: string; label: string; type: T}) => void | Add a new mentioned item |
| chosenMentionType | string - type T | Type of the selected mention item |
| showMentionItems | boolean | Check if mention items should be visible |
| showMentionTypes | boolean | Check if mention types should be visible |
| isMentionsDisabled | boolean | Check if mention feature is enabled |
| onSendCallback | () => void | Callback of textinput onSend |
| onPressMentionIcon | () => void | Callback when mention icon is pressed |
| mentionableItems | Array<MentionListItem<T>> | List of all mentionable items |
| onPressMentionType | (mentionType: T, localCursorPosition?: CursorPosition) => void | Callback when a type is selected |
| closeMention | () => void | Callback when mention popup is closed |
| mentionItemsVisible | boolean | Check if showMentionItems with items list should be visible |
| isTextUpdated | boolean | Returns if text has changed wrt initial text |
| mentionsTypes | Array<MentionItemType<T>> | List of mention types |
| isSmartSearchEnabled | boolean | True if smart search is active |
| searchMentionPositions | Array<SearchCursorPosition<T>> | List of positions of all mentions |
| inputText | string | It's the text contained in the input field |
| setInputText | (text): string) => void | callback to set text inside textinput |

This hook could be used to create you own custom component using some of this library logic. Let me know if you find it useful!
## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
