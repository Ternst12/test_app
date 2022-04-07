import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const CartItem = props => {
  return (
    <TouchableOpacity onLongPress={props.onSelect} style={styles.placeItem}>
      <Image style={styles.image} source={{ uri: props.image }} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{props.name}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.valueName}>Height = </Text>
          <Text style={styles.value}>{props.height}</Text>
          <Text style={styles.valueName}>Width = </Text>
          <Text style={styles.value}>{props.width}</Text>
          <Text style={styles.valueName}>Length = </Text>
          <Text style={styles.value}>{props.length}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  placeItem: {
    backgroundColor: Colors.fallGrey,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  valueRow: {
    flexDirection: "row",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1
  },
  infoContainer: {
    marginLeft: 25,
    width: Dimensions.get("screen").width * 0.8,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  title: {
    color: "black",
    fontSize: 24,
    marginBottom: 5
  },
  valueName: {
    color: Colors.fallOragne,
    marginLeft: 25,
    fontSize: 20,
    fontWeight: "bold"
  },
  value: {
    marginLeft: 5,
    color: '#666',
    fontSize: 20
  },
  iconBox: {
    width: "100%",
    flexDirection: "row-reverse"
  },
  icons: {
    marginRight: 25,
  }

});

export default CartItem;
