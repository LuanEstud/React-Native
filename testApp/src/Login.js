import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, TextInput, Button, AsyncStorage, StyleSheet } from 'react-native';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount(){
    const username = await AsyncStorage.getItem('@app:username')

    if(username){
      this.props.navigation.navigate("App");
    }
  }

  login = async () => {
    const {username} = this.state;

    if(!username.length) return;

    await AsyncStorage.setItem('@app:username', username);

    this.props.navigation.navigate("App");
  }

  inputChange = username => {
    this.setState({username});
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={style.fundo}>
        <View style={style.view}>
          <TextInput 
            placeholder="Nome do usuário" 
            returnKeyType="Entrar"
            onSubmitEditing={this.login}
            onChangeText={this.inputChange}
            value={this.state.username}
            style={style.input}
            />
          <Button onPress={this.login} title='Entrar'/>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const style = StyleSheet.create({
  fundo:{
    flex: 1,
    backgroundColor: '#87CEEB'
  },
  view:{
    alignContent: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input: {
    height: 100,
  }
})
