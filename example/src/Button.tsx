import { Text, TouchableOpacity } from 'react-native';
import styles from './Styles';
import React from 'react';

class Button extends React.Component<{
  onPress: any;
  title: string;
  style?: any;
  disabled?: boolean;
}> {
  render() {
    let { onPress, title, style, disabled } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.button, disabled ? styles.disabledButton : {}, style]}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

export default Button;
