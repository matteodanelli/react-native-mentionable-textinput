# react-native-mentionable-textinput

ReactNative TextInput with enhanced capabilities for mentions

## Installation

```sh
npm install react-native-mentionable-textinput
```

## Usage

```js
import { TextInputMention } from "react-native-mentionable-textinput";

// ...

<TextInputMention
  mentionsTypes={[
    {
      type: 'channels',
      mentionChar: '/',
    },
    {
      type: 'tags',
      mentionChar: '#',
    }
  ]}
  // TODO - WIP
/>```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
