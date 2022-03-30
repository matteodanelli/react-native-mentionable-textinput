import { StyleSheet } from 'react-native';

const iconHeight = 25;
const maxHeightInputText = 150;
const minHeightInputTextContainer = 25;

export default StyleSheet.create({
  textInputMultiline: {
    flex: 1,
    maxHeight: maxHeightInputText,
    backgroundColor: '#fff',
    textAlignVertical: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },

  textInput: {
    flex: 1,
    maxHeight: minHeightInputTextContainer,
    backgroundColor: '#fff',
    textAlignVertical: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },

  textInInputText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 15,
    paddingTop: 0,
    paddingBottom: 0,
  },

  mentionInInputText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 15,
    paddingTop: 0,
    paddingBottom: 0,
  },

  textArea: {
    flex: 1,
    marginHorizontal: 16,
    textAlignVertical: 'top',
  },

  separator: {
    width: '100%',
    height: 1,
  },

  textInputContainer: {
    flexDirection: 'row',
    maxHeight: maxHeightInputText,
    minHeight: minHeightInputTextContainer,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },

  actionsInputText: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
  },

  textAreaContainer: {
    flex: 1,
  },

  footerPaddingIos: {
    paddingTop: 0,
  },

  emptySlate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
  },

  keyboardIcon: {
    width: iconHeight,
    height: iconHeight,
    marginLeft: 10,
    resizeMode: 'contain',
  },

  closeIcon: {
    width: 40,
    height: 40,
  },

  mentionTypeListItemText: {
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  mentionResultListItemText: {
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
