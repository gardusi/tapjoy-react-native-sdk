import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
  clearButton: {
    flex: 0,
    width: 50,
    backgroundColor: '#FDAA1C',
    borderRadius: 5,
    padding: 10,
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 50,
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
    marginRight: 10,
    color: 'black',
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
  logText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  versionText: {
    position: 'absolute',
    bottom: 0,
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
  owLogContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  userIdLabel: {
    paddingRight: 14,
    color: 'black',
  },
});

export default styles;
