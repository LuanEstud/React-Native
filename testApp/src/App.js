
import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, Alert, Image, AsyncStorage} from 'react-native';
import {RNCamera} from 'react-native-camera';
import SocketIOClient from 'socket.io-client';
import api from '../api';

export default class App extends Component{
        
  constructor(props) {
    super(props);
  
    // Creating the socket-client instance will automatically connect to the server.
    this.socket = SocketIOClient('http://192.168.10.48:3000');

    getUsername = async() =>{
      const username = await AsyncStorage.getItem('@app:username');
      this.socket.emit('login', username);
    }
    
    getUsername();
    
    this.socket.on('lobbyWin', (win) => {
      this.setState({nome: !win ? 'Vocês Empataram' : win == this.socket.id ? 'Você ganhou' : 'Você perdeu'});
    });
  }

  state = {disabled: false, nome: ''}
  
  // takePicture = async () => {
  //   if (this.camera) {
  //     const options = { quality: 0.5, base64: true };
  //     const data = await this.camera.takePictureAsync(options)
  //     this.setState({img: data.uri});
  //   }
  // };

  async _testAlert(jogada){
    const id = this.socket.id;

    // this.socket.emit('lobby', {
    //   jogada,
    //   id
    // });

    this.setState({disabled: true});

    await api.post('jogada', {jogador: { jogada, id }});

    //this.takePicture();
  };

  async _logout(){
    const username = await AsyncStorage.getItem('@app:username');
    await AsyncStorage.removeItem('@app:username');
    this.socket.emit('logout', {id: socket.id, username});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>JOKENPÔ</Text>
        </View>
        <View style={styles.buttons}>
          <Button disabled={this.state.disabled} style={styles.button}
            onPress={() =>{
              this._testAlert('Pedra')
            }}
            title='Pedra'/>
          <Button disabled={this.state.disabled} style={styles.button}
            onPress={() =>{
              this._testAlert('Papel')
            }}
            title='Papel'/>
          <Button disabled={this.state.disabled} style={styles.button}
            onPress={() =>{
              this._testAlert('Tesoura')
            }}
            title='Tesoura'/>
        </View>
        <View style={styles.result}>
          <Text style={styles.title}>{this.state.nome}</Text>
        </View>
        <Image style = {styles.imagem}
          source={{uri: this.state.img}}
        />
        {/* <RNCamera
          ref={rf => { this.camera = rf }}
          style = {styles.preview}
          type={RNCamera.Constants.Type.front}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          flashMode={RNCamera.Constants.FlashMode.off}
          permissionDialogTitle={'Premissão para usar a camera'}
          permissionDialogMessage={'Nós precisamos de sua permissão para usar sua camera'}
        /> */}
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.takePicture} style={styles.capture}>
            <Text style={styles.buttonText}> Foto </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#32CD32',
    height: 100,
  },
  title:{
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
  },
  buttons:{
    paddingTop: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button:{
    width: 100,
    backgroundColor: '#4169E1',
  },
  result:{
    marginTop: 100,
    flexDirection: 'row',
    height:200,
    backgroundColor: '#87CEEB',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  preview: {
    flex: 0,
    alignSelf: 'flex-end',
    width: 100,
    height: 200,
    position: 'absolute',
    bottom: 0,
    display: 'none',
  },
  imagem:{
    flex: 0,
    width: 100,
    height: 200,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  }
});
