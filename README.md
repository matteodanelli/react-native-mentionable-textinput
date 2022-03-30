# react-native-mentionable-textinput

ReactNative TextInput with enhanced capabilities for mentions

## Installation

```sh
npm install react-native-mentionable-textinput
npm install react-native-device-info # Needed to fix a well-known textinput bug on Xiaomi family devices
cd ios; pod install ## Needed to link react-native-device-info
```

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
| children | JSX.Element \| JSX.Element[] | ❌ | Optional view that will be attached above text input |
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
| textInputContainerStyle?| StyleProp<TextStyle> | ❌ | Style of text input container |
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

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
