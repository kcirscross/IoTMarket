import { StyleSheet } from 'react-native';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../components/constants';

export const globalStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: SECONDARY_COLOR,
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'black',
  },
  input: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    width: '90%',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 10,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  textButton: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  cardContainer: {
    margin: 0,
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});
