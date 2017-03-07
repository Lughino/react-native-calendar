import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import styles from './styles';

export default class Day extends Component {
  static defaultProps = {
    customStyle: {},
  }

  static propTypes = {
    caption: PropTypes.any,
    customStyle: PropTypes.object,
    filler: PropTypes.bool,
    events: PropTypes.arrayOf(PropTypes.object),
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    index: PropTypes.number,
    isWeekend: PropTypes.bool,
    onPress: PropTypes.func,
    showEventIndicators: PropTypes.bool,
  }

  dayCircleStyle = (isWeekend, isSelected, isToday, event) => {
    const { customStyle, showEventIndicators, } = this.props;
    if(showEventIndicators)
      return {};

    const dayCircleStyle = [styles.dayCircleFiller, customStyle.dayCircleFiller];

    if(isSelected) {
      if(isToday) {
        dayCircleStyle.push(styles.currentDayCircle, customStyle.currentDayCircle);
      } else {
        dayCircleStyle.push(styles.selectedDayCircle, customStyle.selectedDayCircle);
      }
    }

    if(event) {
      if(isSelected) {
        dayCircleStyle.push(styles.hasEventDaySelectedCircle, customStyle.hasEventDaySelectedCircle, event.hasEventDaySelectedCircle);
      } else {
        dayCircleStyle.push(styles.hasEventCircle, customStyle.hasEventCircle, event.hasEventCircle);
      }
    }
    return dayCircleStyle;
  }

  dayTextStyle = (isWeekend, isSelected, isToday, event) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.day, customStyle.day];

    if(isToday && !isSelected) {
      dayTextStyle.push(styles.currentDayText, customStyle.currentDayText);
    } else if(isToday || isSelected) {
      dayTextStyle.push(styles.selectedDayText, customStyle.selectedDayText);
    } else if(isWeekend) {
      dayTextStyle.push(styles.weekendDayText, customStyle.weekendDayText);
    }

    if(event) {
      dayTextStyle.push(styles.hasEventText, customStyle.hasEventText, event.hasEventText)
    }
    return dayTextStyle;
  }

  defaultIndicator = (event, index) => {
    const { customStyle } = this.props;
    return (
      <View
        key={`k${index}`}
        style={[
          styles.eventIndicatorFiller,
          customStyle.eventIndicatorFiller,
          event && styles.eventIndicator,
          event && customStyle.eventIndicator,
          event && event.eventIndicator]}
      />
    );
  };

  showIndicators = () => {
    const { events, showEventIndicators, customStyle, } = this.props;
    if(!showEventIndicators || !events)
      return null;

    return (
      <View style={styles.eventIndicatorsContainer}>
        {events.map((event, index) => {
          if(!event.customComponent)
            return this.defaultIndicator(event, index);

          return event.customComponent(event.customProps, index);
        })}
      </View>
    );
  };

  render() {
    let { caption, customStyle } = this.props;
    const {
      filler,
      events,
      isWeekend,
      isSelected,
      isToday,
      showEventIndicators,
      index,
    } = this.props;

    const dBF = Object.assign({}, customStyle.dayButtonFiller);
    const dB = Object.assign({}, customStyle.dayButton);
    if(dBF && dBF.borderLeftWidth)
      dBF.borderLeftWidth = 0;
    if(dB && dB.borderLeftWidth)
      dB.borderLeftWidth = 0;
    const isFirst = index % 7 === 0;
    const dayButtonFiller = isFirst ?
      dBF : customStyle.dayButtonFiller;
    const dayButton = isFirst ?
      dB : customStyle.dayButton;

    return filler
      ? (
        <TouchableWithoutFeedback>
          <View style={[styles.dayButtonFiller, dayButtonFiller]}>
            <Text style={[styles.day, customStyle.day]}/>
          </View>
        </TouchableWithoutFeedback>
      )
      : (
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={[styles.dayButton, dayButton]}>
            <View
              style={this.dayCircleStyle(isWeekend, isSelected, isToday, events)}>
              <Text
                style={this.dayTextStyle(isWeekend, isSelected, isToday, events)}>{caption}</Text>
            </View>
            {this.showIndicators()}
          </View>
        </TouchableOpacity>
      );
  }
}
