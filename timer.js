import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button, Animated } from 'react-native'
import _ from 'lodash'

const buttonSpacing = 120;

export default class Timer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      time: 0,
      athletesArray: [
        {index: 0, name: "first"},
        {index: 1, name: "second"},
        {index: 2, name: "third"},
        {index: 3, name: "fourth"},
        {index: 4, name: "fifth"},
        {index: 5, name: "sixth"},
        {index: 6, name: "seventh"},
        // {index: 7, name: "eighth"},
        // {index: 8, name: "ninth"},
      ],
      totalAthletes: 0,
      currentAthleteOrder: [],
      steps: [],
      btnTopPositions: []
    }
  }

  componentDidMount() {
    this.init();
    const startTime = Date.now();
    this.setState({startTime}, () => {
      this.setState({interval: setInterval(this.update.bind(this), 100)});
    });
  }

  update() {
    const now = Date.now();
    const time = (now - this.state.startTime) / 100;
    this.setState({time});
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  stopTimer() {
    clearInterval(this.state.interval);
  }

  init() { //this will be after sorted team array is created
    // set total athletes + currentAthleteOrder
    const totalAthletes = this.state.athletesArray.length;
    let currentAthleteOrder = []
    for (let i = 0; i < totalAthletes; i++) {
      currentAthleteOrder.push(this.state.athletesArray[i].index)
    }
    // console.log("currentAthleteOrder", currentAthleteOrder)
    this.setState({totalAthletes, currentAthleteOrder}, () => {
      // create steps + initial btnTopPositions
      let steps = []
      let btnTopPositions = []
      for (let i = 0; i < this.state.totalAthletes; i++) {
        steps.push(i * buttonSpacing)
        btnTopPositions.push(new Animated.Value(i * buttonSpacing))
      }
      // console.log("steps", steps)
      // console.log("btnTopPositions", btnTopPositions)
      this.setState({steps, btnTopPositions})
    });
  }

  buttonPress(index) {
    console.log("selected:", index)
    // move pressed button to bottom
    Animated.timing(
      this.state.btnTopPositions[index],
      {
        toValue: this.state.steps[this.state.totalAthletes - 1],
        duration: 250,
      }
    ).start();
    // move up 1 step all buttons below the pressed
    const currentOrderIndex = this.state.currentAthleteOrder.indexOf(index)
    console.log("currentOrderIndex", currentOrderIndex)
    const btnsToMoveUp = this.makeNextButtonsArray(currentOrderIndex)
    // console.log("btnsToMoveUp", btnsToMoveUp)
    this.moveUp(btnsToMoveUp)
    // update currentAthleteOrder
    // console.log("this.state.currentAthleteOrder", this.state.currentAthleteOrder)
    let newCurrentAthleteOrder = []
    for (let i = 0; i < this.state.totalAthletes; i++) {
      newCurrentAthleteOrder.push(this.state.currentAthleteOrder[i]);
    }
    newCurrentAthleteOrder.splice(currentOrderIndex, 1)
    newCurrentAthleteOrder.push(index)
    // console.log("newCurrentAthleteOrder", newCurrentAthleteOrder)
    this.setState({currentAthleteOrder: newCurrentAthleteOrder})
  }

  makeNextButtonsArray(currentOrderIndex) {
    let nextArray = [];
    for (let i = currentOrderIndex + 1 ; i < this.state.totalAthletes; i++) {
      nextArray.push(this.state.currentAthleteOrder[i]);
    }
    // console.log("nextArray", nextArray)
    return nextArray;
  }

  moveUp(btnsArray) {
    btnsArray.forEach((index) => {
      const currentOrderIndex = this.state.currentAthleteOrder.indexOf(index)
      Animated.timing(
        this.state.btnTopPositions[index],
        {
          toValue: this.state.steps[currentOrderIndex - 1],
          duration: 250,
        }
      ).start()
    })
  }

  renderButtons() {
    return _.map(this.state.athletesArray, athlete => {
      return (
        <Animated.View key={athlete.index} style={{position: 'absolute', left: 0, top: this.state.btnTopPositions[athlete.index]}}>
          <TouchableOpacity
            style={styles.athleteButton}
            onPress={() => this.buttonPress(athlete.index)}
          >
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.athleteName}>{athlete.name}</Text>
              <Text style={styles.athleteName}>{this.state.time}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )
    })
  }

  render() {
    return (
      <View style={{backgroundColor: '#BADA55', height: this.state.totalAthletes * buttonSpacing}}>
        <View>
          {this.renderButtons()}
        </View>
        <Button title="cancel" onPress={() => this.stopTimer()} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  athleteButton: {
    height: 100,
    width: 300,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingLeft: 15,
    // marginVertical: 10,
  },
  athleteName: {
    fontSize: 30
  }
})