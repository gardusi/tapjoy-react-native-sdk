import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'flex-end',
  },
  clearButton: {
    flex: 0,
    width: 50,
    backgroundColor: '#FDAA1C',
    borderRadius: 5,
    padding: 10,
    height: 40,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 50,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FDAA1C',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    alignSelf: 'flex-start',
  },
  enabledButton: {},
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#6A4810',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonGap: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
  },
  textInputLabel: {
    width: 50,
  },
  leftSpacing: {
    marginLeft: 10,
  },
  statusText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
  },
  labelText: {
    color: 'black',
    alignItems: 'flex-start',
    justifyContent: 'center',
    textAlign: 'left',
  },
  currencyOuterContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  currencyInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  currencyButtonContainer: {
    flex: 1,
    padding: 3,
  },
  selectionContainer: {
    paddingTop: 10,
    alignItems: 'center',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  versionText: {
    textAlign: 'center',
    width: '100%',
    paddingBottom: 5,
  },
  tabBarLabelStyle: {
    fontWeight: '400',
    fontSize: 10,
  },
  tabBarIconStyle: {
    display: 'none',
  },
  lineGap: {
    marginBottom: 10,
  },
  zeroFlex: {
    flex: 0,
  },
  flexGrow: {
    flexGrow: 1,
  },
  userPropertiesLabel: {
    width: 130,
    paddingRight: 14,
    paddingLeft: 10,
    color: 'black',
  },
  selectedItemText: {
    fontSize: 16,
    marginTop: 20,
  },
  selectionMenuContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  item: {
    flexGrow: 1,
    flexShrink: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: '#ccc',
  },
  itemText: {
    fontSize: 10,
    color: '#000',
  },
  selectionMenuItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  flatListContent: {
    flexGrow: 1,
  },
  offerwallScrollContainer: {
    height: '70%',
  },
  owLogContainer: {
    height: '30%',
    padding: 10,
    backgroundColor: '#DDDDDD',
  },
});

export const pickerSelectStyles = StyleSheet.create({
  placeholder: {
    color: '#999999',
  },
  viewContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    justifyContent: 'center',
    height: 40,
  },
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    minWidth: 200,
  },
  inputAndroid: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default styles;
