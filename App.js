import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import TicketInfo from './class/TicketInfo';
import ValidateTicketInfo from './class/ValidateTicketInfo';

const App = () => {
  // const ticketInfo = new TicketInfo({name: 'hoang anh dffsd'});
  // console.log(ticketInfo.getName());
  const validateTicketInfo = new ValidateTicketInfo();

  return (
    <View>
      <Text>App</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
