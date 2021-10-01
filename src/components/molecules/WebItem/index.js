import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '../../../utils'

const WebItem = ({ title, body, date, image }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text selectable={true} style={styles.title}>
          {title}
        </Text>
        <Text selectable={true} style={styles.body}>
          {body}
        </Text>
        <Text selectable={true} style={styles.date}>
          {date}
        </Text>
      </View>
      <Image source={{uri: image}} style={styles.image} />
    </View>
  )
}

export default WebItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  titleWrapper: { flex: 1 },
  title: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    maxWidth: '90%',
  },
  body: {
    fontSize: 12,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginTop: 4,
  },
  image: { width: 80, height: 60, borderRadius: 11 },
})
